import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { BarChart2, Plus, LogOut } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
            <p className="text-2xl font-semibold text-green-600">$4,200</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600">Total Expense</p>
            <p className="text-2xl font-semibold text-red-500">$2,350</p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600">Balance</p>
            <p className="text-2xl font-semibold text-blue-600">$1,850</p>
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

          <div className="space-y-4">
            <Card className="p-4 flex justify-between items-center">
              <span className="text-gray-700">Grocery</span>
              <span className="text-red-500">- $120</span>
            </Card>
            <Card className="p-4 flex justify-between items-center">
              <span className="text-gray-700">Salary</span>
              <span className="text-green-600">+ $2,000</span>
            </Card>
            <Card className="p-4 flex justify-between items-center">
              <span className="text-gray-700">Utilities</span>
              <span className="text-red-500">- $80</span>
            </Card>
          </div>
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
      </div>
    </div>
  )
}
