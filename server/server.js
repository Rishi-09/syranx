import express from "express";
import cors from "cors";
import getResponse from "./utils/groqClients.js";
import mongoose from "mongoose";
import 'dotenv/config';
import chatRoutes from './routes/chat.js';

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

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Vite or React dev server
    credentials: true,
  })
);
app.use(express.json());
connectDB();

app.use("/api",chatRoutes);

let aireply = await getResponse("hii");
console.log(aireply);
app.listen(port, () => {
  console.log(`listening on port localhost:${port} with cors`);
  
});

