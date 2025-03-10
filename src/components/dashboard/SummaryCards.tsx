import React from "react";
import { CreditCard, Wrench, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const SummaryCard = ({
  title = "العنوان",
  value = "0",
  icon = <CreditCard className="h-8 w-8 text-muted-foreground" />,
  description,
  trend,
}: SummaryCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 p-2 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={`text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  dailySales?: {
    total: number;
    trend: {
      value: string;
      isPositive: boolean;
    };
  };
  pendingRepairs?: {
    count: number;
    urgent: number;
  };
  lowStockItems?: {
    count: number;
    critical: number;
  };
}

const SummaryCards = ({
  dailySales = {
    total: 3250,
    trend: {
      value: "15%",
      isPositive: true,
    },
  },
  pendingRepairs = {
    count: 12,
    urgent: 3,
  },
  lowStockItems = {
    count: 8,
    critical: 2,
  },
}: SummaryCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
      <SummaryCard
        title="إجمالي المبيعات اليومية"
        value={formatCurrency(dailySales.total)}
        icon={<CreditCard className="h-5 w-5 text-primary" />}
        description="إجمالي المبيعات والصيانة لليوم الحالي"
        trend={dailySales.trend}
      />
      <SummaryCard
        title="طلبات الصيانة المعلقة"
        value={pendingRepairs.count.toString()}
        icon={<Wrench className="h-5 w-5 text-primary" />}
        description={`${pendingRepairs.urgent} طلبات عاجلة تحتاج للمتابعة`}
      />
      <SummaryCard
        title="قطع غيار منخفضة المخزون"
        value={lowStockItems.count.toString()}
        icon={<AlertTriangle className="h-5 w-5 text-primary" />}
        description={`${lowStockItems.critical} قطع غيار نفذت بالكامل`}
      />
    </div>
  );
};

export default SummaryCards;
