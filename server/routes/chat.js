import express from "express";
const router = express.Router();
import  Thread  from "../models/Thread.js";
import getResponse from "../utils/groqClients.js";

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc1234",
      title: "testing database again",
    });
    const result = await thread.save();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed push!" });
  }
});

router.get("/thread", async (req, res, next) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "failed to load chats" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const chat = await Thread.findOne({ threadId });
    if (!chat) {
      res.status(404).json({ error: "chat not found" });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const result = await Thread.deleteOne({ threadId });
    if (!result) {
      res.json("failed");
    }
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.json("Thread Deleted Successfully :",result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
router.post("/chat", async (req, res) => {
  let { threadId, message } = req.body;
  if (!threadId || !message) {
    res.status(400).json({ error: "Missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        title: message,
        threadId,
        message: [{ role: "user", content: message }],
      });
    }else{
      thread.message.push({ role: "user", content: message});
    }
    let aiResponse = await getResponse(message);
    thread.message.push({ role: "assistant", content: aiResponse})
    let result = await thread.save();
    console.log(result);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load response!" });
  }
});
export default router;
