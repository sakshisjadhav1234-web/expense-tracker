import React, { useState } from "react";
import { resetPassword } from "../Api";
import "./Auth.css";

export default function ResetPassword({ setActivePage }) {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const email = localStorage.getItem("fp_email");
    await resetPassword(email, newPassword);
    
    localStorage.removeItem("reset_user");

    setMessage("Password updated successfully!");
    setTimeout(() => setActivePage("login"), 2000);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleReset}>Update Password</button>

        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}
