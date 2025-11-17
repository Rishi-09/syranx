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

router.get("/thread/:threadId",async (req,res)=>{
    const {threadId} = req.params;
    try{
        const chat = await Thread.findOne({threadId});
        if(!chat){
          res.status(404).json({error:"chat not found"});
        }
        res.json(chat);
    }catch(err){
        res.status(500).json({error:"failed"})
    }
})

router.delete("/thread/:threadId",async(req,res)=>{
  const {threadId} = req.params;  
  try{
    const result = await Thread.deleteOne({threadId});
    if(!result){
      res.json("failed");
    }
    console.log(result.message);
  }catch(err){
    console.log(err)
    res.status(500).json({error:err});
  }
})
export default router;
