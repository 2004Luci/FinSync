"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CustomTooltip from '@/components/CustomTooltip';

const pieChartColors = [
  "#FF6B6B", // soft red
  "#FFA94D", // warm orange
  "#FFD43B", // golden yellow
  "#A9E34B", // lime green
  "#4DABF7", // sky blue
  "#9775FA", // soft purple
  "#F06595", // pink
  "#63E6BE", // mint green
  "#5C7CFA", // blue
  "#FF922B", // orange
  "#FAB005", // yellow
  "#69DB7C", // green
  "#3BC9DB", // cyan
  "#845EF7", // violet
  "#D0BFFF", // light lavender
  "#FFC6FF", // light pink
  "#FF8787", // rose
  "#B2F2BB", // pale green
  "#D3F9D8", // very soft green
  "#A5D8FF", // baby blue
  "#D0EBFF", // light blue
];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const DashboardOverview = ({ accounts, transactions }) => {

  const [selectedAccountId, setSelectedAccountId] = useState(accounts.find((a) => a.isDefault)?.id || accounts[0]?.id);

  // Filter transactions for selected account
  const accountTransactions = transactions.filter((t) => t.accountId === selectedAccountId);

  const recentTransactions = accountTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === 'EXPENSE' && transactionDate.getMonth() === currentDate.getMonth() && transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card className='hover:shadow-md transition-shadow group relative bg-background_secondary border-util_color'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <CardTitle className='text-base font-normal gradient-text-normal'>Recent Transactions</CardTitle>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className='w-[160px] text-subtext'>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className='text-main bg-background_secondary'>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className='cursor-pointer hover:bg-main hover:text-background'>{account.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentTransactions.length === 0 ? (
              <p className='text-center text-subtext py-4'>No recent transactions</p>
            ) : (
              recentTransactions.map((transaction) => {
                return (<div key={transaction.id} className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none text-main/80'>
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className='text-sm text-subtext'>
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className={cn("flex items-center", transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500")}>
                      {transaction.type === 'EXPENSE' ? (
                        <ArrowDownRight className='mr-1 h-4 w-4' />
                      ) : (<ArrowUpRight className='mr-1 h-4 w-4' />)}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>)
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card className='hover:shadow-md transition-shadow group relative bg-background_secondary border-util_color'>
        <CardHeader>
          <CardTitle className='text-base font-normal gradient-text-normal'>Monthly Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className='p-0 pb-5'>
          {pieChartData.length === 0 ? (
            <p className='text-center text-subtext py-4'>No expenses this month</p>
          ) : (
            <div className='h-[300px]'>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={80} fill='#8884d8' dataKey="value" label={({ name, value }) => `${capitalize(name)}: ₹${value.toFixed(2)}`}>
                    {
                      pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                      ))
                    }
                  </Pie>
                  <Tooltip content={<CustomTooltip pieChartData={pieChartData} />} />
                  <Legend formatter={(value) => capitalize(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview