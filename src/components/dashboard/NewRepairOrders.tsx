import React from "react";
import { Phone, Clock, Wrench, AlertCircle, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

interface RepairOrder {
  id: string;
  customerName: string;
  customerPhone?: string;
  deviceType: string;
  deviceModel?: string;
  issueDescription?: string;
  status:
    | "new"
    | "in-progress"
    | "waiting-parts"
    | "completed"
    | "cancelled"
    | "delivered";
  dateReceived: string;
  estimatedCompletion?: string;
}

interface NewRepairOrdersProps {
  orders?: RepairOrder[];
  onViewAll?: () => void;
  onViewOrder?: (id: string) => void;
}

const getStatusBadge = (status: RepairOrder["status"]) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-100 text-blue-800">جديد</Badge>;
    case "in-progress":
      return <Badge variant="secondary">قيد الإصلاح</Badge>;
    case "waiting-parts":
      return <Badge variant="outline">بانتظار قطع الغيار</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-800">تم الإصلاح</Badge>;
    case "cancelled":
      return <Badge variant="destructive">ملغي</Badge>;
    case "delivered":
      return <Badge className="bg-green-100 text-green-800">تم التسليم</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const NewRepairOrders: React.FC<NewRepairOrdersProps> = ({
  orders = [
    {
      id: "REP-001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      deviceType: "iPhone",
      deviceModel: "13 Pro",
      issueDescription: "شاشة مكسورة",
      status: "new",
      dateReceived: "2023-06-15",
      estimatedCompletion: "2023-06-17",
    },
    {
      id: "REP-002",
      customerName: "سارة عبدالله",
      customerPhone: "0559876543",
      deviceType: "Samsung",
      deviceModel: "Galaxy S22",
      issueDescription: "بطارية لا تشحن",
      status: "in-progress",
      dateReceived: "2023-06-14",
      estimatedCompletion: "2023-06-16",
    },
    {
      id: "REP-003",
      customerName: "خالد العمري",
      customerPhone: "0561122334",
      deviceType: "Xiaomi",
      deviceModel: "Redmi Note 11",
      issueDescription: "مشكلة في السماعة",
      status: "waiting-parts",
      dateReceived: "2023-06-13",
      estimatedCompletion: "2023-06-20",
    },
  ],
  onViewAll = () => {},
  onViewOrder = () => {},
}) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            طلبات الصيانة الجديدة
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-primary"
          >
            عرض الكل
            <ChevronRight className="h-4 w-4 mr-1" />
          </Button>
        </div>
        <CardDescription>آخر طلبات الصيانة الواردة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-3 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onViewOrder(order.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="font-medium">{order.id}</div>
                  <div className="mx-2">•</div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.dateReceived}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <Wrench className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="font-medium">
                  {order.deviceType} {order.deviceModel}
                </span>
              </div>

              {order.issueDescription && (
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm truncate">
                    {order.issueDescription}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{order.customerName}</span>
                </div>

                {order.estimatedCompletion && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      متوقع: {order.estimatedCompletion || "غير محدد"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" onClick={onViewAll}>
          عرض جميع طلبات الصيانة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewRepairOrders;
