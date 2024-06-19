import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./database.js";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use("/api", router);

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}

startServer();
