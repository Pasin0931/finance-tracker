import { NextResponse } from "next/server";
import { transactionDb } from "@/lib/db"

export async function GET(request, { params }) {
    try {

        const { id } = await params
        const data = await transactionDb.getTransactionById(id)

        if (!data) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        return NextResponse.json(data)

    } catch (error) {

        console.error(error)
        return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })

    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const { title, money } = await request.json()

        if (!title?.trim() || !Number.isFinite(money)) {
            return NextResponse.json({ error: "Valid title and money are required" }, { status: 400 })
        }

        const result = await transactionDb.updateTransaction(Number.parseInt(id), title.trim(), money || 0)

        if (result.changes > 0) {
            const updated = transactionDb.getTransactionById(Number.parseInt(id))
            return NextResponse.json(updated)
        } else {
            return NextResponse.json({ error: "Not Found" }, { status: 404 })
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {

        const { id } = await params
        const result = await transactionDb.deleteTransaction(Number.parseInt(id))

        if (result.changes > 0) {
            return NextResponse.json({ message: "Transaction Deleted" })
        } else {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }
}

