import Database from 'better-sqlite3'
import path from 'path'
let db = null

export function getDb() {
    if (!db) {
        const dbPath = path.join(process.cwd(), "transaction.db")

        db = new Database(dbPath)
        db.pragma("journal_mode = WAL")
        db.exec(`
            CREATE TABLE IF NOT EXISTS "transaction" (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                money INTEGER,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `)
        console.log("Database created")
    }
    return db
}

export function clearDb() {
    const db = getDb()
    db.prepare('DELETE FROM "transaction"').run()
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'transaction'").run()
}

export const transactionDb = {
    addTransaction(title, money=0) {
        const db = getDb()
        const stmt = db.prepare('INSERT INTO "transaction" (title, money, createdAt, updatedAt) VALUES(?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)')
        return stmt.run(title, money)
    },

    updateTransaction(id, title, money) {
        const db = getDb()
        const stmt = db.prepare(`
            UPDATE "transaction"
            SET title = ?, money = ?, updatedAt = CURRENT_TIMESTAMP    
            WHERE id = ?
        `)
        return stmt.run(title, money, id)
    },

    getAllTransaction() {
        const db = getDb()
        return db.prepare('SELECT * FROM "transaction" ORDER BY id').all()
    },

    getTransactionById(id) {
        const db = getDb()
        return db.prepare('SELECT * FROM "transaction" WHERE id = ?').get(id)
    },

    deleteTransaction(id) {
        const db = getDb()
        const stmt = db.prepare('DELETE FROM "transaction" WHERE id=?')
        return stmt.run(id)
    }
}