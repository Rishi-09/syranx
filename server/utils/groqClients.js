import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getResponse = async (message) => {
  const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: message }
      ]
    });

    const aiReply = response.choices[0].message.content;
    return aiReply;
};
export default  getResponse ;