export type ProfileTag = "stress" | "habit" | "social";

export type QuizOption = {
  text: string;
  emoji?: string;
  tags?: ProfileTag[];
};

export type QuizItem =
  | {
      type: "question";
      id: number;
      question: string;
      options: QuizOption[];
    }
  | {
      type: "open-ended";
      id: number;
      question: string;
      placeholder: string;
      multiline?: boolean;
      inputMode?: "text" | "numeric" | "decimal";
    }
  | { type: "interstitial"; stat: string; copy: string };

// ─────────────────────────────────────────────────────────────────────────────
// Conversion-optimized quiz order (8 questions + 1 interstitial):
//   1. Identity mirror ("this is me") — Q1
//   2. Empathy ("they understand me") — Q3
//   3. Pattern recognition — Q4
//   4. Honest accounting — Q5
//   → interstitial (78%) pattern interrupt
//   5. Physical pain anchor — Q8
//   6. Loss anchor — Q14  (peak pain)
//   7. Meaning / why — Q19  (positive turn)
//   8. Commitment closer — Q23
// ─────────────────────────────────────────────────────────────────────────────
export const QUIZ_FLOW: QuizItem[] = [
  // ─── Identity mirror ──────────────────────────────────────────────────────
  {
    type: "question",
    id: 1,
    question: "What best describes your relationship with alcohol right now?",
    options: [
      { text: "I'd like to drink less, even though it isn't out of control", emoji: "🌱", tags: ["habit"] },
      { text: "I drink most days and often more than I planned", emoji: "📅", tags: ["habit"] },
      { text: "I binge on weekends and struggle to stop once I start", emoji: "🎉", tags: ["social", "habit"] },
      { text: "I drink to calm anxiety or take the edge off emotion", emoji: "😰", tags: ["stress"] },
      { text: "It's become a daily routine I can't seem to break", emoji: "🔄", tags: ["habit"] },
      { text: "I drink socially but rarely stop at one or two", emoji: "👥", tags: ["social"] },
      { text: "I feel like I need it just to feel normal", emoji: "😶", tags: ["stress", "habit"] },
    ],
  },
  // ─── Empathy builder ──────────────────────────────────────────────────────
  {
    type: "question",
    id: 3,
    question: "What does alcohol actually give you in the moment?",
    options: [
      { text: "A way to switch off after a long day", emoji: "🌙", tags: ["stress", "habit"] },
      { text: "It silences the anxiety in my head", emoji: "🧘", tags: ["stress"] },
      { text: "It makes me feel confident and at ease", emoji: "💪", tags: ["social"] },
      { text: "It numbs pain I'd rather not face", emoji: "💔", tags: ["stress"] },
      { text: "It helps me fall asleep", emoji: "😴", tags: ["habit"] },
      { text: "It makes social situations easier", emoji: "🎭", tags: ["social"] },
      { text: "Honestly — I don't even enjoy it anymore. It's just what I do.", emoji: "🤷", tags: ["habit"] },
    ],
  },
  // ─── Pattern recognition — drives profile + personalization ────────────
  {
    type: "question",
    id: 4,
    question: "What most often triggers your urge to drink?",
    options: [
      { text: "Work stress or overwhelm", emoji: "💼", tags: ["stress"] },
      { text: "Loneliness or emptiness", emoji: "🏝️", tags: ["stress"] },
      { text: "Anxiety or a sense of dread", emoji: "😟", tags: ["stress"] },
      { text: "Boredom — nothing else feels good", emoji: "😐", tags: ["habit"] },
      { text: "Conflict in relationships", emoji: "💢", tags: ["stress"] },
      { text: "A specific time of day — it's just automatic", emoji: "⏰", tags: ["habit"] },
      { text: "Social situations or pressure from others", emoji: "🍻", tags: ["social"] },
    ],
  },
  // ─── Honest accounting ────────────────────────────────────────────────────
  {
    type: "question",
    id: 5,
    question: "How much do you typically drink when you sit down to drink?",
    options: [
      { text: "1–2 drinks — but more often than I'd like", emoji: "🥂" },
      { text: "3–4 drinks", emoji: "🍷" },
      { text: "Half a bottle of wine or spirits", emoji: "🍾" },
      { text: "A full bottle of wine or more", emoji: "🫙", tags: ["habit"] },
      { text: "A full bottle of spirits", emoji: "🥃", tags: ["habit"] },
      { text: "I genuinely lose count once I start", emoji: "❓", tags: ["habit"] },
    ],
  },
  // ─── Pattern interrupt ────────────────────────────────────────────────────
  {
    type: "interstitial",
    stat: "78%",
    copy: "of people with your exact triggers have successfully broken free using a structured CBT and mindfulness program. Your patterns are more common than you think — and more treatable.",
  },
  // ─── Physical pain anchor ─────────────────────────────────────────────────
  {
    type: "question",
    id: 8,
    question: "How does your body feel the morning after drinking?",
    options: [
      { text: "Slightly off — I know I'd feel better without it", emoji: "🌫️" },
      { text: "Mild headache and a bit foggy", emoji: "🤕" },
      { text: "Drained and unmotivated", emoji: "😵" },
      { text: "Heart racing or anxious", emoji: "💓", tags: ["stress"] },
      { text: "Shaking, nauseous, or unable to function", emoji: "🤢" },
      { text: "Deeply depressed and full of shame", emoji: "😔", tags: ["stress"] },
      { text: "I need a drink just to feel okay again", emoji: "🍷", tags: ["habit"] },
    ],
  },
  // ─── Loss anchor — peak pain ─────────────────────────────────────────────
  {
    type: "question",
    id: 14,
    question: "What has alcohol already cost you?",
    options: [
      { text: "Time, money, and a bit of self-respect", emoji: "⌛" },
      { text: "Sleep quality, energy, and how I feel in my body", emoji: "🛌" },
      { text: "My confidence and sense of self-worth", emoji: "🏆", tags: ["social"] },
      { text: "Years of my life I can never get back", emoji: "⏳", tags: ["habit"] },
      { text: "Tens of thousands of dollars — maybe more", emoji: "💰", tags: ["habit"] },
      { text: "The person I used to be — the real me", emoji: "🧍", tags: ["stress"] },
      { text: "Trust from the people I love most", emoji: "🤝", tags: ["social"] },
    ],
  },
  // ─── Meaning / why (positive turn) ────────────────────────────────────────
  {
    type: "question",
    id: 19,
    question: "What matters most to you about getting free?",
    options: [
      { text: "Waking up every morning feeling genuinely alive", emoji: "☀️" },
      { text: "Being the parent my children actually deserve", emoji: "👨‍👧" },
      { text: "Rebuilding real intimacy with my partner", emoji: "💝", tags: ["social"] },
      { text: "Getting my health and body back", emoji: "💪" },
      { text: "Feeling proud when I look at myself", emoji: "🏅" },
      { text: "Finally having peace inside my own head", emoji: "🕊️", tags: ["stress"] },
    ],
  },
  // ─── Commitment closer ────────────────────────────────────────────────────
  {
    type: "question",
    id: 23,
    question: "How committed are you to making a real change — right now?",
    options: [
      { text: "Curious and open — I'm exploring this seriously", emoji: "🔍" },
      { text: "Mostly committed, with part of me still holding back", emoji: "🤔" },
      { text: "Deeply committed — but terrified I'll fail again", emoji: "💪", tags: ["stress"] },
      { text: "100%. I am done. This ends today.", emoji: "🔥", tags: ["habit"] },
      { text: "Something finally shifted inside me and I feel ready", emoji: "✨", tags: ["stress"] },
    ],
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
  triggerLabel: string;
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
    triggerLabel: "Emotional overwhelm",
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
    triggerLabel: "Automatic routine",
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
    triggerLabel: "Social pressure",
  },
};

