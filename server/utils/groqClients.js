import Groq from "groq-sdk";
import "dotenv/config";
import logger from "./logger.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemMessage = {
  role: "system",
  content:
    "You are Syranx an approachable, thoughtful, and friendly AI assistant. Respond with warmth, clarity, and curiosity. Keep explanations helpful and easy to understand, while adding small touches of creativity when appropriate. Use emojis sparingly but effectively to bring gentle charm and positivity to your messages. Maintain a supportive, respectful tone and adapt to the user’s energy. Avoid being overly dramatic, cringy, or robotic. Your goal is to make the user feel understood, guided, and engaged. Use the user's known personal info (like name/preferences) but NEVER reveal memory explicitly. "
};

// llama-3.1-8b-instant is capped at 6000 tokens/minute on the on_demand tier.
// Old threads can accumulate more history than that, so only the most recent
// messages (by a rough char-based token estimate) are sent as context.
const MAX_CONTEXT_TOKENS = 4000;
const estimateTokens = (text) => Math.ceil((text || "").length / 4);

const trimToTokenBudget = (messages, maxTokens) => {
  let used = 0;
  const kept = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content);
    if (kept.length > 0 && used + tokens > maxTokens) break;
    used += tokens;
    kept.unshift(messages[i]);
  }
  return kept;
};

export const getResponse = async (threadMessages, userMemory) => {
  const recentThreadMessages = trimToTokenBudget(threadMessages, MAX_CONTEXT_TOKENS);
  if (recentThreadMessages.length < threadMessages.length) {
    logger.warn(
      `Trimmed thread context: ${threadMessages.length} messages to ${recentThreadMessages.length} to fit token budget`
    );
  }

  const messages = [
    systemMessage,
    ...userMemory.map(m => ({ role: m.role, content: m.content })),
    ...recentThreadMessages.map(m => ({ role: m.role, content: m.content }))
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages
  });

  return response.choices[0].message.content;
};

// How many of the most recent messages stay untouched (verbatim) after a compact.
const RECENT_MESSAGES_KEPT = 6;
// Kept well under the 6000 TPM cap so the compaction call itself can't trigger
// the same rate limit it's meant to fix.
const COMPACT_INPUT_TOKEN_BUDGET = 3500;

export const compactConversation = async (threadMessages) => {
  const recent = threadMessages.slice(-RECENT_MESSAGES_KEPT);
  const older = threadMessages.slice(0, -RECENT_MESSAGES_KEPT);

  if (older.length === 0) return null;

  const olderForSummary = trimToTokenBudget(older, COMPACT_INPUT_TOKEN_BUDGET);

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Summarize the conversation below into a short, structured briefing so it can be continued naturally. Use markdown bullet points grouped under: Key facts, Decisions, and Open topics. Skip anything irrelevant to continuing the conversation. Keep it under 200 words.",
      },
      ...olderForSummary.map(m => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 400,
  });

  const summary = response.choices[0].message.content.trim();

  return { summary, recent };
};

export const generateTitle = async (userMessage) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "Generate a short 3–6 word title summarizing the user's message. No quotes." },
      { role: "user", content: userMessage }
    ],
    max_tokens: 15
  });

  return response.choices[0].message.content.trim();
};
