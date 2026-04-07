export type QuizItem =
  | { type: "question"; id: number; question: string; options: string[]; emojis?: (string | null)[] }
  | { type: "open-ended"; id: number; question: string; placeholder: string; multiline?: boolean; inputMode?: "text" | "numeric" | "decimal" }
  | { type: "interstitial"; stat: string; copy: string };

export const QUIZ_FLOW: QuizItem[] = [

  // ─── Phase 1: Hook & Identity — "this gets me" (Q1, Q3, Q4, Q2, Q6) ──────
  // Q1 first: identity mirror. Immediate "oh, this is about me" response.
  {
    type: "question",
    id: 1,
    question: "What best describes your relationship with alcohol right now?",
    options: [
      "I'd like to drink less, even though it isn't out of control",
      "I drink most days and often more than I planned",
      "I binge on weekends and struggle to stop once I start",
      "I drink to calm anxiety or take the edge off emotion",
      "It's become a daily routine I can't seem to break",
      "I drink socially but rarely stop at one or two",
      "I feel like I need it just to feel normal",
    ],
    emojis: ["🌱", "📅", "🎉", "😰", "🔄", "👥", "😶"],
  },
  // Q3 second: most empathetic question — earns trust immediately
  {
    type: "question",
    id: 3,
    question: "What does alcohol actually give you in the moment?",
    options: [
      "A way to switch off after a long day",
      "It silences the anxiety in my head",
      "It makes me feel confident and at ease",
      "It numbs pain I'd rather not face",
      "It helps me fall asleep",
      "It makes social situations easier",
      "Honestly — I don't even enjoy it anymore. It's just what I do.",
    ],
    emojis: ["🌙", "🧘", "💪", "💔", "😴", "🎭", "🤷"],
  },
  // Q4: deepens the "we understand you" — trigger identification
  {
    type: "question",
    id: 4,
    question: "What most often triggers your urge to drink?",
    options: [
      "Work stress or overwhelm",
      "Loneliness or emptiness",
      "Anxiety or a sense of dread",
      "Boredom — nothing else feels good",
      "Conflict in relationships",
      "A specific time of day — it's just automatic",
      "Social situations or pressure from others",
    ],
    emojis: ["💼", "🏝️", "😟", "😐", "💢", "⏰", "🍻"],
  },
  // Q2: now duration confirms the story they've already told — not cold data
  {
    type: "question",
    id: 2,
    question: "How long have you wanted to change your relationship with alcohol?",
    options: [
      "Just recently — I want to get ahead of it",
      "Less than a year",
      "1–3 years",
      "3–5 years",
      "5–10 years",
      "More than 10 years",
      "Most of my adult life — I can't remember it being different",
    ],
    emojis: ["💡", "🌱", "📆", "🗓️", "⏳", "⌛", "💭"],
  },
  // Q6: validates the struggle — "you've tried, you're not weak, you need a different approach"
  {
    type: "question",
    id: 6,
    question: "Have you ever tried to quit or seriously cut back?",
    options: [
      "I've cut back successfully but want to go fully alcohol-free",
      "I've thought about it but never committed",
      "Yes — many times. I always end up back here.",
      "Yes — I managed for a while before relapsing",
      "I'm actively trying right now",
      "I didn't think I needed to — until recently",
    ],
    emojis: ["✂️", "💭", "🔁", "📈", "🔥", "⚡"],
  },

  // ─── Phase 2: Physical & emotional state — pain surfaces naturally ────────
  // Q8 + Q17 + Q9: physical → mental health → emotional. Grouped cluster.
  {
    type: "question",
    id: 8,
    question: "How does your body feel the morning after drinking?",
    options: [
      "Slightly off — I know I'd feel better without it",
      "Mild headache and a bit foggy",
      "Drained and unmotivated",
      "Heart racing or anxious",
      "Shaking, nauseous, or unable to function",
      "Deeply depressed and full of shame",
      "I need a drink just to feel okay again",
    ],
    emojis: ["🌫️", "🤕", "😵", "💓", "🤢", "😔", "🍷"],
  },
  {
    type: "question",
    id: 17,
    question: "How would you describe your mental health right now?",
    options: [
      "Generally okay — but alcohol is keeping me from my best",
      "A bit foggy or low-energy more than I'd like",
      "Anxious more often than I'd like to admit",
      "Severely anxious — nearly all of the time",
      "Depressed and often hopeless",
      "Emotionally shut down and numb",
      "Barely keeping it together on the surface",
      "I've forgotten what feeling genuinely okay actually feels like",
    ],
    emojis: ["🌤️", "🌫️", "😟", "😰", "😔", "😶", "🎭", "❓"],
  },
  {
    type: "question",
    id: 9,
    question: "How do you feel emotionally the day after drinking?",
    options: [
      "Paralysed with shame and self-disgust",
      "Crushing anxiety — the hangxiety is unbearable",
      "I replay everything I said or did on a loop",
      "Angry at myself for doing it again",
      "Numb — I just want to get through the day",
      "I've stopped feeling much — I'm just going through the motions",
    ],
    emojis: ["😔", "😰", "🔄", "😡", "😶", "🪨"],
  },

  // ─── Open-ended: Commitment declaration — fires at Q9 of 22, max investment ─
  {
    type: "open-ended",
    id: 25,
    question: "What finally pushed you to take this quiz today?",
    placeholder: "Be honest with yourself — what was the moment or thought that brought you here?",
    multiline: true,
  },

  // ─── INTERSTITIAL 1 ───────────────────────────────────────────────────────
  {
    type: "interstitial",
    stat: "78%",
    copy: "of people with your exact triggers have successfully broken free using a structured CBT and mindfulness program. Your patterns are more common than you think — and more treatable.",
  },

  // ─── Phase 3: Honest accounting & reality check ───────────────────────────
  // Q5 here feels like honest confession, not early interrogation
  {
    type: "question",
    id: 5,
    question: "How much do you typically drink when you sit down to drink?",
    options: [
      "1–2 drinks — but more often than I'd like",
      "3–4 drinks",
      "Half a bottle of wine or spirits",
      "A full bottle of wine or more",
      "A full bottle of spirits",
      "I genuinely lose count once I start",
    ],
    emojis: ["🥂", "🍷", "🍾", "🫙", "🥃", "❓"],
  },
  // Q11: social mirror — someone else's eyes on the problem
  {
    type: "question",
    id: 11,
    question: "Has anyone in your life expressed concern about your drinking?",
    options: [
      "Not really — I'm doing this for myself",
      "A gentle comment here and there",
      "Yes — my partner has confronted me about it",
      "Yes — family members have raised it",
      "Yes — close friends have pulled back",
      "A doctor has warned me",
      "No one knows — I keep it completely hidden",
    ],
    emojis: ["🙋", "💬", "💑", "👨‍👩‍👦", "👫", "🩺", "🤫"],
  },
  // Q12: peak emotional moment — "be honest with yourself"
  {
    type: "question",
    id: 12,
    question: "Which of these have you experienced? Select any that apply.",
    options: [
      "None of these — I just want to drink less",
      "Promising yourself you'd stop — and breaking that promise",
      "Drinking more than you intended on a normal night",
      "Hiding or downplaying how much you drink",
      "Drinking before noon",
      "Waking up with no memory of the night before",
      "Missing something important because of drinking",
      "Driving when you knew you shouldn't have",
    ],
    emojis: ["✨", "💔", "🥂", "🙈", "☀️", "🌑", "📅", "🚗"],
  },

  // ─── INTERSTITIAL 2 ───────────────────────────────────────────────────────
  {
    type: "interstitial",
    stat: "91%",
    copy: "of people who complete this assessment go on to significantly reduce or eliminate their drinking within 90 days. You're already further along than most people ever get.",
  },

  // ─── Phase 4: Identity & cost — making it deeply personal ────────────────
  {
    type: "question",
    id: 13,
    question: "How does drinking make you feel about yourself?",
    options: [
      "Mostly fine — I just don't love that I can't moderate",
      "Frustrated — I'm better than this",
      "Weak — like I have no self-control",
      "Ashamed — I hate what I've become",
      "Like a fraud — I hide this from everyone around me",
      "Scared — I don't know where this ends",
      "I barely recognise myself anymore",
    ],
    emojis: ["🙂", "😤", "😞", "😔", "🎭", "😨", "🪞"],
  },
  {
    type: "question",
    id: 14,
    question: "What has alcohol already cost you?",
    options: [
      "Time, money, and a bit of self-respect",
      "Sleep quality, energy, and how I feel in my body",
      "My confidence and sense of self-worth",
      "Years of my life I can never get back",
      "Tens of thousands of dollars — maybe more",
      "The person I used to be — the real me",
      "Trust from the people I love most",
    ],
    emojis: ["⌛", "🛌", "🏆", "⏳", "💰", "🧍", "🤝"],
  },

  // ─── Open-ended: Pain anchoring — loss aversion peaks here ───────────────
  {
    type: "open-ended",
    id: 26,
    question: "Describe one moment when drinking cost you something that really mattered.",
    placeholder: "It could be a relationship, an opportunity, a memory, or a feeling about yourself...",
    multiline: true,
  },

  // ─── INTERSTITIAL 3 ───────────────────────────────────────────────────────
  {
    type: "interstitial",
    stat: "3x",
    copy: "People who honestly acknowledge what alcohol has cost them are 3x more likely to achieve lasting sobriety. What you just did takes real courage.",
  },

  // ─── Phase 5: Vision & hope — emotional turnaround ───────────────────────
  {
    type: "question",
    id: 18,
    question: "When you imagine your life completely free from alcohol, what comes up?",
    options: [
      "Hope — I know exactly who I could be",
      "Fear — I genuinely don't know who I am without it",
      "Excitement — I've had glimpses and I want it badly",
      "Grief — for all the time I've already lost",
      "Relief — just imagining it makes me feel lighter",
      "Doubt — I've failed so many times I'm scared to try again",
    ],
    emojis: ["🌟", "😨", "⚡", "🥲", "😮‍💨", "😟"],
  },
  {
    type: "question",
    id: 19,
    question: "What matters most to you about getting free?",
    options: [
      "Waking up every morning feeling genuinely alive",
      "Being the parent my children actually deserve",
      "Rebuilding real intimacy with my partner",
      "Getting my health and body back",
      "Feeling proud when I look at myself",
      "Finally having peace inside my own head",
    ],
    emojis: ["☀️", "👨‍👧", "💝", "💪", "🏅", "🕊️"],
  },
  {
    type: "question",
    id: 20,
    question: "Have you ever had a period of sobriety, even briefly?",
    options: [
      "Yes — I can take long breaks but I keep coming back",
      "Yes — and I felt incredible, truly alive",
      "Yes — but anxiety and restlessness drove me back",
      "I've had brief stretches, never more than a few weeks",
      "I've tried but never made it past a few days",
      "No — I've never seriously tried until now",
      "I'm attempting it right now and want it to stick",
    ],
    emojis: ["🔁", "✨", "😟", "📅", "⚠️", "🤷", "🙏"],
  },

  // ─── Open-ended: Vision crystallization — co-creating the outcome ─────────
  {
    type: "open-ended",
    id: 27,
    question: "Picture your life one year from now, completely free from alcohol. Describe what you see.",
    placeholder: "Your relationships, your health, how you feel when you wake up, who you've become...",
    multiline: true,
  },

  // ─── INTERSTITIAL 4 ───────────────────────────────────────────────────────
  {
    type: "interstitial",
    stat: "94,000+",
    copy: "people with answers just like yours have broken free using this program. CBT and mindfulness work on the urge itself — teaching you to recognise it, sit with it, and let it pass instead of fighting it.",
  },

  // ─── Phase 5: Commitment and emotional peak (Q22–Q24) ────────────────────
  {
    type: "question",
    id: 22,
    question: "What approach to quitting feels most true to you?",
    options: [
      "Something private I can do entirely on my own terms",
      "Addressing the root cause — not just managing symptoms",
      "Rewiring how my brain thinks about alcohol entirely",
      "A structured daily plan with clear stages",
      "Something that works even when willpower fails",
    ],
    emojis: ["🔒", "🌱", "🧠", "📋", "🛡️"],
  },
  {
    type: "question",
    id: 23,
    question: "How committed are you to making a real change — right now?",
    options: [
      "Curious and open — I'm exploring this seriously",
      "Mostly committed, with part of me still holding back",
      "Deeply committed — but terrified I'll fail again",
      "100%. I am done. This ends today.",
      "Something finally shifted inside me and I feel ready",
    ],
    emojis: ["🔍", "🤔", "💪", "🔥", "✨"],
  },
  {
    type: "question",
    id: 24,
    question: "If you woke up tomorrow completely free from alcohol — truly free — what would that mean?",
    options: [
      "Everything. I want my whole life back.",
      "Being the person my family deserves to have",
      "Proving to myself — finally — that I'm stronger than this",
      "A fresh start. A completely new chapter.",
      "Peace. Just finally having peace.",
      "Living long enough to become who I was always meant to be",
    ],
    emojis: ["🌍", "👨‍👩‍👧‍👦", "🏆", "🌅", "🕊️", "🚀"],
  },

  // ─── INTERSTITIAL 5: Final push into paywall ─────────────────────────────
  {
    type: "interstitial",
    stat: "89%",
    copy: "of Mended users report that the very first session changed how they thought about drinking — permanently. Your answers show you're ready. Let's build your program.",
  },
];

