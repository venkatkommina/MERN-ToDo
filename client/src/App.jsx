import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Todos from "./Todos";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/validateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/signin";
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/signin"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/todos"
          element={
            isAuthenticated ? (
              <Todos logout={logout} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/todos" />} />
      </Routes>
    </Router>
  );
}

export default App;
