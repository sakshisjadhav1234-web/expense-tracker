import React, { useEffect, useState } from "react";
import { getSecurityQuestion, verifySecurityAnswer } from "../Api";
import "./Auth.css";

export default function ForgotPassword({ setActivePage }) {
  const [email, setEmail] = useState(localStorage.getItem("fp_email") || "");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user's stored security question from backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (!email) {
          setError("Email not found. Go back and enter your email first.");
          return;
        }
        const data = await getSecurityQuestion(email);
        setSecurityQuestion(data.security_question);
      } catch (err) {
        setError("Could not load your security question.");
      }
    };
    fetchQuestion();
  }, [email]);

  // 🔹 Verify user’s security answer
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifySecurityAnswer(email, securityAnswer);
      if (res.message === "Verified") {
        localStorage.setItem("fp_verified", "true");
        setActivePage("reset"); // move to Reset Password page
      } else {
        setError("❌ Incorrect security answer");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Verify Identity</h2>

        {/* Disabled Email */}
        <input type="email" value={email} disabled className="disabled-input" />

        {/* Disabled Security Question */}
        <input
          type="text"
          value={securityQuestion}
          disabled
          className="disabled-input"
        />

        {/* Editable Security Answer */}
        <input
          type="text"
          placeholder="Enter Security Answer"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleVerify} disabled={loading || !securityAnswer}>
          {loading ? "Verifying..." : "Proceed"}
        </button>

        <p className="link" onClick={() => setActivePage("login")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}
