import sqlite3 from 'sqlite3';

class Database {
  constructor(filePath) {
    this.filePath = filePath;
    this.db = null;
  }

  initialize() {
    // Initialize SQLite database
    const SQLite3 = sqlite3.verbose();
    this.db = new SQLite3.Database(this.filePath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
      } else {
        console.log('Users table ready');
        this.seedDefaultUsers();
      }
    });
  }

  seedDefaultUsers() {
    const checkUsers = `SELECT COUNT(*) as count FROM users`;
    this.db.get(checkUsers, (err, row) => {
      if (err) {
        console.error('Error checking users:', err);
        return;
      }

      if (row.count === 0) {
        const defaultUsers = [
          { name: 'Alice Johnson', available: true },
          { name: 'Bob Smith', available: true },
          { name: 'Carol Williams', available: false },
          { name: 'David Brown', available: true },
          { name: 'Eve Davis', available: false },
          { name: 'Frank Miller', available: true }
        ];

        const insertUser = `INSERT INTO users (name, available) VALUES (?, ?)`;
        defaultUsers.forEach((user) => {
          this.db.run(insertUser, [user.name, user.available ? 1 : 0], (err) => {
            if (err) {
              console.error('Error inserting user:', err);
            }
          });
        });

        console.log('Default users seeded');
      }
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, available, created_at, updated_at FROM users ORDER BY name`;
      this.db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Convert SQLite boolean (0/1) to JavaScript boolean
          const users = rows.map(row => ({
            ...row,
            available: Boolean(row.available)
          }));
          resolve(users);
        }
      });
    });
  }

  getUserById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, available, created_at, updated_at FROM users WHERE id = ?`;
      this.db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            row.available = Boolean(row.available);
          }
          resolve(row);
        }
      });
    });
  }

  updateUserAvailability(id, available) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(query, [available ? 1 : 0, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  createUser(name) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (name, available) VALUES (?, ?)`;
      this.db.run(query, [name, 1], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default Database;
