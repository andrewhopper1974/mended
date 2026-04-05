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
  | "analyzing"
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
        const returnPlan = params.get("plan") || "";

        if (returnProfile && returnEmail) {
          setProfile(returnProfile);
          setEmail(returnEmail);
          setScreen("paywall");

          // Clean URL
          window.history.replaceState({}, document.title, "/");
        }
      }
    }
  }, []);

  const startQuiz = useCallback(() => {
    setScreen("quiz");
    setQuizIndex(0);
  }, []);

  const handleQuizAdvance = useCallback(
    (questionId: number, selected: string[]) => {
      const newAnswers = { ...answers, [questionId]: selected };
      setAnswers(newAnswers);
      setDirection(1);

      if (quizIndex < QUIZ_FLOW.length - 1) {
        setQuizIndex(quizIndex + 1);
      } else {
        // Done with all questions - show analyzing screen
        setScreen("analyzing");
      }
    },
    [answers, quizIndex]
  );

  const handleInterstitialDone = useCallback(() => {
    setDirection(1);
    if (quizIndex < QUIZ_FLOW.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Done with all questions - show analyzing screen
      setScreen("analyzing");
    }
  }, [quizIndex]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    if (quizIndex > 0) {
      setQuizIndex(quizIndex - 1);
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

      setScreen("loading");
    },
    [answers]
  );

  const handleAnalyzingDone = useCallback(() => {
    setScreen("email");
  }, []);

  const handleLoadingDone = useCallback(() => {
    setScreen("results");
  }, []);

  const handleSeeProgram = useCallback(() => {
    setScreen("paywall");
  }, []);

  // Calculate progress: question number / total questions, show slightly ahead
  const questionItems = QUIZ_FLOW.filter(
    (item) => item.type === "question" || item.type === "open-ended"
  );
  const currentItem = QUIZ_FLOW[quizIndex];
  let questionNumber = 0;
  if (currentItem?.type === "question" || currentItem?.type === "open-ended") {
    questionNumber = questionItems.findIndex((q) => q === currentItem) + 1;
  } else if (currentItem?.type === "interstitial") {
    // Find how many questions came before this interstitial
    let count = 0;
    for (let i = 0; i <= quizIndex; i++) {
      if (QUIZ_FLOW[i].type === "question" || QUIZ_FLOW[i].type === "open-ended") count++;
    }
    questionNumber = count;
  }

  const realProgress = questionNumber / questionItems.length;
  // Show 5-10% ahead for momentum
  const displayProgress = Math.min(realProgress + 0.07, 1);

  return (
    <AnimatePresence mode="wait">
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

      {screen === "analyzing" && (
        <LoadingScreen key="analyzing" onDone={handleAnalyzingDone} />
      )}

      {screen === "email" && (
        <EmailScreen key="email" onSubmit={handleEmailSubmit} />
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
