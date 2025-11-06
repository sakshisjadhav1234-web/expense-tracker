from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://expense-tracker-dashboard.onrender.com"}})


# Use Render PostgreSQL automatically
db_url = os.getenv("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ----------------------- MODELS ----------------------- #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    expense_category = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    note = db.Column(db.String(200))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

# ------------------------------------------------------ #

@app.route('/')
def homepage():
    return "Expense Tracker API is running with PostgreSQL!"

# ---------------- EXPENSE LIST ---------------- #

@app.route('/expenses/<int:user_id>', methods=['GET'])
def get_expenses(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).order_by(Expense.date.desc()).all()
    return jsonify([
        {
            "id": exp.id,
            "expense_category": exp.expense_category,
            "amount": exp.amount,
            "date": exp.date,
            "note": exp.note
        }
        for exp in expenses
    ])

# ---------------- ADD EXPENSE ---------------- #

@app.route('/add', methods=['POST'])
def add_expense():
    data = request.get_json()

    new_expense = Expense(
        expense_category=data["expense_category"],
        amount=float(data["amount"]),
        date=data.get("date", datetime.now().strftime('%Y-%m-%d')),
        note=data.get("note", ""),
        user_id=data["user_id"]
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"message": "Expense added successfully!"}), 201

# ---------------- UPDATE EXPENSE ---------------- #

@app.route('/update/<int:user_id>/<int:id>', methods=['PUT'])
def update_expense(user_id, id):
    exp = Expense.query.filter_by(id=id, user_id=user_id).first()
    if not exp:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json()

    exp.expense_category = data.get("expense_category", exp.expense_category)
    exp.amount = data.get("amount", exp.amount)
    exp.date = data.get("date", exp.date)
    exp.note = data.get("note", exp.note)

    db.session.commit()
    return jsonify({"message": "Expense updated successfully!"})

# ---------------- DELETE EXPENSE ---------------- #

@app.route('/delete/<int:user_id>/<int:id>', methods=['DELETE'])
def delete_expense(user_id, id):
    exp = Expense.query.filter_by(id=id, user_id=user_id).first()
    if not exp:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(exp)
    db.session.commit()

    return jsonify({"message": f"Expense ID {id} deleted successfully!"})

# ---------------- TOTALS ---------------- #

@app.route('/totals/<int:user_id>', methods=['GET'])
def get_totals(user_id):
    # current month
    current_month = datetime.now().strftime("%Y-%m")
    last_month = (datetime.now().replace(day=1) - timedelta(days=1)).strftime("%Y-%m")

    current_total = db.session.query(db.func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        Expense.date.like(f"{current_month}%")
    ).scalar() or 0

    last_total = db.session.query(db.func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        Expense.date.like(f"{last_month}%")
    ).scalar() or 0

    return jsonify({
        "current_month_total": current_total,
        "last_month_total": last_total
    })

# ---------------- AUTH ---------------- #

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup Successful"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid Credentials"}), 401

    return jsonify({
        "message": "Login Success",
        "user_id": user.id,
        "name": user.name
    })

if __name__ == '__main__':
    app.run(debug=True)
