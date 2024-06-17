import express from "express";

import { todo } from "./database.js";

const router = express.Router();

router.use(express.json());

router.get("/todos", async (req, res) => {
  const todos = await todo.find({});
  res.status(200).json(todos);
});

router.post("/todos", async (req, res) => {
  const createTodo = req.body.todo;

  const newTodo = await todo.create({ todo: createTodo });

  res.status(201).json({ newTodo, _id: newTodo._id });
});

router.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const deletedTodo = await todo.deleteOne({ _id: id });
  res.status(200).json(deletedTodo);
});

router.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed; //I can do using findById(), but okay let's see how he has done this!!
  const updatedTodo = await todo.updateOne(
    { _id: id },
    {
      $set: { completed: !completed },
    }
  );
  res.status(200).json(updatedTodo);
});

export default router;
