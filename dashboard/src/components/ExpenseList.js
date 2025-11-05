import React,{useEffect,useState} from "react";
import { fetchExpenses,updateExpense,deleteExpense } from "../Api";
import "./ExpenseList.css"

export default function ExpenseList({refreshTrigger}){
    const [expenses,setExpenses] = useState([]); // expense array
    const [message, setMessage] = useState("");
    const [error,setError] = useState(null);
    const [editID,setEditID] = useState(null);
    const [editForm,setEditForm] = useState({
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



async function loadData() {
    setError(null);
    try{
        const data= await fetchExpenses();

        setExpenses(data || []); //setting the emtry array if nothing in data
    }catch(err){
        console.error("Failed to load expense !!",err);
        setError("Failed to load expenses");
    }
}

//useeffect for empty dependency array run once after component mount 
useEffect (()=>{
    loadData();
},[refreshTrigger]);
useEffect(() => {
  const dataToCalculate = isFiltered ? filteredExpenses : expenses;
  const total = dataToCalculate.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  setTotalAmount(total);
}, [expenses, filteredExpenses, isFiltered]);


  if (error) {
    return (
      <div className="expense-list error">
        <p style={{ color: "red", fontWeight: "500" }}>{error}</p>
      </div>
    );
  }

  const handleEditClick = async(expenses)=>{
    setEditID(expenses.id);
    setEditForm({
      expense_category: expenses.expense_category,
      amount: expenses.amount,
      date: expenses.date,
      note: expenses.note,
    });
  };
  //update field on typing
  function handleChange(e) {
  const { name, value } = e.target;
  setEditForm((prev) => ({ ...prev, [name]: value }));
}

  
  //hnadel save after editing
  const handleSave = async (id) => {
  const updatedExpense = await updateExpense(id, editForm);
  // Update only that expense row instead of reloading everything
  setExpenses((prev) =>
    prev.map((exp) => (exp.id === id ? updatedExpense : exp))
  );
  setEditID(null); // exit edit mode
  
setMessage("Expense updated successfully!");
console.log("Popup message set!");
setTimeout(() => setMessage(""), 2000);
};


  //handel cancel
  const handleCancel = ()=>{
    setEditID(null);
  };


//delete expenses

  const handleDeleteClick = (id) => {
  setDeleteId(id);
  setShowConfirm(true);
    };

  //Confirm delete from popup
const confirmDelete = async () => {
  try {
    await deleteExpense(deleteId);
    setExpenses((prev) => prev.filter((exp) => exp.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);

    setMessage("Expense deleted successfully!");
    setTimeout(() => setMessage(""), 2500);
  } catch (error) {
    console.error("Error deleting expense:", error);
    setError("Failed to delete expense");
  }
};

const cancelDelete = () => {
  setShowConfirm(false);
  setDeleteId(null);
};


//filtering the expense by date
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
      <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
      </div>
      </div>
    )}
        <div className="filter-container">
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button className="filter-btn" onClick={handleFilter}>
          Filter
        </button>

        {isFiltered && (
          <button className="clear-btn" onClick={clearFilter}>
            Clear Filter
          </button>
        )}
      </div>
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
        <td>{index + 1}</td> {/*Serial number */}
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
            value={editForm.amount}
            type="number"
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
          <button className="save-btn" onClick={() => handleSave(e.id)}>
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
        <td>{e.amount}</td>
        <td>{e.date}</td>
        <td>{e.note}</td>
        <td>
          <button
            className="update-btn"
            onClick={() => handleEditClick(e)}
          >
            Update
          </button>
          <button className="delete-btn" onClick={() => handleDeleteClick(e.id)}>
            Delete
          </button>
        </td>
      </tr>
    )
  )}
</tbody>
    </table>
    <div className="table-total">
  <h3>
    Total {isFiltered ? "Filtered" : "Overall"} Expenses:{" "}
    <span>₹{totalAmount.toFixed(2)}</span>
  </h3>
</div>

    {showConfirm && (
      <div className="popup">
        <div className="popup-content confirm">
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
