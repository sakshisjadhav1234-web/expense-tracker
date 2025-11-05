import sqlite3
from flask import Flask
import os,sqlalchemy
from datetime import datetime

# Define the full path to the SQLite database file (expenses.db)
DB_PATH= os.path.join(os.path.dirname(__file__),'expenses.db')

def init_db():
    # Connect to SQLite database (creates 'expenses.db' if it doesn’t exist)
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()
 
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expense(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            expense_category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            note TEXT,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    db.commit()
    db.close()