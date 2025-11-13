import React, { useEffect, useState } from "react";
import { fetchExpenses, updateExpense, deleteExpense } from "../Api";
import "./ExpenseList.css";

export default function ExpenseList({ refreshTrigger }) {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [editID, setEditID] = useState(null);
  const [editForm, setEditForm] = useState({
    expense_category: "",
    amount: "",
    date: "",
    note: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch data
  async function loadData() {
    setError(null);
    try {
      const data = await fetchExpenses();
      setExpenses(data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Failed to load expenses");
    }
  }

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  // Calculate total
  useEffect(() => {
    const dataToCalculate = isFiltered ? filteredExpenses : expenses;
    const total = dataToCalculate.reduce(
      (sum, exp) => sum + parseFloat(exp.amount || 0),
      0
    );
    setTotalAmount(total);
  }, [expenses, filteredExpenses, isFiltered]);

  // Edit mode handlers
  const handleEditClick = (exp) => {
    setEditID(exp.id);
    setEditForm({
      expense_category: exp.expense_category,
      amount: exp.amount,
      date: exp.date,
      note: exp.note,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const updatedExpense = await updateExpense(id, editForm);
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? updatedExpense : exp))
      );
      setEditID(null);
      setMessage("✅ Expense updated successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setError("Failed to update expense");
    }
  };

  const handleCancel = () => {
    setEditID(null);
  };

  // Delete handlers
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(deleteId);
      setExpenses((prev) => prev.filter((exp) => exp.id !== deleteId));
      setShowConfirm(false);
      setMessage("🗑️ Expense deleted successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setError("Failed to delete expense");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Filter
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }

    const filtered = expenses.filter((exp) => {
      const expenseDate = new Date(exp.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });

    setFilteredExpenses(filtered);
    setIsFiltered(true);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredExpenses([]);
    setIsFiltered(false);
  };

  return (
    <div className="expense-list">
      <h2 className="section-title">All Expenses</h2>

      {message && (
        <div className="popup success">
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div className="popup error">
          <p>{error}</p>
        </div>
      )}

      {/* Filter Section */}
      <div className="filter-container">
        <div className="filter-fields">
          <div className="filter-item">
            <label>From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button className="filter-btn" onClick={handleFilter}>
            Filter
          </button>

          {isFiltered && (
            <button className="clear-btn" onClick={clearFilter}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(isFiltered ? filteredExpenses : expenses).map((e, index) =>
              editID === e.id ? (
                <tr key={e.id} className="editing-row">
                  <td>{index + 1}</td>
                  <td>
                    <input
                      name="expense_category"
                      value={editForm.expense_category}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="date"
                      type="date"
                      value={editForm.date}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="note"
                      value={editForm.note}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <button
                      className="save-btn"
                      onClick={() => handleSave(e.id)}
                    >
                      Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={e.id}>
                  <td>{index + 1}</td>
                  <td>{e.expense_category}</td>
                  <td>₹{e.amount}</td>
                  <td>{e.date}</td>
                  <td>{e.note}</td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleEditClick(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="table-total">
        <h3>
          Total {isFiltered ? "Filtered" : "Overall"} Expenses:{" "}
          <span>₹{totalAmount.toFixed(2)}</span>
        </h3>
      </div>

      {showConfirm && (
        <div className="popup confirm">
          <div className="popup-content">
            <p>Are you sure you want to delete this expense?</p>
            <div className="popup-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
