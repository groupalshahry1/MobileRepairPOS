import React from "react";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

interface Transaction {
  id: string;
  time: string;
  amount: number;
  type: "sales" | "repair";
  description: string;
}

interface DailySalesSummaryProps {
  totalSales?: number;
  percentageChange?: number;
  chartData?: { time: string; amount: number }[];
  recentTransactions?: Transaction[];
}

const DailySalesSummary = ({
  totalSales = 3250,
  percentageChange = 12.5,
  chartData = [
    { time: "09:00", amount: 400 },
    { time: "10:00", amount: 300 },
    { time: "11:00", amount: 500 },
    { time: "12:00", amount: 200 },
    { time: "13:00", amount: 450 },
    { time: "14:00", amount: 600 },
    { time: "15:00", amount: 800 },
  ],
  recentTransactions = [
    {
      id: "TX001",
      time: "14:32",
      amount: 850,
      type: "sales",
      description: "بيع iPhone 13 شاشة",
    },
    {
      id: "TX002",
      time: "13:15",
      amount: 450,
      type: "repair",
      description: "صيانة Samsung Galaxy S21",
    },
    {
      id: "TX003",
      time: "11:45",
      amount: 350,
      type: "sales",
      description: "بيع بطارية Xiaomi Redmi Note 10",
    },
  ],
}: DailySalesSummaryProps) => {
  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          <span>ملخص المبيعات اليومية</span>
          <span className="text-2xl">{formatCurrency(totalSales)}</span>
        </CardTitle>
        <div className="flex items-center text-sm">
          {percentageChange >= 0 ? (
            <div className="flex items-center text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>+{percentageChange}% من الأمس</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span>{percentageChange}% من الأمس</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  "المبيعات",
                ]}
                labelFormatter={(label) => `الوقت: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">آخر المعاملات</h3>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs">
                    {transaction.type === "sales" ? "مبيعات" : "صيانة"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySalesSummary;
