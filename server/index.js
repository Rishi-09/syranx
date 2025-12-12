import express from "express";
import cors from "cors";
import getResponse from "./utils/groqClients.js";
import mongoose from "mongoose";
import 'dotenv/config';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = 8080;
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected with database!")
    }catch(err){
        console.log("connectioon failed!",err);
    }
}

app.use(cors({
  origin: "https://syranx.vercel.app/",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
connectDB();



app.use("/api",authRoutes);
app.use("/api",chatRoutes);


app.listen(port, () => {
  console.log(`listening on port localhost:${port} with cors`);
  
});

