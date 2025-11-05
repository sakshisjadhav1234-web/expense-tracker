import React, { useState } from "react";
import { signupUser } from "../Api";
import "./Auth.css";

export default function Signup({ setActivePage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signupUser(name, email, password);
      alert("Signup Successful! Please Login.");
      setActivePage("login");
    } catch (err) {
      setError("Email already exists");
    }
  };

 return (
 <div className="login-page">

  {/* LEFT SECTION */}
  <div className="login-left">
    <h1 className="app-title">💰 Expense Tracker</h1>

    <h1 className="signup-title">Create Your Account ✨</h1>

    <p className="welcome-sub">Start tracking your spending wisely!</p>
  </div>

  {/* RIGHT SIGNUP BOX */}
  <div className="login-box">
    <h2>Signup</h2>

    {error && <p className="error">{error}</p>}

    <input placeholder="Full Name" value={name}
      onChange={(e) => setName(e.target.value)} />

    <input placeholder="Email" value={email}
      onChange={(e) => setEmail(e.target.value)} />

    <input type="password" placeholder="Password" value={password}
      onChange={(e) => setPassword(e.target.value)} />

    <button onClick={handleSignup}>Create Account</button>

    <p>Already have an account? <span className="link" onClick={() => setActivePage("login")}>Login</span></p>
  </div>

</div>
 );

}
