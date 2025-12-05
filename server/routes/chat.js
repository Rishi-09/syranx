import express from "express";
import Thread from "../models/Thread.js";
import getResponse from "../utils/groqClients.js";
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
      owner: req.user._id
    });

    if (!thread)
      return res.status(404).json({ error: "Thread not found" });

    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

router.post("/chat", auth, async (req, res) => {
  let { threadId, message } = req.body;

  if (!threadId || !message)
    return res.status(400).json({ error: "Missing fields" });

  try {
    let thread = await Thread.findOne({ threadId, owner: req.user._id });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        owner: req.user._id,
        message: [{ role: "user", content: message }],
      });
    } else {
      thread.message.push({ role: "user", content: message });
    }

    let aiResponse = await getResponse(message);
    thread.message.push({ role: "assistant", content: aiResponse });

    thread.updatedAt = Date.now();

    const result = await thread.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to chat" });
  }
});

router.delete("/thread/:threadId", auth, async (req, res) => {
  try {
    const result = await Thread.deleteOne({
      threadId: req.params.threadId,
      owner: req.user._id
    });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Thread not found" });

    res.json({ message: "Thread deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
