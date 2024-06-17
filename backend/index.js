import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./database.js";
import router from "./routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use("/api", router);

app.use(express.json());

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}

startServer();
