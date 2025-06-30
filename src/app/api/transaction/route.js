import { NextResponse } from "next/server"
import { clearDb, transactionDb } from "@/lib/db"

export async function GET() {
    try {
        const data = transactionDb.getAllTransaction()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return NextResponse.json({ error: "Error fetching transactions" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { title, money } = await request.json()

        if (!title?.trim() || !Number.isFinite(money)) {
            return NextResponse.json({ error: "Valid title and money are required" }, { status: 400 })
        }


        const result = transactionDb.addTransaction(title.trim(), money)

        if (result.changes > 0) {
            const data = transactionDb.getTransactionById(result.lastInsertRowid)
            return NextResponse.json(data, { status: 201 })
        } else {
            return NextResponse.json({ error: "Failed to create transactions" }, { status: 500 })
        }

    } catch (error) {

        console.error("Error adding new transactions: ", error)
        return NextResponse.json({ error: "Failed adding new transactions" }, { status: 500 })

    }
}

export async function DELETE() {
    try {

        const data = clearDb()
        return NextResponse.json({ message: "All transactions deleted" })

    } catch (error) {
        console.error("Error deleting transactions: ", error)
        return NextResponse.json({ error: "Failed deleting transactions" }, { status: 500 })
    }
}