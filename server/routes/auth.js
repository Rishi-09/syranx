import express from "express";
const router = express.Router();
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.get("/signup", (req, res) => {
  try {
    res.send(true);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed loading signUp form" });
  }
});

router.post("/signup", (req, res) => {
  try {
    let { userName, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let createdUser = await User.create({
          userName,
          email,
          password: hash,
        });
        res.send(createdUser);
      });
    });
  } catch (err) {
    res.status(500).json({ error: "failed signup" });
  }
});

router.get("/login", (req, res) => {
  try {
    res.status(200).send("login form:" + true);
  } catch (err) {
    res.status(500).json({ error: "failed fetching form" });
  }
});

router.post("/login",async (req, res) => {
  try {
    let user = await User.findOne({email:req.body.email});
    if(!user) res.send("something went wrong!");

    bcrypt.compare( req.body.password,user.password,(err,result)=>{
        if(!result) res.send(" login failed! ");
        console.log("login successfull");
        res.status(200).json("login successfull");
    })
  } catch (err) {
    res.status(500).json({ error: "failed fetching form" });
  }
});

router.post("/logout",(req,res)=>{
     res.cookie("token","");
})
export default router;
