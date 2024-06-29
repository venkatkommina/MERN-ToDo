import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const url = process.env.MONGODB_URL || "mongodb://localhost:27017/mydatabase";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(url, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

const todoSchema = new mongoose.Schema({
  todo: String,
  completed: {
    type: Boolean,
    default: false,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
const User = mongoose.model("User", userSchema);

export { connectToMongoDB, Todo, User };
