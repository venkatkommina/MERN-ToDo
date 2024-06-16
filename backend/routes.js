import express from "express";

const router = express.Router();

router.get("/todos", (req, res) => {
  res.status(200).json({ msg: "Get request to /api/todos" });
});

router.post("/todos", (req, res) => {
  res.status(201).json({ msg: "Post request to /api/todos" });
});

router.delete("/todos/:id", (req, res) => {
  res.status(200).json({ msg: `Delete request to /api/todos/:id` });
});

router.put("/todos/:id", (req, res) => {
  res.status(200).json({ msg: `Put request to /api/todos/:id` });
});

export default router;
