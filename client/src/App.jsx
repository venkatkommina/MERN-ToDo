/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getTodos() {
      const response = await fetch("http://localhost:3000/api/todos/");
      const data = await response.json();
      setMessage(data.msg);
    }
    getTodos();
  }, []);

  return (
    <div className="container">
      <h1>To-Dos</h1>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
