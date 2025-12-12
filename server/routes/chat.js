import express from "express";
import Thread from "../models/Thread.js";
import UserMemory from "../models/UserMemory.js";
import { generateTitle, getResponse }  from "../utils/groqClients.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/thread", auth, async (req, res) => {
  try {
    const threads = await Thread.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("owner", "userName email");

    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to load threads" });
  }
});

router.get("/thread/:threadId", auth, async (req, res) => {
  try {
    const thread = await Thread.findOne({
      threadId: req.params.threadId,
      owner: req.user._id,
    });

    if (!thread) return res.status(404).json({ error: "Thread not found" });

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});
router.post("/chat", auth, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message)
    return res.status(400).json({ error: "Missing fields" });

  try {
    // Load or create per-user memory
    let memory = await UserMemory.findOne({ user: req.user._id });
    if (!memory) {
      memory = new UserMemory({ user: req.user._id, memory: [] });
      await memory.save();
    }

    // Load thread
    let thread = await Thread.findOne({ threadId, owner: req.user._id });
    const firstMessage = !thread;

    if (!thread) {
      thread = new Thread({
        threadId,
        title: "New Chat",
        owner: req.user._id,
        message: []
      });
    }

    // Add user message
    thread.message.push({ role: "user", content: message });

    // CLEAN messages before sending to Groq
    const cleanThreadMessages = thread.message.map(m => ({
      role: m.role,
      content: m.content
    }));

    // AI reply
    const aiResponse = await getResponse(cleanThreadMessages, memory.memory);

    thread.message.push({
      role: "assistant",
      content: aiResponse
    });

    // Auto-title first message
    if (firstMessage) {
      const newTitle = await generateTitle(message);
      thread.title = newTitle;
    }

    // Memory extraction example
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split(" ").slice(-1)[0];
      memory.memory.push({
        role: "system",
        content: `The user's name is ${name}.`
      });
      await memory.save();
    }

    thread.updatedAt = Date.now();
    const saved = await thread.save();

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to chat" });
  }
});

router.delete("/thread/:threadId", auth, async (req, res) => {
  try {
    const result = await Thread.deleteOne({
      threadId: req.params.threadId,
      owner: req.user._id,
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Thread not found" });

    res.json({ message: "Thread deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