/**
 * Tag-based profile assignment — sums the tags attached to each chosen
 * option. Resilient to copy edits and translations since it does not
 * parse free text.
 */
export function assignProfile(answers: Record<number, string[]>): Profile {
  const scores: Record<ProfileTag, number> = { stress: 0, habit: 0, social: 0 };

  const optionTagMap: Record<number, Record<string, ProfileTag[]>> = {};
  for (const item of QUIZ_FLOW) {
    if (item.type !== "question") continue;
    const map: Record<string, ProfileTag[]> = {};
    for (const opt of item.options) map[opt.text] = opt.tags || [];
    optionTagMap[item.id] = map;
  }

  for (const [qid, selectedOptions] of Object.entries(answers)) {
    const qMap = optionTagMap[Number(qid)];
    if (!qMap) continue;
    for (const optText of selectedOptions) {
      for (const tag of qMap[optText] || []) scores[tag]++;
    }
  }

  if (scores.stress >= scores.habit && scores.stress >= scores.social) return "stress-escapist";
  if (scores.habit >= scores.social) return "habitual-drinker";
  return "social-chameleon";
}

export function vibrate(pattern: number | number[]) {
  try {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}

/**
 * Short trigger label pulled from Q4 (first selected) for personalization.
 * Falls back to the profile's default trigger label.
 */
export function getTriggerLabel(
  answers: Record<number, string[]>,
  profile: Profile
): string {
  const q4 = answers[4]?.[0];
  if (q4) {
    const short: Record<string, string> = {
      "Work stress or overwhelm": "Work stress",
      "Loneliness or emptiness": "Loneliness",
      "Anxiety or a sense of dread": "Anxiety",
      "Boredom — nothing else feels good": "Boredom",
      "Conflict in relationships": "Relationship conflict",
      "A specific time of day — it's just automatic": "Automatic routine",
      "Social situations or pressure from others": "Social pressure",
    };
    if (short[q4]) return short[q4];
  }
  return PROFILES[profile].triggerLabel;
}

/**
 * Strip leading emoji from an answer option text.
 */
function stripEmoji(text: string): string {
  return text.replace(/^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Component}\s]+/u, "").trim();
}

/**
 * Extract personalization insights from quiz answers for use on the
 * results preview and full results screens.
 */
export interface AnswerInsights {
  drinkingPattern: string | null;   // Q1
  whatAlcoholGives: string | null;   // Q3
  triggerLabel: string | null;       // Q4
  drinkingAmount: string | null;     // Q5
  morningAfter: string | null;       // Q8
  alcoholCost: string | null;        // Q14
  motivation: string | null;         // Q19
  commitmentLevel: string | null;    // Q23
}

export function extractAnswerInsights(answers: Record<number, string[]>): AnswerInsights {
  const get = (qid: number) => {
    const raw = answers[qid]?.[0];
    if (!raw) return null;
    return stripEmoji(raw) || raw;
  };

  return {
    drinkingPattern: get(1),
    whatAlcoholGives: get(3),
    triggerLabel: get(4),
    drinkingAmount: get(5),
    morningAfter: get(8),
    alcoholCost: get(14),
    motivation: get(19),
    commitmentLevel: get(23),
  };
}
