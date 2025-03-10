import React, { useState, useEffect } from "react";
import SummaryCards from "./SummaryCards";
import DailySalesSummary from "./DailySalesSummary";
import NewRepairOrders from "./NewRepairOrders";
import InventoryAlerts from "./InventoryAlerts";

interface DashboardControllerProps {
  onNavigateToInventory?: () => void;
  onNavigateToRepairs?: () => void;
  onNavigateToSales?: () => void;
  onNavigateToInvoices?: () => void;
}

const DashboardController: React.FC<DashboardControllerProps> = ({
  onNavigateToInventory = () => {},
  onNavigateToRepairs = () => {},
  onNavigateToSales = () => {},
  onNavigateToInvoices = () => {},
}) => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    dailySales: {
      total: 3250,
      trend: {
        value: "15%",
        isPositive: true,
      },
    },
    pendingRepairs: {
      count: 12,
      urgent: 3,
    },
    lowStockItems: {
      count: 8,
      critical: 2,
    },
    salesChartData: [
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
    repairOrders: [
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
    inventoryAlerts: [
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
  });

  // Function to update dashboard data from different modules
  const updateDashboardData = (moduleData: any, moduleType: string) => {
    setDashboardData((prevData) => {
      switch (moduleType) {
        case "inventory":
          return {
            ...prevData,
            lowStockItems: {
              count: moduleData.lowStockCount || prevData.lowStockItems.count,
              critical:
                moduleData.criticalCount || prevData.lowStockItems.critical,
            },
            inventoryAlerts: moduleData.alerts || prevData.inventoryAlerts,
          };
        case "repairs":
          return {
            ...prevData,
            pendingRepairs: {
              count: moduleData.pendingCount || prevData.pendingRepairs.count,
              urgent: moduleData.urgentCount || prevData.pendingRepairs.urgent,
            },
            repairOrders: moduleData.recentOrders || prevData.repairOrders,
          };
        case "sales":
          return {
            ...prevData,
            dailySales: {
              total: moduleData.dailyTotal || prevData.dailySales.total,
              trend: moduleData.trend || prevData.dailySales.trend,
            },
            salesChartData: moduleData.chartData || prevData.salesChartData,
            recentTransactions:
              moduleData.recentTransactions || prevData.recentTransactions,
          };
        default:
          return prevData;
      }
    });
  };

  // Simulate data updates from different modules
  useEffect(() => {
    // Listen for custom events from different modules
    const handleInventoryUpdate = (event: CustomEvent) => {
      updateDashboardData(event.detail, "inventory");
    };

    const handleRepairsUpdate = (event: CustomEvent) => {
      updateDashboardData(event.detail, "repairs");
    };

    const handleSalesUpdate = (event: CustomEvent) => {
      updateDashboardData(event.detail, "sales");
    };

    // Add event listeners
    window.addEventListener(
      "inventory-update" as any,
      handleInventoryUpdate as EventListener,
    );
    window.addEventListener(
      "repairs-update" as any,
      handleRepairsUpdate as EventListener,
    );
    window.addEventListener(
      "sales-update" as any,
      handleSalesUpdate as EventListener,
    );

    // Cleanup event listeners
    return () => {
      window.removeEventListener(
        "inventory-update" as any,
        handleInventoryUpdate as EventListener,
      );
      window.removeEventListener(
        "repairs-update" as any,
        handleRepairsUpdate as EventListener,
      );
      window.removeEventListener(
        "sales-update" as any,
        handleSalesUpdate as EventListener,
      );
    };
  }, []);

  return (
    <div className="space-y-6">
      <SummaryCards
        dailySales={dashboardData.dailySales}
        pendingRepairs={dashboardData.pendingRepairs}
        lowStockItems={dashboardData.lowStockItems}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DailySalesSummary
          totalSales={dashboardData.dailySales.total}
          percentageChange={parseFloat(dashboardData.dailySales.trend.value)}
          chartData={dashboardData.salesChartData}
          recentTransactions={dashboardData.recentTransactions}
        />
        <NewRepairOrders
          orders={dashboardData.repairOrders}
          onViewAll={onNavigateToRepairs}
        />
        <InventoryAlerts
          alerts={dashboardData.inventoryAlerts}
          onViewAllAlerts={onNavigateToInventory}
        />
      </div>
    </div>
  );
};

export default DashboardController;
