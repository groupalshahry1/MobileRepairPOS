import React from "react";
import { MoreHorizontal, Eye, Edit, Trash2, MessageCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RepairOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  deviceModel: string;
  issueDescription: string;
  status: "new" | "in-progress" | "waiting-parts" | "completed" | "delivered";
  dateReceived: string;
  estimatedCompletion?: string;
  technician?: string;
}

interface RepairOrdersTableProps {
  orders?: RepairOrder[];
  onViewOrder?: (id: string) => void;
  onEditOrder?: (id: string) => void;
  onDeleteOrder?: (id: string) => void;
  onSendMessage?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const getStatusBadgeVariant = (status: RepairOrder["status"]) => {
  switch (status) {
    case "new":
      return "default";
    case "in-progress":
      return "secondary";
    case "waiting-parts":
      return "outline";
    case "completed":
      return "secondary";
    case "delivered":
      return "destructive";
    default:
      return "default";
  }
};

const getStatusLabel = (status: RepairOrder["status"]) => {
  switch (status) {
    case "new":
      return "جديد";
    case "in-progress":
      return "قيد الإصلاح";
    case "waiting-parts":
      return "بانتظار قطع الغيار";
    case "completed":
      return "تم الإصلاح";
    case "delivered":
      return "تم التسليم";
    default:
      return status;
  }
};

const RepairOrdersTable: React.FC<RepairOrdersTableProps> = ({
  orders = [],
  onViewOrder = () => {},
  onEditOrder = () => {},
  onDeleteOrder = () => {},
  onSendMessage = () => {},
  onStatusChange = () => {},
}) => {
  const handleStatusChange = (id: string, newStatus: string) => {
    console.log(`Changing status of order ${id} to ${newStatus}`);
    // In a real app, this would update the order status in the database
    // For now, we'll just call the onStatusChange callback if provided
    if (onStatusChange) {
      onStatusChange(id, newStatus as any);
    }

    // Update dashboard with repairs data
    const repairsData = {
      pendingCount: 12,
      urgentCount: 3,
      recentOrders: [
        {
          id: "REP-001",
          customerName: "أحمد محمد",
          deviceType: "iPhone 13",
          status: "new",
          dateReceived: "2023-06-15",
        },
        {
          id: "REP-002",
          customerName: "سارة عبدالله",
          deviceType: "Samsung Galaxy S22",
          status: "in-progress",
          dateReceived: "2023-06-14",
        },
        {
          id: "REP-003",
          customerName: "خالد العمري",
          deviceType: "Xiaomi Redmi Note 11",
          status: "waiting-parts",
          dateReceived: "2023-06-13",
        },
      ],
    };
    window.dispatchEvent(
      new CustomEvent("repairs-update", { detail: repairsData }),
    );
  };

  return (
    <div className="bg-white rounded-md shadow-sm w-full">
      <Table>
        <TableCaption>قائمة طلبات الصيانة</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>رقم الطلب</TableHead>
            <TableHead>العميل</TableHead>
            <TableHead>الجهاز</TableHead>
            <TableHead>المشكلة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الفني المسؤول</TableHead>
            <TableHead>تاريخ الاستلام</TableHead>
            <TableHead>تاريخ التسليم المتوقع</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div>
                  <div>{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.customerPhone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{order.deviceType}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.deviceModel}
                  </div>
                </div>
              </TableCell>
              <TableCell
                className="max-w-[200px] truncate"
                title={order.issueDescription}
              >
                {order.issueDescription}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {order.technician === "ahmed"
                  ? "أحمد"
                  : order.technician === "mohamed"
                    ? "محمد"
                    : order.technician === "ali"
                      ? "علي"
                      : order.technician === "omar"
                        ? "عمر"
                        : "غير محدد"}
              </TableCell>
              <TableCell>{order.dateReceived}</TableCell>
              <TableCell>{order.estimatedCompletion || "غير محدد"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">فتح القائمة</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewOrder(order.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>عرض التفاصيل</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditOrder(order.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>تعديل</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSendMessage(order.id)}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>إرسال رسالة</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteOrder(order.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>حذف</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RepairOrdersTable;
