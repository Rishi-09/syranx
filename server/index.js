import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';
import logger from './utils/logger.js';

const app = express();
const port = 4000 ;
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        logger.info("connected with database!");
    }catch(err){
        logger.error(`Database connection failed: ${err.message}`);
    }
}

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
connectDB();

app.use("/api/health",(req,res)=>{
  res.json(200,"OK");
})


app.use("/api",authRoutes);
app.use("/api",chatRoutes);


app.listen(port, () => {
  logger.info(`listening on port localhost:${port} with cors`);

});

