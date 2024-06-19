import express from "express";

import { todo } from "./database.js";
import cors from "cors";

const router = express.Router();

router.use(express.json());
router.use(cors());

router.get("/todos", async (req, res) => {
  const todos = await todo.find({});
  res.status(200).json(todos);
});

router.post("/todos", async (req, res) => {
  const createTodo = req.body.todo;

  if (createTodo === undefined) {
    return res.status(400).json({ message: "Todo cannot be empty" });
  }

  const newTodo = new todo({ todo: createTodo });
  await newTodo.save();

  res.status(201).json(newTodo);
});

router.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const deletedTodo = await todo.deleteOne({ _id: id });
  res.status(200).json(deletedTodo);
});

router.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed; //would also've done this using findByid and then updating
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Invalid status" });
  }
  const updatedTodo = await todo.updateOne(
    { _id: id },
    {
      $set: { completed: !completed },
    }
  );
  res.status(200).json(updatedTodo);
});

export default router;
