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
  | { type: "interstitial"; stat: string; copy: string }
  | { type: "email" };

// ─────────────────────────────────────────────────────────────────────────────
// Conversion-optimized quiz order:
//   1. Identity mirror ("this is me") — Q1
//   2. Empathy ("they understand me") — Q3
//   3. Pattern recognition — Q4
//   4. Physical pain anchor — Q8
//   5. Peak emotional shame — Q9
//   6. Early vulnerability commitment (open-ended) — Q25
//   → interstitial 1 (78%) pattern interrupt
//   7. Honest accounting begins — Q5
//   8. Social mirror — Q11
//   9. Red-flag recognition peak — Q12
//   → interstitial 2 (91%)
//   10. Loss anchor — Q14  (peak pain right before the turn)
//   → EMAIL GATE (captured at peak pain, right before positive turn)
//   → interstitial 3 (3x courage validation)
//   11. Positive turn — Q18
//   12. Meaning / why — Q19
//   → interstitial 4 (94k social proof)
//   13. Commitment level — Q23
//   14. Vision peak — Q24
//   → interstitial 5 (89%) → paywall
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
  // ─── Pattern recognition — drives profile + email chip ───────────────────
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
  // ─── Peak emotional shame ─────────────────────────────────────────────────
  {
    type: "question",
    id: 9,
    question: "How do you feel emotionally the day after drinking?",
    options: [
      { text: "Paralysed with shame and self-disgust", emoji: "😔", tags: ["stress"] },
      { text: "Crushing anxiety — the hangxiety is unbearable", emoji: "😰", tags: ["stress"] },
      { text: "I replay everything I said or did on a loop", emoji: "🔄", tags: ["social", "stress"] },
      { text: "Angry at myself for doing it again", emoji: "😡", tags: ["stress"] },
      { text: "Numb — I just want to get through the day", emoji: "😶", tags: ["habit"] },
      { text: "I've stopped feeling much — I'm just going through the motions", emoji: "🪨", tags: ["habit"] },
    ],
  },
  // ─── Early vulnerability commitment ───────────────────────────────────────
  {
    type: "open-ended",
    id: 25,
    question: "What finally pushed you to take this quiz today?",
    placeholder: "Be honest with yourself — what was the moment or thought that brought you here?",
    multiline: true,
  },
  {
    type: "interstitial",
    stat: "78%",
    copy: "of people with your exact triggers have successfully broken free using a structured CBT and mindfulness program. Your patterns are more common than you think — and more treatable.",
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
  // ─── Social mirror ────────────────────────────────────────────────────────
  {
    type: "question",
    id: 11,
    question: "Has anyone in your life expressed concern about your drinking?",
    options: [
      { text: "Not really — I'm doing this for myself", emoji: "🙋" },
      { text: "A gentle comment here and there", emoji: "💬" },
      { text: "Yes — my partner has confronted me about it", emoji: "💑" },
      { text: "Yes — family members have raised it", emoji: "👨‍👩‍👦" },
      { text: "Yes — close friends have pulled back", emoji: "👫", tags: ["social"] },
      { text: "A doctor has warned me", emoji: "🩺" },
      { text: "No one knows — I keep it completely hidden", emoji: "🤫", tags: ["stress"] },
    ],
  },
  // ─── Red-flag recognition peak ────────────────────────────────────────────
  {
    type: "question",
    id: 12,
    question: "Which of these have you experienced? Select any that apply.",
    options: [
      { text: "None of these — I just want to drink less", emoji: "✨" },
      { text: "Promising yourself you'd stop — and breaking that promise", emoji: "💔", tags: ["habit"] },
      { text: "Drinking more than you intended on a normal night", emoji: "🥂", tags: ["habit"] },
      { text: "Hiding or downplaying how much you drink", emoji: "🙈", tags: ["stress"] },
      { text: "Drinking before noon", emoji: "☀️", tags: ["habit"] },
      { text: "Waking up with no memory of the night before", emoji: "🌑" },
      { text: "Missing something important because of drinking", emoji: "📅" },
      { text: "Driving when you knew you shouldn't have", emoji: "🚗" },
    ],
  },
  {
    type: "interstitial",
    stat: "91%",
    copy: "of people who complete this assessment go on to significantly reduce or eliminate their drinking within 90 days. You're already further along than most people ever get.",
  },
  // ─── Loss anchor — peak pain right before the turn ───────────────────────
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
  // ─── EMAIL CAPTURE — peak pain, right before positive turn ───────────────
  { type: "email" },
  {
    type: "interstitial",
    stat: "3x",
    copy: "People who honestly acknowledge what alcohol has cost them are 3x more likely to achieve lasting sobriety. What you just did takes real courage.",
  },
  // ─── Positive turn ────────────────────────────────────────────────────────
  {
    type: "question",
    id: 18,
    question: "When you imagine your life completely free from alcohol, what comes up?",
    options: [
      { text: "Hope — I know exactly who I could be", emoji: "🌟" },
      { text: "Fear — I genuinely don't know who I am without it", emoji: "😨", tags: ["stress"] },
      { text: "Excitement — I've had glimpses and I want it badly", emoji: "⚡" },
      { text: "Grief — for all the time I've already lost", emoji: "🥲", tags: ["stress"] },
      { text: "Relief — just imagining it makes me feel lighter", emoji: "😮‍💨", tags: ["stress"] },
      { text: "Doubt — I've failed so many times I'm scared to try again", emoji: "😟", tags: ["stress"] },
    ],
  },
  // ─── Meaning / why ────────────────────────────────────────────────────────
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
  {
    type: "interstitial",
    stat: "94,000+",
    copy: "people with answers just like yours have broken free using this program. CBT and mindfulness work on the urge itself — teaching you to recognise it, sit with it, and let it pass instead of fighting it.",
  },
  // ─── Commitment closer ────────────────────────────────────────────────────
  {
    type: "question",
    id: 23,
    question: "How committed are you to making a real change — right now?",
    options: [
      { text: "Curious and open — I'm exploring this seriously", emoji: "🔍" },
      { text: "Mostly committed, with part of me still holding back", emoji: "🤔" },
      { text: "Deeply committed — but terrified I'll fail again", emoji: "💪" },
      { text: "100%. I am done. This ends today.", emoji: "🔥" },
      { text: "Something finally shifted inside me and I feel ready", emoji: "✨" },
    ],
  },
  // ─── Vision peak ──────────────────────────────────────────────────────────
  {
    type: "question",
    id: 24,
    question: "If you woke up tomorrow completely free from alcohol — truly free — what would that mean?",
    options: [
      { text: "Everything. I want my whole life back.", emoji: "🌍" },
      { text: "Being the person my family deserves to have", emoji: "👨‍👩‍👧‍👦", tags: ["social"] },
      { text: "Proving to myself — finally — that I'm stronger than this", emoji: "🏆" },
      { text: "A fresh start. A completely new chapter.", emoji: "🌅" },
      { text: "Peace. Just finally having peace.", emoji: "🕊️", tags: ["stress"] },
      { text: "Living long enough to become who I was always meant to be", emoji: "🚀" },
    ],
  },
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
 * Detects gibberish / keyboard mash in open-ended answers so we don't echo
 * garbage back to users on the email preview chip.
 */
export function isLikelyGibberish(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.length < 10) return true;
  if (!/[aeiou]/.test(t)) return true;
  if (/(qwer|wert|erty|asdf|sdfg|dfgh|zxcv|xcvb|jkl|hjkl|uiop)/.test(t)) return true;
  if (!/\s/.test(t) && t.length < 15) return true;
  const letters = t.replace(/[^a-z]/g, "");
  if (letters.length === 0) return true;
  if (new Set(letters).size < 4) return true;
  return false;
}

/**
 * Pull a short, safe excerpt of Q25 ("what pushed you") for the email
 * preview chip. Returns null if gibberish.
 */
export function getPushExcerpt(answers: Record<number, string[]>): string | null {
  const raw = answers[25]?.[0];
  if (!raw) return null;
  if (isLikelyGibberish(raw)) return null;
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 64) return cleaned;
  return cleaned.slice(0, 61).trimEnd() + "…";
}

/**
 * Short trigger label pulled from Q4 (first selected) for the email chip.
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
