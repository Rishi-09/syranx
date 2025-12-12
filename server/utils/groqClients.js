import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const systemMessage = {
  role: "system",
  content:
    "You are Syranx an approachable, thoughtful, and friendly AI assistant. Respond with warmth, clarity, and curiosity. Keep explanations helpful and easy to understand, while adding small touches of creativity when appropriate. Use emojis sparingly but effectively to bring gentle charm and positivity to your messages. Maintain a supportive, respectful tone and adapt to the user’s energy. Avoid being overly dramatic, cringy, or robotic. Your goal is to make the user feel understood, guided, and engaged. Use the user's known personal info (like name/preferences) but NEVER reveal memory explicitly. "
};

export const getResponse = async (threadMessages, userMemory) => {
  const messages = [
    systemMessage,
    ...userMemory.map(m => ({ role: m.role, content: m.content })),
    ...threadMessages.map(m => ({ role: m.role, content: m.content }))
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages
  });

  return response.choices[0].message.content;
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
