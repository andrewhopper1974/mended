"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "@/components/IntroScreen";
import QuizScreen from "@/components/QuizScreen";
import InterstitialScreen from "@/components/InterstitialScreen";
import EmailScreen from "@/components/EmailScreen";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsScreen from "@/components/ResultsScreen";
import PaywallScreen from "@/components/PaywallScreen";
import { QUIZ_FLOW, assignProfile } from "@/lib/quizData";
import type { Profile } from "@/lib/quizData";

export type AppScreen =
  | "intro"
  | "quiz"
  | "email"
  | "loading"
  | "results"
  | "paywall";

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>("intro");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>("stress-escapist");
  const [direction, setDirection] = useState<1 | -1>(1);

  // Handle Stripe cancel redirect back to paywall
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("paywall") === "true") {
        const returnProfile = params.get("profile") as Profile;
        const returnEmail = params.get("email") || "";

        if (returnProfile && returnEmail) {
          setProfile(returnProfile);
          setEmail(returnEmail);
          setScreen("paywall");
          window.history.replaceState({}, document.title, "/");
        }
      }
    }
  }, []);

  // Advance helper — walks quizIndex forward, switching screen when hitting
  // an email checkpoint or the end of the flow.
  const advanceFrom = useCallback(
    (fromIndex: number) => {
      const next = fromIndex + 1;
      if (next >= QUIZ_FLOW.length) {
        // End of quiz → build program → results
        setScreen("loading");
        return;
      }
      const nextItem = QUIZ_FLOW[next];
      setQuizIndex(next);
      if (nextItem.type === "email") {
        setScreen("email");
      } else {
        setScreen("quiz");
      }
    },
    []
  );

  const startQuiz = useCallback(() => {
    setScreen("quiz");
    setQuizIndex(0);
  }, []);

  const handleQuizAdvance = useCallback(
    (questionId: number, selected: string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: selected }));
      setDirection(1);
      advanceFrom(quizIndex);
    },
    [quizIndex, advanceFrom]
  );

  const handleInterstitialDone = useCallback(() => {
    setDirection(1);
    advanceFrom(quizIndex);
  }, [quizIndex, advanceFrom]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    if (quizIndex > 0) {
      const prevIdx = quizIndex - 1;
      const prevItem = QUIZ_FLOW[prevIdx];
      setQuizIndex(prevIdx);
      if (prevItem.type === "email") setScreen("email");
      else setScreen("quiz");
    } else {
      setScreen("intro");
    }
  }, [quizIndex]);

  const handleEmailSubmit = useCallback(
    (submittedEmail: string) => {
      setEmail(submittedEmail);
      const assignedProfile = assignProfile(answers);
      setProfile(assignedProfile);

      // Save lead to Supabase (fire-and-forget)
      fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: submittedEmail,
          answers,
          profile: assignedProfile,
        }),
      }).catch(() => {});

      // Continue the quiz — there are still questions after the email gate
      setDirection(1);
      advanceFrom(quizIndex);
    },
    [answers, quizIndex, advanceFrom]
  );

  const handleLoadingDone = useCallback(() => {
    // Re-assign profile at the end in case more answers were given after email
    const finalProfile = assignProfile(answers);
    setProfile(finalProfile);
    setScreen("results");
  }, [answers]);

  const handleSeeProgram = useCallback(() => {
    setScreen("paywall");
  }, []);

  // Progress calculation — only count real questions (not interstitials/email)
  const questionItems = QUIZ_FLOW.filter(
    (item) => item.type === "question" || item.type === "open-ended"
  );
  const currentItem = QUIZ_FLOW[quizIndex];
  let questionNumber = 0;
  if (currentItem?.type === "question" || currentItem?.type === "open-ended") {
    questionNumber = questionItems.findIndex((q) => q === currentItem) + 1;
  } else {
    // For interstitial / email, show count of questions completed so far
    let count = 0;
    for (let i = 0; i <= quizIndex; i++) {
      const it = QUIZ_FLOW[i];
      if (it && (it.type === "question" || it.type === "open-ended")) count++;
    }
    questionNumber = count;
  }

  const realProgress = questionNumber / questionItems.length;
  const displayProgress = Math.min(realProgress + 0.07, 1);

  return (
    <AnimatePresence>
      {screen === "intro" && (
        <IntroScreen key="intro" onStart={startQuiz} />
      )}

      {screen === "quiz" && currentItem && (
        <>
          {(currentItem.type === "question" || currentItem.type === "open-ended") && (
            <QuizScreen
              key={`q-${quizIndex}`}
              item={currentItem as any}
              questionNumber={questionNumber}
              totalQuestions={questionItems.length}
              progress={displayProgress}
              savedAnswers={answers[currentItem.id] || []}
              onAdvance={handleQuizAdvance}
              onBack={handleBack}
              direction={direction}
              allAnswers={answers}
            />
          )}
          {currentItem.type === "interstitial" && (
            <InterstitialScreen
              key={`i-${quizIndex}`}
              item={currentItem}
              progress={displayProgress}
              onDone={handleInterstitialDone}
              onBack={handleBack}
            />
          )}
        </>
      )}

      {screen === "email" && (
        <EmailScreen
          key="email"
          onSubmit={handleEmailSubmit}
          onBack={handleBack}
          answers={answers}
          profile={assignProfile(answers)}
          progress={displayProgress}
        />
      )}

      {screen === "loading" && (
        <LoadingScreen key="loading" onDone={handleLoadingDone} />
      )}

      {screen === "results" && (
        <ResultsScreen
          key="results"
          profile={profile}
          answers={answers}
          onSeeProgram={handleSeeProgram}
        />
      )}

      {screen === "paywall" && (
        <PaywallScreen key="paywall" profile={profile} email={email} />
      )}
    </AnimatePresence>
  );
}
