import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Login from "./components/login";
import Signup from "./components/signup";
import { fetchTotals } from "./Api";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("login"); // Start at login page
  const [totals, setTotals] = useState({
    current_month_total: 0,
    last_month_total: 0,
  });
  
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userId = localStorage.getItem("user_id");
  const isLoggedIn = !!userId;

  // Load totals for logged-in user
  async function loadTotals() {
    if (!isLoggedIn) return;
    try {
      const data = await fetchTotals(userId);
      setTotals(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load totals:", err);
      setError("Failed to load totals");
    }
  }

  // Refresh totals when returning to Home or data updates
  useEffect(() => {
    if (activePage === "home" && isLoggedIn) {
      loadTotals();
    }
  }, [refreshTrigger, activePage, isLoggedIn]);

  // Trigger reload when add/update/delete happens
  const handleExpenseChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setActivePage("login");
  };

  return (
    <div className="app-layout">
      {/* Show Navbar only after login */}
      {isLoggedIn && <Navbar setActivePage={setActivePage} onLogout={handleLogout} />}

      {/* Main Content */}
      <div className="main-content">

        {/* Show pages depending on login */}
        {!isLoggedIn ? (
          <>
           {activePage === "login" && <Login setActivePage={setActivePage} />}
          {activePage === "signup" && <Signup setActivePage={setActivePage} />}

          </>
        ) : (
          <>
            {activePage === "home" && (
              <Home
                currentMonthTotal={totals.current_month_total}
                lastMonthTotal={totals.last_month_total}
              />
            )}

            {activePage === "add" && (
              <AddExpenseForm OnExpense={handleExpenseChange} />
            )}

            {activePage === "all" && (
              <ExpenseList
                refreshTrigger={refreshTrigger}
                onDataChange={handleExpenseChange}
              />
            )}
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
