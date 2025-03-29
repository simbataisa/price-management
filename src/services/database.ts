import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure we only initialize the database once
let db: any;

// Initialize the database if it hasn't been initialized yet
if (!global.db) {
  // Ensure the data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'pricing.db');
  db = new Database(dbPath);
  
  // Initialize database tables
  const initDb = () => {
    // Create products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        basePrice REAL NOT NULL,
        category TEXT NOT NULL
      )
    `);

    // Create combos table
    db.exec(`
      CREATE TABLE IF NOT EXISTS combos (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        discountType TEXT NOT NULL,
        discountValue REAL NOT NULL,
        startDate TEXT,
        endDate TEXT,
        active INTEGER NOT NULL,
        minDuration INTEGER
      )
    `);

    // Create combo_items table for the many-to-many relationship
    db.exec(`
      CREATE TABLE IF NOT EXISTS combo_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comboId TEXT NOT NULL,
        productId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (comboId) REFERENCES combos (id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
      )
    `);
  };

  // Initialize the database
  initDb();
  
  // Store the database instance globally
  global.db = db;
} else {
  // Use the existing database instance
  db = global.db;
}

export default db;