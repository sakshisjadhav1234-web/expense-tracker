import sqlite3
from flask import Flask, jsonify,request
import os,sqlalchemy
from datetime import datetime
from expense_db import DB_PATH,init_db
from werkzeug.security import generate_password_hash, check_password_hash


init_db()
#create instance of flask web application
app=Flask(__name__)

@app.route('/')
def homepage():
    return "Expense Tracker API is running!"

@app.route('/expenses/<int:user_id>',methods=['GET'])
def get_expenses(user_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, expense_category, amount, date, note FROM expense WHERE user_id = ? ORDER BY date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    # Convert rows to dicts for JSON output
    expenses = [{"id": r[0], "expense_category": r[1], "amount": r[2], "date": r[3], "note": r[4]} for r in rows]
    return jsonify(expenses)

@app.route('/add', methods=['POST'])
def add_expense():
    data = request.get_json()
    category = data.get('expense_category')
    amount = data.get('amount')
    date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
    note = data.get('note', '')
    user_id = data.get('user_id') 

    # Validate required fields
    if not category or amount is None or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Insert into database
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO expense (expense_category, amount, date, note,user_id) VALUES (?, ?, ?, ?, ?)",
        (category, amount, date, note,user_id)
    )
    db.commit()
    db.close()
    print("Received Data:", data) 
    return jsonify({"message": "Expense added successfully!"}), 201

@app.route('/update/<int:user_id>/<int:id>',methods=['PUT'])
def update_expense(user_id,id):
    data = request.get_json()
    db= sqlite3.connect(DB_PATH)
    cursor=db.cursor()
    cursor.execute("SELECT * FROM expense WHERE id = ? AND user_id=?", (id, user_id))
    existing = cursor.fetchone()

    if not existing:
        return jsonify({"error":"Expense not found"}),400
    
    # Use new values if provided, otherwise keep old ones
    category = data.get('expense_category', existing[1])
    amount = data.get('amount', existing[2])
    date = data.get('date', existing[3])
    note = data.get('note', existing[4])

    cursor.execute("UPDATE expense SET expense_category=?, amount=?, date=?, note=? WHERE id=? AND user_id=?",
                   (category, amount, date, note, id, user_id))
    
    db.commit()
    db.close()
    return jsonify({
    "id": id,
    "expense_category": category,
    "amount": amount,
    "date": date,
    "note": note
}), 200



@app.route('/delete/<int:user_id>/<int:id>',methods=['DELETE'])
def delete_expenses(user_id,id):

    db= sqlite3.connect(DB_PATH)
    cursor=db.cursor()
    cursor.execute("SELECT * FROM expense WHERE id=? AND user_id=?", (id, user_id))
    existing = cursor.fetchone()

    if not existing:
        db.close()
        return jsonify({"error": "Expense not found"}), 404

    cursor.execute("DELETE FROM expense WHERE id=? AND user_id=?", (id, user_id))
    db.commit()
    db.close()
    return jsonify({"message": f"Expense ID {id} deleted successfully!"}), 200
    
@app.route('/totals/<int:user_id>', methods=['GET'])
def get_totals(user_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Current month
    cursor.execute("""
        SELECT SUM(amount)
        FROM expense
        WHERE user_id = ? AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
    """, (user_id,))
    current_total = cursor.fetchone()[0] or 0

    # Last month
    cursor.execute("""
        SELECT SUM(amount)
        FROM expense
        WHERE user_id = ? AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now', '-1 month')
    """, (user_id,))
    last_total = cursor.fetchone()[0] or 0

    conn.close()
    return jsonify({
        "current_month_total": current_total,
        "last_month_total": last_total
    })



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data['email'],))
    if cursor.fetchone():
        return jsonify({"error": "Email already exists"}), 400

    hashed = generate_password_hash(data['password'])

    cursor.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                   (data['name'], data['email'], hashed))
    db.commit()
    db.close()

    return jsonify({"message": "Signup Successful"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data['email'],))
    user = cursor.fetchone()

    if not user or not check_password_hash(user[3], data['password']):
        return jsonify({"error": "Invalid Credentials"}), 401

    return jsonify({
    "message": "Login Success",
    "user_id": user[0],
    "name": user[1]   
}), 200


if __name__ == '__main__':
    app.run(debug=True)