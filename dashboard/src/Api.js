const BASE_URL = "https://expense-tracker-5t4e.onrender.com"; 

//  Get Expenses of Logged-In User
export async function fetchExpenses() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) throw new Error("User not logged in");

  const response = await fetch(`${BASE_URL}/expenses/${user_id}`);
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return await response.json();
}

//  Add Expense
export async function addExpenses(expense) {
  const user_id = parseInt(localStorage.getItem("user_id"));
  if (!user_id) throw new Error("User not logged in");

  const bodyData = { ...expense, user_id };
  console.log("Sending Expense:", bodyData);

  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return await response.json();
}

// Update Expense
export async function updateExpense(id, updatedExpense) {
  const user_id = localStorage.getItem("user_id");
  const response = await fetch(`${BASE_URL}/update/${user_id}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedExpense),
  });

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return await response.json();
}

//  Delete Expense
export async function deleteExpense(id) {
  const user_id = localStorage.getItem("user_id");
  const response = await fetch(`${BASE_URL}/delete/${user_id}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return await response.json();
}

// Get Monthly Totals
export async function fetchTotals() {
  const user_id = localStorage.getItem("user_id");
  const response = await fetch(`${BASE_URL}/totals/${user_id}`);
  if (!response.ok) throw new Error("Failed to fetch totals");
  return await response.json();
}

// Login
export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Login failed");

  localStorage.setItem("user_id", data.user_id);
  localStorage.setItem("user_name", data.name);
  return data;
}

//  Signup
export async function signupUser(name, email, password,security_question,security_answer) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password,security_question, security_answer }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Signup failed");
  return data;
}

export async function verifySecurityAnswer(email, security_answer) {
  const response = await fetch(`${BASE_URL}/verify-security`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, security_answer }),
  });

  if (!response.ok) {
    throw new Error("Security answer mismatch");
  }

  return response.json();
}
export async function resetPassword(email, new_password) {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, new_password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Password reset failed");
  }

  return data;
}

//  Get Security Question for Forgot Password
export async function getSecurityQuestion(email) {
  const response = await fetch(`${BASE_URL}/forgot/get-question`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch security question");
  }
  console.log("Sending email for forgot:", email);
  return data; // { security_question: "What is your pet's name?" }
}
