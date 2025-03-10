import React, { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import RepairStatusFilters from "./RepairStatusFilters";
import RepairOrdersTable from "./RepairOrdersTable";

interface RepairFilters {
  status: string;
  searchQuery: string;
  dateRange: string;
  technician: string;
}

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

interface RepairManagementProps {
  initialFilters?: RepairFilters;
  initialOrders?: RepairOrder[];
}

// Mock data for repair orders
const mockOrders: RepairOrder[] = [
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
    technician: "ahmed",
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
    technician: "mohamed",
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
    technician: "ali",
  },
  {
    id: "REP-004",
    customerName: "فاطمة الزهراني",
    customerPhone: "0577889900",
    deviceType: "iPhone",
    deviceModel: "12 Mini",
    issueDescription: "لا يعمل الميكروفون",
    status: "completed",
    dateReceived: "2023-06-10",
    estimatedCompletion: "2023-06-15",
    technician: "omar",
  },
  {
    id: "REP-005",
    customerName: "محمد السالم",
    customerPhone: "0533445566",
    deviceType: "Huawei",
    deviceModel: "P40 Pro",
    issueDescription: "مشكلة في الكاميرا",
    status: "delivered",
    dateReceived: "2023-06-08",
    estimatedCompletion: "2023-06-12",
    technician: "ahmed",
  },
];

const RepairManagement = ({
  initialFilters = {
    status: "all",
    searchQuery: "",
    dateRange: "all",
    technician: "all",
  },
  initialOrders = [],
}: RepairManagementProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<RepairFilters>(initialFilters);
  const [isAddRepairDialogOpen, setIsAddRepairDialogOpen] = useState(false);
  const [newRepair, setNewRepair] = useState<Partial<RepairOrder>>({
    customerName: "",
    customerPhone: "",
    deviceType: "",
    deviceModel: "",
    issueDescription: "",
  });

  // Handle filter changes from the RepairStatusFilters component
  const handleFilterChange = (newFilters: RepairFilters) => {
    setFilters(newFilters);
    // If status filter changes, update the active tab to match
    if (newFilters.status !== "all") {
      setActiveTab(newFilters.status);
    } else {
      setActiveTab("all");
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

  // Filter orders based on current filters
  const getFilteredOrders = () => {
    return mockOrders.filter((order) => {
      // Filter by status
      if (filters.status !== "all" && order.status !== filters.status) {
        return false;
      }

      // Filter by search query
      if (
        filters.searchQuery &&
        !(
          order.id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          order.customerName
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          order.customerPhone
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          order.deviceType
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          order.deviceModel
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by date range (simplified implementation)
      if (filters.dateRange !== "all") {
        // This would normally include date logic based on the selected range
        // For now, we'll just return true to not filter by date
      }

      // Filter by technician
      if (
        filters.technician !== "all" &&
        order.technician !== filters.technician
      ) {
        return false;
      }

      return true;
    });
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update the status filter to match the selected tab
    setFilters({
      ...filters,
      status: value === "all" ? "all" : value,
    });
  };

  // Handle view order details
  const handleViewOrder = (id: string) => {
    console.log(`Viewing order details for order ${id}`);
    // Implement view order functionality
  };

  // Handle edit order
  const handleEditOrder = (id: string) => {
    console.log(`Editing order ${id}`);
    // Implement edit order functionality
  };

  // Handle delete order
  const handleDeleteOrder = (id: string) => {
    console.log(`Deleting order ${id}`);
    // Find the index of the order to delete
    const orderIndex = mockOrders.findIndex((order) => order.id === id);
    if (orderIndex !== -1) {
      // Remove the order from the mockOrders array
      mockOrders.splice(orderIndex, 1);
      // Force a re-render
      setActiveTab(activeTab);
    }
  };

  // Handle send message to customer
  const handleSendMessage = (id: string) => {
    console.log(`Sending message for order ${id}`);
    // Implement send message functionality
  };

  // Handle add new repair order
  const handleAddRepair = () => {
    console.log("Adding new repair order:", newRepair);

    // Create a new repair order with default values
    const newOrder: RepairOrder = {
      id: `REP-${String(mockOrders.length + 1).padStart(3, "0")}`,
      customerName: newRepair.customerName || "",
      customerPhone: newRepair.customerPhone || "",
      deviceType: newRepair.deviceType || "",
      deviceModel: newRepair.deviceModel || "",
      issueDescription: newRepair.issueDescription || "",
      status: "new",
      dateReceived: new Date().toISOString().split("T")[0],
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      technician: "ahmed", // Default technician
    };

    // Add the new order to the mockOrders array
    mockOrders.unshift(newOrder);

    // Close the dialog and reset the form
    setIsAddRepairDialogOpen(false);
    setNewRepair({
      customerName: "",
      customerPhone: "",
      deviceType: "",
      deviceModel: "",
      issueDescription: "",
    });
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        {/* Header with title and add button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Wrench className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-2xl font-bold">إدارة طلبات الصيانة</h1>
          </div>
          <Dialog
            open={isAddRepairDialogOpen}
            onOpenChange={setIsAddRepairDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                طلب صيانة جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة طلب صيانة جديد</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="customerName" className="text-right">
                    اسم العميل
                  </label>
                  <input
                    id="customerName"
                    className="col-span-3 p-2 border rounded-md"
                    value={newRepair.customerName}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        customerName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="customerPhone" className="text-right">
                    رقم الهاتف
                  </label>
                  <input
                    id="customerPhone"
                    className="col-span-3 p-2 border rounded-md"
                    value={newRepair.customerPhone}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        customerPhone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceType" className="text-right">
                    نوع الجهاز
                  </label>
                  <input
                    id="deviceType"
                    className="col-span-3 p-2 border rounded-md"
                    value={newRepair.deviceType}
                    onChange={(e) =>
                      setNewRepair({ ...newRepair, deviceType: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="deviceModel" className="text-right">
                    موديل الجهاز
                  </label>
                  <input
                    id="deviceModel"
                    className="col-span-3 p-2 border rounded-md"
                    value={newRepair.deviceModel}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        deviceModel: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="issueDescription" className="text-right">
                    وصف المشكلة
                  </label>
                  <textarea
                    id="issueDescription"
                    className="col-span-3 p-2 border rounded-md"
                    rows={3}
                    value={newRepair.issueDescription}
                    onChange={(e) =>
                      setNewRepair({
                        ...newRepair,
                        issueDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddRepair}>
                  إضافة الطلب
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <RepairStatusFilters onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>

        {/* Tabs and Table */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="new">جديد</TabsTrigger>
                <TabsTrigger value="in-progress">قيد التنفيذ</TabsTrigger>
                <TabsTrigger value="waiting-parts">
                  بانتظار قطع الغيار
                </TabsTrigger>
                <TabsTrigger value="completed">مكتمل</TabsTrigger>
                <TabsTrigger value="delivered">تم التسليم</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-4">
            <RepairOrdersTable
              orders={getFilteredOrders()}
              onViewOrder={handleViewOrder}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
              onSendMessage={handleSendMessage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepairManagement;
