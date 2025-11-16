import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";

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

router.get("thread/:id",(req,res)=>{
    const {id} = req.params;
    try{
        const chat = Thread.find({_id:`${id}`})
    }catch(err){
        res.status(500).json({error:"failed"})
    }
})

export default router;
