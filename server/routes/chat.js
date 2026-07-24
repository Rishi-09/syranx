import express from "express";
import Thread from "../models/Thread.js";
import UserMemory from "../models/UserMemory.js";
import { generateTitle, getResponse, compactConversation }  from "../utils/groqClients.js";
import { auth } from "../middlewares/auth.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/thread", auth, async (req, res) => {
  try {
    const threads = await Thread.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("owner", "userName email");

    res.json(threads);
  } catch (err) {
    logger.error(`Failed to load threads: ${err.message}`);
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
    logger.error(`Failed to load thread: ${err.message}`);
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
    const isTokenLimit =
      err.status === 413 || err.error?.error?.code === "rate_limit_exceeded";

    if (isTokenLimit) {
      logger.warn(`Chat blocked by token limit: ${err.message}`);
      return res.status(413).json({
        error: "Token limit reached",
        code: "token_limit_exceeded",
      });
    }

    logger.error(`Failed to chat: ${err.message}`);
    res.status(500).json({ error: "Failed to chat" });
  }
});

router.post("/thread/:threadId/compact", auth, async (req, res) => {
  try {
    const thread = await Thread.findOne({
      threadId: req.params.threadId,
      owner: req.user._id,
    });

    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const cleanMessages = thread.message.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const result = await compactConversation(cleanMessages);

    if (!result) {
      return res.status(400).json({ error: "Not enough history to compact" });
    }

    thread.message = [
      { role: "system", content: `Summary of earlier conversation:\n\n${result.summary}` },
      ...result.recent,
    ];
    thread.updatedAt = Date.now();
    const saved = await thread.save();

    logger.info("Thread compacted");
    res.json(saved);
  } catch (err) {
    logger.error(`Failed to compact thread: ${err.message}`);
    res.status(500).json({ error: "Failed to compact chat" });
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
    logger.error(`Failed to delete thread: ${err.message}`);
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
