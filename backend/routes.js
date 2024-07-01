import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Todo, User } from "./database.js";
import cors from "cors";

const router = express.Router();

router.use(express.json());
router.use(cors());

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

router.post("/api/validateToken", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ valid: true });
  });
});

router.get("/todos", authenticateToken, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json(todos);
});

router.post("/todos", authenticateToken, async (req, res) => {
  const createTodo = req.body.todo;

  if (createTodo === undefined) {
    return res.status(400).json({ message: "Todo cannot be empty" });
  }

  const newTodo = await Todo.create({ todo: createTodo, user: req.user.id });

  res.status(201).json(newTodo);
});

router.delete("/todos/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const deletedTodo = await Todo.deleteOne({ _id: id, user: req.user.id });
  res.status(200).json(deletedTodo);
});

router.put("/todos/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed;
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Invalid status" });
  }
  const updatedTodo = await Todo.updateOne(
    { _id: id, user: req.user.id },
    {
      $set: { completed: !completed },
    }
  );
  res.status(200).json(updatedTodo);
});

router.post("/signup", async (req, res) => {
  try {
    const validationResult = userSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json(validationResult.error.errors);
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
