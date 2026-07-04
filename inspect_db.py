import sqlite3

conn = sqlite3.connect(r'c:\projects\Training Module\backend\nagarkot.db')
tables = conn.execute("SELECT name, sql FROM sqlite_master WHERE type='table';").fetchall()
for name, sql in tables:
    print(f"Table: {name}")
    print(sql)
    print("-" * 50)
