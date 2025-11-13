import React, { useState } from "react";
import { signupUser } from "../Api";
import "./Auth.css";

export default function Signup({ setActivePage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");


  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signupUser(name, email, password,securityQuestion,securityAnswer);

      // Show popup
      setMessage("Account created successfully!");

      // Close popup after some time & go to login
      setTimeout(() => {
        setMessage("");
        setActivePage("login");
      }, 1800);

    } catch (err) {
      setError("Email already exists");
    }
  };

  return (
    <div className="login-page">
      
      {/* Popup UI */}
      {message && (
        <div className="add-popup">
          <div className="add-popup-content">
            <p>{message}</p>
          </div>
        </div>
      )}

      <div className="login-left">
        <h1 className="app-title">💰 Expense Tracker</h1>
        <h1 className="signup-title">Create Your Account ✨</h1>
        <p className="welcome-sub">Start tracking your spending wisely!</p>
      </div>

      <div className="login-box">
        <h2>Signup</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password + Show/Hide toggle */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <select value={securityQuestion} onChange={(e) => setSecurityQuestion(e.target.value)} required>
          <option value="">Select a Security Question</option>
          <option value="What is your pet's name?">What is your pet's name?</option>
          <option value="What is your favorite colour?">What is your favorite colour?</option>
          <option value="What city were you born in?">What city were you born in?</option>
          <option value="What is your favorite food?">What is your favorite food?</option>
        </select>

        <input
          placeholder="Security Answer"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          required
        />

        


        <button onClick={handleSignup}>Create Account</button>

        <p>Already have an account? <span className="link"
          onClick={() => setActivePage("login")}>Login</span></p>
      </div>
    </div>
  );
}
