import React from "react";
import { AlertTriangle, ArrowRight, ShoppingCart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface InventoryAlert {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  status: "low" | "out";
}

interface InventoryAlertsProps {
  alerts?: InventoryAlert[];
  onOrderItems?: (items: string[]) => void;
  onViewAllAlerts?: () => void;
}

const InventoryAlerts = ({
  alerts = [
    {
      id: "1",
      name: "شاشة iPhone 13",
      currentStock: 2,
      minStock: 5,
      status: "low",
    },
    {
      id: "2",
      name: "بطارية Samsung Galaxy S21",
      currentStock: 1,
      minStock: 3,
      status: "low",
    },
    {
      id: "3",
      name: "منفذ شحن Xiaomi Redmi Note 10",
      currentStock: 0,
      minStock: 2,
      status: "out",
    },
    {
      id: "4",
      name: "كاميرا iPhone 12",
      currentStock: 3,
      minStock: 5,
      status: "low",
    },
  ],
  onOrderItems = () => {},
  onViewAllAlerts = () => {},
}: InventoryAlertsProps) => {
  // Filter items that are below threshold or out of stock
  const lowStockItems = alerts.filter(
    (item) => item.currentStock <= item.minStock,
  );
  const outOfStockItems = alerts.filter((item) => item.currentStock === 0);

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">تنبيهات المخزون</CardTitle>
          <Badge
            variant="destructive"
            className="flex items-center gap-1 px-2 py-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{lowStockItems.length} تنبيه</span>
          </Badge>
        </div>
        <CardDescription>قطع غيار تحتاج إلى إعادة طلب</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 max-h-[180px] overflow-y-auto">
          {lowStockItems.length > 0 ? (
            lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md border border-gray-100 bg-gray-50"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        item.currentStock === 0 ? "destructive" : "outline"
                      }
                      className={`text-xs ${item.currentStock === 0 ? "" : "bg-yellow-100 text-yellow-800 border-yellow-200"}`}
                    >
                      {item.currentStock === 0
                        ? "نفذت الكمية"
                        : `الكمية: ${item.currentStock}`}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      الحد الأدنى: {item.minStock}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => onOrderItems([item.id])}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  طلب
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              لا توجد تنبيهات حالياً
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-sm text-gray-500">
          {outOfStockItems.length > 0 && (
            <span className="text-red-500 font-medium">
              {outOfStockItems.length} قطعة نفذت من المخزون
            </span>
          )}
        </div>
        <Button
          variant="link"
          className="text-sm p-0 h-auto"
          onClick={onViewAllAlerts}
        >
          عرض كل التنبيهات
          <ArrowRight className="h-4 w-4 mr-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InventoryAlerts;
