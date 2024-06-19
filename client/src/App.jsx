/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    async function getTodos() {
      const response = await fetch("http://localhost:3000/api/todos/");
      const data = await response.json();
      setTodos(data);
    }
    getTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!todo.trim()) {
      alert("Todo cannot be empty");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodos((prevTodos) => [...prevTodos, data]); // Add new todo to the top
        setTodo(""); // Clear the input field
      } else {
        console.error("Error adding todo:", data);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const ToggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      const updatedTodo = await response.json();

      if (response.ok) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, completed: !completed } : todo
          )
        );
      } else {
        console.error("Error updating todo:", updatedTodo);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      } else {
        console.error("Error deleting todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Get It Done!</h1>

      <div className="form">
        <input
          type="text"
          className="inputForm"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          required
          placeholder="Your todo here..."
        />
        <button className="addTodo" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>

      <div className="todos">
        {(todos.length > 0 &&
          todos
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
                    className="todoStatus"
                    onClick={() => ToggleTodo(todo._id, todo.completed)}
                  >
                    {todo.completed ? "☑" : "☐"}
                  </button>
                  <button
                    className="deleteTodo"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))) ||
          "No todos yet"}
      </div>
    </div>
  );
}

export default App;
