/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function Todos({ logout }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTodos(data);
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ todo: newTodo }),
    });

    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo("");
  };

  const toggleTodo = async (id, completed) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });

    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !completed } : todo
      )
    );
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div className="container">
      <button onClick={logout} className="logoutButton">
        Logout
      </button>
      <h1>Todo List</h1>
      <div className="form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="inputForm"
        />
        <button type="submit" onClick={addTodo} className="addTodo">
          Add Todo
        </button>
      </div>
      <div className="todos">
        {todos
          .slice()
          .reverse()
          .map((todo) => (
            <div
              key={todo._id}
              className={`todo ${
                todo.completed ? "completed" : "not-completed"
              }`}
            >
              <h3>{todo.todo}</h3>
              <div className="statusButtons">
                <button
                  onClick={() => toggleTodo(todo._id, todo.completed)}
                  className="todoStatus"
                >
                  {todo.completed ? "✅" : "⬜"}
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="deleteTodo"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Todos;
