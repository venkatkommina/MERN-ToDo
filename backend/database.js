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

export { connectToMongoDB };