export const TOTAL_QUESTIONS = QUIZ_FLOW.filter(
  (item) => item.type === "question" || item.type === "open-ended"
).length;

export type Profile = "stress-escapist" | "habitual-drinker" | "social-chameleon";

export interface ProfileData {
  id: Profile;
  name: string;
  headline: string;
  description: string;
  insights: string[];
  stat: string;
}

export const PROFILES: Record<Profile, ProfileData> = {
  "stress-escapist": {
    id: "stress-escapist",
    name: "The Stress Escapist",
    headline: "You drink to escape — not to enjoy.",
    description:
      "Your brain has learned to use alcohol as an emergency exit from anxiety, emotional pain, and overwhelm. This isn't weakness — it's a deeply ingrained survival mechanism that CBT and mindfulness are specifically designed to retrain.",
    insights: [
      "Your triggers are almost always emotional or stress-related",
      "You likely feel relief the moment you decide to drink — before the first sip",
      "Willpower fails because the urge bypasses rational thought entirely",
      "CBT trigger work and urge surfing teach you to break the loop driving your cravings",
    ],
    stat: "83% of Stress Escapists report cravings dropping within the first 7 days of the program.",
  },
  "habitual-drinker": {
    id: "habitual-drinker",
    name: "The Habitual Drinker",
    headline: "It's not a craving — it's a routine.",
    description:
      "Alcohol has become woven into the fabric of your daily life. Certain times, places, and rituals automatically trigger the urge. Your brain doesn't distinguish between habit and need. The program uses CBT and mindfulness to break the loop at the level of the trigger itself.",
    insights: [
      "Your drinking is tied to specific times or activities, not just emotions",
      "You may not even realise how automatic the behaviour has become",
      "Traditional quitting methods fail because they don't address the habit loop",
      "CBT and mindfulness build new automatic responses to replace the old triggers",
    ],
    stat: "79% of Habitual Drinkers break the daily pattern within 2 weeks using this protocol.",
  },
  "social-chameleon": {
    id: "social-chameleon",
    name: "The Social Chameleon",
    headline: "Alcohol is your social armour.",
    description:
      "You use alcohol to feel comfortable, confident, and accepted in social settings. Without it, social situations feel raw and exposed. The program helps you rebuild authentic confidence that doesn't require chemical support.",
    insights: [
      "You likely feel anxious or out of place in social settings without drinking",
      "Peer pressure and environmental cues are your biggest triggers",
      "You may not feel addicted — but the social reliance is just as real",
      "CBT and mindful self-awareness rebuild natural confidence and social ease from the inside out",
    ],
    stat: "76% of Social Chameleons report feeling socially confident without alcohol after completing the program.",
  },
};

export function assignProfile(answers: Record<number, string[]>): Profile {
  const stressKeywords = [
    "stress", "anxiety", "emotional", "cope", "numb", "calm", "pain", "panic", "escape", "dread", "overwhelm", "shame", "ashamed",
  ];
  const habitKeywords = [
    "habit", "routine", "every day", "boredom", "bored", "morning", "automatic", "daily", "time of day", "lose count",
  ];
  const socialKeywords = [
    "social", "confident", "people", "pressure", "belonging", "situations", "ease", "survivable", "parties",
  ];

  let stressScore = 0;
  let habitScore = 0;
  let socialScore = 0;

  Object.values(answers).forEach((selectedOptions) => {
    selectedOptions.forEach((opt) => {
      const lower = opt.toLowerCase();
      if (stressKeywords.some((k) => lower.includes(k))) stressScore++;
      if (habitKeywords.some((k) => lower.includes(k))) habitScore++;
      if (socialKeywords.some((k) => lower.includes(k))) socialScore++;
    });
  });

  if (stressScore >= habitScore && stressScore >= socialScore) return "stress-escapist";
  if (habitScore >= socialScore) return "habitual-drinker";
  return "social-chameleon";
}

export function vibrate(pattern: number | number[]) {
  try {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}
