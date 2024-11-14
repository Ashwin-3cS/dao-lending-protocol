'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpDown, Badge, Trash2 } from 'lucide-react'
import React from 'react'
import { 
    ResponsiveContainer, 
    BarChart, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    Cell,
    PieChart,
    Bar,
    Pie

} from 'recharts';


const chartData = [
    { year: '2020', amount: 400 },
    { year: '2021', amount: 300 },
    { year: '2022', amount: 500 },
    { year: '2023', amount: 450 },
  ]


const transactionData = [
    { txHash: '0x61942323...', customer: '0x90..4b91 Moganesan', chain: 'ETH', token: '0x912ce59144191c1204e64559fe8253a0e49e6548', amount: '0.1 ETH', status: 'Confirmed' },
    { txHash: '0x71942324...', customer: '0x80..5b92 Johnson', chain: 'BTC', token: '0x812ce59144191c1204e64559fe8253a0e49e6549', amount: '0.05 BTC', status: 'Pending' },
    { txHash: '0x81942325...', customer: '0x70..6b93 Williams', chain: 'ETH', token: '0x712ce59144191c1204e64559fe8253a0e49e6550', amount: '0.2 ETH', status: 'Confirmed' },
  ]

  const pieChartData = [
    { name: 'Corporate Card', value: 2500 },
    { name: 'Debit Card', value: 6435 },
    { name: 'Credit Card', value: 5682 },
    { name: 'Cash', value: 900 },
  ]

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']
  
const Content = () => {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
    <div className="grid grid-cols-3 gap-6">
      {/* Overview Cards */}
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$56,242.00</p>
          <Badge className="bg-green-500 text-white mt-2">+4.4%</Badge>
        </CardContent>
      </Card>
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$56,242.00</p>
          <Badge className="bg-green-500 text-white mt-2">+4.4%</Badge>
        </CardContent>
      </Card>
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$56,242.00</p>
          <Badge className="bg-green-500 text-white mt-2">+4.4%</Badge>
        </CardContent>
      </Card>

      {/* Scheduled Payments */}
      <Card className="bg-black text-white col-span-2">
        <CardHeader>
          <CardTitle>Scheduled Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieChartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle>Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="gray" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* Transactions Overview */}
    <Card className="bg-black text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions Overview</CardTitle>
        <div className="flex space-x-2">
          {/* <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button> */}
          <Button variant="outline" className="bg-black" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" size="sm" className="bg-black">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">TX Hash</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Chain</th>
                <th className="pb-2">Token</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.map((transaction, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-2">{transaction.txHash}</td>
                  <td className="py-2">{transaction.customer}</td>
                  <td className="py-2">{transaction.chain}</td>
                  <td className="py-2">{transaction.token}</td>
                  <td className="py-2">{transaction.amount}</td>
                  <td className="py-2">
                    <Badge className={transaction.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </main>
  )
}

export default Content