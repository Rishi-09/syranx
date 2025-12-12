import mongoose from "mongoose";

const UserMemorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  memory: [
    {
      role: String,
      content: String,
    }
  ]
});

export default mongoose.model("UserMemory", UserMemorySchema);
