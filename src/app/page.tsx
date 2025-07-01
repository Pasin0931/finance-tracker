"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Loader2, BarChart2, Plus, LogOut, Edit, Trash2, Calendar, Trash } from 'lucide-react'

interface transactionProps {
  params: {
    title: string
    money: number
    createdAt: string
  }
}

interface Transaction {
  title: string
  money: number
  createdAt: string
}

export default function Home({ params }: transactionProps) {

  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<Transaction[]>([])
  const [totalBalance, setTotalBalance] = useState(0)

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

        {/* Recent Transactions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          </div>

          <Card className='p-5 max-h-99 overflow-y-auto'>
            {/* transaction data */}
            <div className="space-y-3">
              {transaction.map((transaction: any) => (
                <Card key={transaction.id} className="p-4 flex flex-col md:flex-row pb-4">
                  <div className="w-full md:w-12/13 flex items-center justify-center flex-col text-center gap-3">
                    <span className="font-bold text-lg text-gray-700">
                      {transaction.title}
                    </span>
                    <span className={transaction.money > 0 ? "text-lg text-green-500" : "text-lg text-red-500"}>
                      {transaction.money > 0
                        ? `฿ +${transaction.money}`
                        : `฿ ${transaction.money}`
                      }
                    </span>
                  </div>
                  <div className='w-full md:w-1/13 flex flex-col gap-2 items-end justify-end pr-2'>
                    <Button variant="outline" size="sm" className='w-fit'>
                      <Edit />
                    </Button>
                    <Button variant="destructive" size="sm" className='w-fit'>
                      <Trash />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            [Chart goes here]
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
