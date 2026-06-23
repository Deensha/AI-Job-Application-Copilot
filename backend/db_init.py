import sqlite3

def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # USERS TABLE (if not already created)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT
    )
    """)

    # APPLICATIONS TABLE (JOB TRACKER)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        company TEXT,
        role TEXT,
        status TEXT,
        applied_date TEXT
    )
    """)

    # ACTIVITIES TABLE
    cursor.execute("""
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    activity TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")


    cursor.execute("""
CREATE TABLE IF NOT EXISTS ats_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    score REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

    conn.commit()
    conn.close()

  

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully")