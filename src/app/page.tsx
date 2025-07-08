"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Loader2, BarChart2, Plus, LogOut, Edit, Trash2, Calendar, Trash, XIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface Transaction {
  id: number
  title: string
  money: number
  createdAt: string
}

export default function Home() {

  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<Transaction[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  const [id, setId] = useState(1)
  const [title, setTitle] = useState("")
  const [money, setMoney] = useState(0)

  const incomeTransactions = transaction.filter(t => t.money > 0)
  const expenseTransactions = transaction.filter(t => t.money < 0)

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.money, 0)
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.money, 0)
  const balance = totalIncome + totalExpense

  const fetchData = async () => {
    fetch('/api/transaction')
      .then(res => res.json())
      .then(data => {
        setTransaction(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching data", error)
        setLoading(true)
      })
  }

  const deleteTransaction = async (id: number) => {
    try {

      if (!confirm("Do you want to delete this transaction ?")) {
        return
      }
      const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchData()
      }

    } catch (error) {
      console.error("Error deleting selected transaction :", error)
    }
  }

  const clearAll = async () => {
    try {

      if (!confirm("Do you want to clear all transactions ?")) {
        return
      }
      const res = await fetch(`/api/transaction/`, { method: "DELETE" })
      if (res.ok) {
        fetchData()
      }

    } catch (error) {
      console.error("Error clearing transaction :", error)
    }
  }

  const createTransaction = async () => {
    setIsEditting(false)

    if (!title) return alert("Title is required !")

    const newTransaction = { title, money }
    try {
      const res = await fetch('/api/transaction/', { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newTransaction) })
      if (res.ok) {
        console.log("Create successfuly")
        fetchData()
      }
    } catch (error) {
      console.error("Error creating transaction", error)
      alert("Error creating")
    }
  }

  const editTransaction = async (id: number) => {
    setIsCreating(false)

    if (!title) return alert("Title is required !")

    const updateT = { title, money }
    try {
      const res = await fetch(`/api/transaction/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updateT) })
      if (res.ok) {
        console.log("Update successfuly")
        alert("Updated")
        fetchData()
      }
    } catch (error) {
      console.error("Error creating transaction", error)
      alert("Error updating")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-14 w-14 animate-spin text-gray-500" />
      </div>
    )
  }

  // Prepare chart data
  const monthlyData = transaction.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.income += curr.money > 0 ? curr.money : 0;
      existing.expense += curr.money < 0 ? Math.abs(curr.money) : 0;
    } else {
      acc.push({
        month,
        income: curr.money > 0 ? curr.money : 0,
        expense: curr.money < 0 ? Math.abs(curr.money) : 0,
      });
    }
    return acc;
  }, [] as { month: string, income: number, expense: number }[])

  return (

    <motion.div className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>
      <motion.div className="max-w-6xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}>
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, User!</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <p className="text-gray-600">Total Income</p>
            <p className="text-2xl font-semibold text-green-600">฿{totalIncome}</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600">Total Expense</p>
            <p className="text-2xl font-semibold text-red-500">฿{totalExpense}</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600">Balance</p>
            <p className="text-2xl font-semibold text-blue-600">฿{balance}</p>
          </Card>
        </div>

        {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        <div className={`mb-10 grid gap-6 ${isCreating || isEditting ? "md:grid-cols-3" : "grid-cols-1"}`}>
          {/* Creating a transaction */}
          {isCreating && (
            <motion.div className="col-span-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800">Creating . . .</h3>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
                <Input
                  placeholder="Money"
                  type='number'
                  value={money}
                  step={1}
                  onChange={(e) => {
                    if (isNaN(money)) {
                      setMoney(0)
                    }
                    setMoney(parseFloat(e.target.value))
                  }} />
                <div className='flex justify-end mt-2 space-x-4'>
                  <Button variant='outline' className='rounded-md' onClick={() => setIsCreating(false)}>
                    Close
                  </Button>
                  <Button variant='default' className='rounded-md' onClick={createTransaction}>
                    Add
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Editing a transaction */}
          {isEditting && (
            <motion.div className="col-span-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800">Editing "{title}"</h3>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
                <Input
                  placeholder="Money"
                  type='number'
                  step={1}
                  value={money}
                  onChange={(e) => {
                    if (isNaN(money)) {
                      setMoney(0)
                    }
                    setMoney(parseFloat(e.target.value))
                  }} />
                <div className='flex justify-end mt-2 space-x-4'>
                  <Button variant='outline' className='rounded-md' onClick={() => setIsEditting(false)}>
                    Close
                  </Button>
                  <Button variant='default' className='rounded-md' onClick={() => editTransaction(id)}>
                    Update
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}


          {/* Recent Transactions */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>

              <div className='flex items-center justify-between gap-2'>
                <Button variant="default" className="flex items-center gap-2" onClick={() => {
                  setIsCreating(true)
                  setIsEditting(false)
                  setTitle("")
                  setMoney(0)
                  setId(0)
                }}>
                  <Plus className="w-4 h-4" /> Add Transaction
                </Button>
                <Button variant="destructive" className="flex items-center gap-2" onClick={() => {
                  clearAll()
                  setIsCreating(false)
                  setIsEditting(false)
                  setTitle("")
                  setMoney(0)
                  setId(0)
                }}>
                  <Trash className='w-4 h-4' /> Clear
                </Button>
              </div>
            </div>

            <Card className='p-5 max-h-99 h-99 overflow-y-auto'>
              <div className="space-y-3">
                {transaction.length === 0 ? (
                  <Card className='flex items-center justify-between text-gray-600 p-30 relative top-10'>
                    No Transaction
                  </Card>
                ) : (
                  transaction.map((transaction: Transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}>
                      <Card key={transaction.id} className="p-4 flex flex-col md:flex-row pb-4">
                        <div className="w-full md:w-12/13 flex items-center justify-center flex-col text-center gap-3">
                          <span className="font-bold text-lg text-gray-700">{transaction.title}</span>
                          <span className={transaction.money > 0 ? "text-lg text-green-500" : "text-lg text-red-500"}>
                            {transaction.money > 0
                              ? `฿ +${transaction.money}`
                              : `฿ ${transaction.money}`}
                          </span>
                          <span className="font-bold text-sm text-gray-700">Create at : {transaction.createdAt}</span>
                        </div>
                        <div className='w-full md:w-1/13 flex flex-col gap-2 items-end justify-end pr-2'>
                          <Button variant="outline" size="sm" className='w-fit' onClick={() => {
                            setTitle(transaction.title)
                            setMoney(transaction.money)
                            setIsEditting(true)
                            setIsCreating(false)
                            setId(transaction.id)
                          }}>
                            <Edit />
                          </Button>
                          <Button variant="destructive" size="sm" className='w-fit' onClick={() => deleteTransaction(transaction.id)}>
                            <Trash />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>



        {/* Chart Placeholder */}
        <Card className="p-4">

          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
          </div>

          <Card>
            <div className="h-64">

              {/* Graph details */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#16a34a" name="Income" />
                  <Bar dataKey="expense" fill="#dc2626" name="Expense" />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </Card>

        </Card>
      </motion.div>
    </motion.div>
  )
}
