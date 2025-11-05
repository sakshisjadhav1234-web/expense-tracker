import React from "react";
import "./Home.css";

export default function Home({ currentMonthTotal, lastMonthTotal }) {
  const userName = localStorage.getItem("user_name");

  return (
    <div className="home-container">
      <h1>Welcome {userName} to Expense Tracker</h1>
      <div className="summary-cards">
        <div className="card current">
          <h3>Current Month</h3>
          <p>₹ {currentMonthTotal}</p>
        </div>
        <div className="card last">
          <h3>Last Month</h3>
          <p>₹ {lastMonthTotal}</p>
        </div>
      </div>
      <img
        src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
        alt="Finance Illustration"
        className="dashboard-image"
      />
    </div>
  );
}
