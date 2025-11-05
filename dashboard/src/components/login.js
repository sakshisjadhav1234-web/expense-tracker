import React, { useState } from "react";
import { loginUser } from "../Api";
import "./Auth.css";


export default function Login({ setActivePage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser(email, password);
      localStorage.setItem("user_id", response.user_id);
      setActivePage("home");
    } catch (err) {
      setError("Invalid email or password");
    }
  };
return (
 <div className="login-page">
  
  {/* LEFT SIDE */}
  <div className="login-left">
    <h1 className="app-title">💰 Expense Tracker</h1>

    <h2 className="welcome-title">Welcome Back 👋</h2>
    <p className="welcome-sub">Track your spending smartly!</p>
  </div>

  {/* RIGHT SIDE (Login Box) */}
  <div className="login-box">
    <h2>Login</h2>

    {error && <p className="error">{error}</p>}

    <input 
      placeholder="Email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
    />

    <input 
      type="password" 
      placeholder="Password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
    />

    <button onClick={handleLogin}>Login</button>

    <p>
      Not registered? 
      <span className="link" onClick={() => setActivePage("signup")}>
        Create Account
      </span>
    </p>
  </div>

</div>

  
);



}