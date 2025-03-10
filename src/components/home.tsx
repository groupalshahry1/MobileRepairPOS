import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivationBanner from "./licensing/ActivationBanner";
import AboutDialog from "./about/AboutDialog";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home as HomeIcon,
  Package2,
  Wrench,
  Receipt,
  Settings,
  ShoppingCart,
  Gift,
  Calendar,
  Shield,
  MessageSquare,
  BarChart3,
} from "lucide-react";

// Import dashboard components
import DashboardController from "../components/dashboard/DashboardController";

// Import section components
import InventoryManagement from "../components/inventory/InventoryManagement";
import RepairManagement from "../components/repairs/RepairManagement";
import SalesManagement from "../components/sales/SalesManagement";
import InvoiceSystem from "../components/invoices/InvoiceSystem";
import AppointmentSystem from "../components/appointments/AppointmentSystem";
import WarrantyTracker from "../components/warranty/WarrantyTracker";
import CustomerLoyaltySystem from "../components/loyalty/CustomerLoyaltySystem";
import WhatsappIntegration from "../components/whatsapp/WhatsappIntegration";
import AdvancedAnalytics from "../components/analytics/AdvancedAnalytics";
import SettingsPage from "../components/settings/SettingsPage";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  // Navigation handlers
  const handleNavigateToInventory = () => {
    setActiveTab("inventory");
    // Dispatch event to update dashboard when returning
    const inventoryData = {
      lowStockCount: 8,
      criticalCount: 2,
      alerts: [
        {
          id: "INV-001",
          name: "شاشة iPhone 13",
          currentStock: 2,
          minStock: 5,
          status: "low",
        },
        {
          id: "INV-002",
          name: "بطارية Samsung Galaxy S21",
          currentStock: 0,
          minStock: 3,
          status: "out",
        },
        {
          id: "INV-003",
          name: "منفذ شحن Xiaomi",
          currentStock: 3,
          minStock: 5,
          status: "low",
        },
      ],
    };
    window.dispatchEvent(
      new CustomEvent("inventory-update", { detail: inventoryData }),
    );
  };

  const handleNavigateToRepairs = () => {
    setActiveTab("repairs");
    // Dispatch event to update dashboard when returning
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

  const handleNavigateToSales = () => {
    setActiveTab("sales");
    // Dispatch event to update dashboard when returning
    const salesData = {
      dailyTotal: 3250,
      trend: {
        value: "15%",
        isPositive: true,
      },
      chartData: [
        { time: "09:00", amount: 400 },
        { time: "10:00", amount: 300 },
        { time: "11:00", amount: 500 },
        { time: "12:00", amount: 200 },
        { time: "13:00", amount: 450 },
        { time: "14:00", amount: 600 },
        { time: "15:00", amount: 800 },
      ],
      recentTransactions: [
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
    };
    window.dispatchEvent(
      new CustomEvent("sales-update", { detail: salesData }),
    );
  };

  const handleNavigateToInvoices = () => {
    setActiveTab("invoices");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ActivationBanner />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <h1
              className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setActiveTab("dashboard")}
            >
              وكالة الموبايل
            </h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <select
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue="iqd"
              onChange={(e) => {
                // تغيير العملة في التطبيق
                const currency = e.target.value;
                // يمكن تخزين العملة المختارة في حالة عامة أو localStorage
                localStorage.setItem("currency", currency);
                // إعادة تحميل الصفحة لتطبيق التغييرات
                window.location.reload();
              }}
            >
              <option value="iqd">دينار عراقي</option>
              <option value="usd">دولار أمريكي</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAboutDialog(true)}
            >
              <Info className="h-4 w-4 mr-2" />
              حول البرنامج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              <span>لوحة التحكم</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              <span>المخزون</span>
            </TabsTrigger>
            <TabsTrigger value="repairs" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span>الصيانة</span>
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="flex items-center gap-2"
              onClick={handleNavigateToSales}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>المبيعات</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>الفواتير</span>
            </TabsTrigger>
          </TabsList>

          {/* Additional Features Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("appointments")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span>المواعيد</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("warranty")}
              >
                <Shield className="h-4 w-4 mr-2" />
                <span>الضمان</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("loyalty")}
              >
                <Gift className="h-4 w-4 mr-2" />
                <span>نظام الولاء</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("whatsapp")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>الواتساب</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>التحليلات</span>
              </Button>
            </div>
          </div>

          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardController
              onNavigateToInventory={handleNavigateToInventory}
              onNavigateToRepairs={handleNavigateToRepairs}
              onNavigateToSales={() => setActiveTab("sales")}
              onNavigateToInvoices={handleNavigateToInvoices}
            />
          </TabsContent>

          {/* Inventory Tab Content */}
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          {/* Repairs Tab Content */}
          <TabsContent value="repairs">
            <RepairManagement />
          </TabsContent>

          {/* Sales Tab Content */}
          <TabsContent value="sales">
            <SalesManagement />
          </TabsContent>

          {/* Invoices Tab Content */}
          <TabsContent value="invoices">
            <InvoiceSystem />
          </TabsContent>

          {/* Appointments Tab Content */}
          <TabsContent value="appointments">
            <AppointmentSystem />
          </TabsContent>

          {/* Warranty Tab Content */}
          <TabsContent value="warranty">
            <WarrantyTracker />
          </TabsContent>

          {/* Loyalty Tab Content */}
          <TabsContent value="loyalty">
            <CustomerLoyaltySystem />
          </TabsContent>

          {/* WhatsApp Tab Content */}
          <TabsContent value="whatsapp">
            <WhatsappIntegration />
          </TabsContent>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          {/* Settings Tab Content */}
          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>

      <AboutDialog open={showAboutDialog} onOpenChange={setShowAboutDialog} />
    </div>
  );
};

export default Home;
