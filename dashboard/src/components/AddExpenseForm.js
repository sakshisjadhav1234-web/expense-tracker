import React, { useState } from "react";
import { addExpenses } from "../Api";
import "./AddExpenseForm.css";

export default function AddExpenseForm({ OnExpense }) {
  const [expense_category, setExpense_category] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newExpense = {
        expense_category,
        amount: parseFloat(amount),
        date,
        note,
      };

      const result = await addExpenses(newExpense);
      console.log("Expense added successfully!", result);

      // show success popup
      setMessage("Expense added successfully!");
      setTimeout(() => setMessage(""), 2500);

      // reset form
      setExpense_category("");
      setAmount("");
      setDate("");
      setNote("");

      if (OnExpense) OnExpense();
    } catch (err) {
      console.error("Failed to add expense!", err);
      setError("Failed to add expense!");
    }
  };

  return (
    <div className="add-expense">
      <h2>Add Your New Expense</h2>

      {/* ✅ Popup for success message */}
      {message && (
        <div className="add-popup">
          <div className="add-popup-content">
            <p>{message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form-grid">
        <div className="form-left">
          <input
            type="text"
            placeholder="Category"
            value={expense_category}
            onChange={(e) => setExpense_category(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-right">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Expense</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
