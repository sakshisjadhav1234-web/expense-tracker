import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar({ setActivePage, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 🌟 Hamburger Icon */}
      <div
        className={`hamburger ${isOpen ? "active" : ""}`}
        onClick={toggleSidebar}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🌙 Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="logo">💰 Expense Tracker</h2>

        <ul>
          <li
            onClick={() => {
              setActivePage("home");
              toggleSidebar();
            }}
          >
            🏠 Home
          </li>
          <li
            onClick={() => {
              setActivePage("add");
              toggleSidebar();
            }}
          >
            ➕ Add Expense
          </li>
          <li
            onClick={() => {
              setActivePage("all");
              toggleSidebar();
            }}
          >
            📊 All Expenses
          </li>

          <hr className="divider" />

          <li
            className="logout-btn"
            onClick={() => {
              onLogout();
              toggleSidebar();
            }}
          >
            🚪 Logout
          </li>
        </ul>
      </div>
    </>
  );
}
