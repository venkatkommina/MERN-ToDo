import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      window.location.href = "/signin";
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => navigate("/signin")} className="secondary-button">
        Go to Sign In
      </button>
    </div>
  );
};

export default SignUp;
