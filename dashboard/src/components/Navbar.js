import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar({ setActivePage, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon for Mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="logo">💰 Expense Tracker</h2>
        <ul>
          <li onClick={() => { setActivePage("home"); setIsOpen(false); }}>🏠 Home</li>
          <li onClick={() => { setActivePage("add"); setIsOpen(false); }}>➕ Add Expense</li>
          <li onClick={() => { setActivePage("all"); setIsOpen(false); }}>📊 All Expenses</li>

          <hr style={{ borderColor: "#ffffff30", margin: "15px 0" }} />

          {/* Logout */}
          <li className="logout-btn" onClick={() => { onLogout(); setIsOpen(false); }}>
            🚪 Logout
          </li>
        </ul>
      </div>
    </>
  );
}
