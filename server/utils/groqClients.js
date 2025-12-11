import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let history = [];

history.push({
  role: "system",
  content: "You are an approachable, thoughtful, and friendly AI assistant. Respond with warmth, clarity, and curiosity. Keep explanations helpful and easy to understand, while adding small touches of creativity when appropriate. Use emojis sparingly but effectively to bring gentle charm and positivity to your messages. Maintain a supportive, respectful tone and adapt to the user’s energy. Avoid being overly dramatic, cringy, or robotic. Your goal is to make the user feel understood, guided, and engaged."
});

const getResponse = async (message) => {
  
  history.push({
    role: "user",
    content: message,
  });

  if (history.length > 40) {
    history = [
      history[0],               
      ...history.slice(-38), 
    ];
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: history,
  });

  const aiReply = response.choices[0].message.content;

  history.push({
    role: "assistant",
    content: aiReply,
  });

  return aiReply;
};

export default getResponse;
