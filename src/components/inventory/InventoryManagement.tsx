import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package2, BarChart3, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";

interface InventoryManagementProps {
  onFilterChange?: (filters: {
    search: string;
    deviceType: string;
    partType: string;
  }) => void;
}

const InventoryManagement = ({
  onFilterChange = () => {},
}: InventoryManagementProps) => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [filters, setFilters] = useState({
    search: "",
    deviceType: "all",
    partType: "all",
  });

  const handleFilterChange = (newFilters: {
    search: string;
    deviceType: string;
    partType: string;
  }) => {
    setFilters(newFilters);
    onFilterChange(newFilters);

    // Update dashboard with inventory data
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

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون</h1>
            <p className="text-gray-500 mt-1">
              إدارة قطع الغيار والمخزون بكفاءة
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="inventory"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger
                  value="inventory"
                  className="flex items-center gap-2"
                >
                  <Package2 className="h-4 w-4" />
                  <span>المخزون</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>التحليلات</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>الإعدادات</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="mt-4 space-y-4">
                <InventoryFilters onFilterChange={handleFilterChange} />
                <InventoryTable filters={filters} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>تحليلات المخزون</CardTitle>
                    <CardDescription>
                      عرض إحصائيات وتحليلات المخزون
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            معدل دوران المخزون
                          </CardTitle>
                          <CardDescription>
                            عدد مرات بيع واستبدال المخزون خلال الفترة
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>شاشة iPhone 13</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "85%" }}
                                ></div>
                              </div>
                              <span className="text-sm">4.5 مرات</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>بطارية Samsung S21</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                              <span className="text-sm">3.8 مرات</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>منفذ شحن Xiaomi</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "65%" }}
                                ></div>
                              </div>
                              <span className="text-sm">3.2 مرات</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            المنتجات الأكثر مبيعاً
                          </CardTitle>
                          <CardDescription>
                            قطع الغيار الأكثر طلباً خلال الفترة
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>شاشة iPhone 13</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "85%" }}
                                ></div>
                              </div>
                              <span className="text-sm">85%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>بطارية Samsung S21</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                              <span className="text-sm">70%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>منفذ شحن Xiaomi</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "65%" }}
                                ></div>
                              </div>
                              <span className="text-sm">65%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات المخزون</CardTitle>
                    <CardDescription>
                      تخصيص إعدادات المخزون والتنبيهات
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">
                            إعدادات التنبيهات
                          </h3>
                          <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="lowStockThreshold">
                                حد التنبيه للمخزون المنخفض
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="lowStockThreshold"
                                  type="number"
                                  defaultValue="5"
                                  className="w-24"
                                />
                                <span className="text-sm text-gray-500">
                                  وحدات
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                سيتم تنبيهك عندما تنخفض الكمية عن هذا الحد
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <input
                                type="checkbox"
                                id="emailNotifications"
                                className="rounded border-gray-300"
                                defaultChecked
                              />
                              <Label htmlFor="emailNotifications">
                                تفعيل إشعارات البريد الإلكتروني
                              </Label>
                            </div>

                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <input
                                type="checkbox"
                                id="whatsappNotifications"
                                className="rounded border-gray-300"
                                defaultChecked
                              />
                              <Label htmlFor="whatsappNotifications">
                                تفعيل إشعارات الواتساب
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">إعدادات العرض</h3>
                          <div className="space-y-4">
                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="defaultView">
                                طريقة العرض الافتراضية
                              </Label>
                              <Select defaultValue="table">
                                <SelectTrigger id="defaultView">
                                  <SelectValue placeholder="اختر طريقة العرض" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="table">جدول</SelectItem>
                                  <SelectItem value="grid">شبكة</SelectItem>
                                  <SelectItem value="list">قائمة</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Label htmlFor="itemsPerPage">
                                عدد العناصر في الصفحة
                              </Label>
                              <Select defaultValue="10">
                                <SelectTrigger id="itemsPerPage">
                                  <SelectValue placeholder="اختر عدد العناصر" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5">5 عناصر</SelectItem>
                                  <SelectItem value="10">10 عناصر</SelectItem>
                                  <SelectItem value="20">20 عنصر</SelectItem>
                                  <SelectItem value="50">50 عنصر</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            // إعادة تعيين القيم إلى الإعدادات الافتراضية
                            const savedSettings =
                              localStorage.getItem("inventorySettings");
                            if (savedSettings) {
                              const settings = JSON.parse(savedSettings);
                              (
                                document.getElementById(
                                  "lowStockThreshold",
                                ) as HTMLInputElement
                              ).value =
                                settings.lowStockThreshold?.toString() || "5";
                              (
                                document.getElementById(
                                  "emailNotifications",
                                ) as HTMLInputElement
                              ).checked = settings.emailNotifications || true;
                              (
                                document.getElementById(
                                  "whatsappNotifications",
                                ) as HTMLInputElement
                              ).checked =
                                settings.whatsappNotifications || true;
                            }
                            alert("تم إلغاء التغييرات");
                          }}
                        >
                          إلغاء
                        </Button>
                        <Button
                          onClick={() => {
                            // Get the threshold value
                            const thresholdInput = document.getElementById(
                              "lowStockThreshold",
                            ) as HTMLInputElement;
                            const threshold =
                              parseInt(thresholdInput.value) || 5;

                            // Get notification settings
                            const emailEnabled = (
                              document.getElementById(
                                "emailNotifications",
                              ) as HTMLInputElement
                            ).checked;
                            const whatsappEnabled = (
                              document.getElementById(
                                "whatsappNotifications",
                              ) as HTMLInputElement
                            ).checked;

                            // حفظ الإعدادات في localStorage
                            localStorage.setItem(
                              "inventorySettings",
                              JSON.stringify({
                                lowStockThreshold: threshold,
                                emailNotifications: emailEnabled,
                                whatsappNotifications: whatsappEnabled,
                                defaultView: "table",
                                itemsPerPage: 10,
                              }),
                            );

                            // تطبيق الإعدادات على جميع العناصر في المخزون
                            // تحديث حد التنبيه لجميع العناصر في المخزون
                            const inventoryItems =
                              document.querySelectorAll(".inventory-item");
                            inventoryItems.forEach((item) => {
                              // تحديث حد التنبيه للعنصر
                              const itemId = item.getAttribute("data-item-id");
                              if (itemId) {
                                // تحديث حالة العنصر بناءً على الحد الجديد
                                const quantityElement =
                                  item.querySelector(".item-quantity");
                                if (quantityElement) {
                                  const quantity = parseInt(
                                    quantityElement.textContent || "0",
                                  );
                                  // تطبيق الحد الجديد
                                  if (quantity <= threshold) {
                                    quantityElement.classList.add("bg-red-100");
                                    quantityElement.classList.add(
                                      "text-red-800",
                                    );
                                    quantityElement.classList.remove(
                                      "bg-green-100",
                                    );
                                    quantityElement.classList.remove(
                                      "text-green-800",
                                    );
                                  } else {
                                    quantityElement.classList.remove(
                                      "bg-red-100",
                                    );
                                    quantityElement.classList.remove(
                                      "text-red-800",
                                    );
                                    quantityElement.classList.add(
                                      "bg-green-100",
                                    );
                                    quantityElement.classList.add(
                                      "text-green-800",
                                    );
                                  }
                                }
                              }
                            });

                            // Show success message
                            alert("تم حفظ إعدادات المخزون بنجاح");

                            // Update dashboard with inventory data
                            const inventoryData = {
                              lowStockCount: 8,
                              criticalCount: 2,
                              alerts: [
                                {
                                  id: "INV-001",
                                  name: "شاشة iPhone 13",
                                  currentStock: 2,
                                  minStock: threshold,
                                  status: "low",
                                },
                                {
                                  id: "INV-002",
                                  name: "بطارية Samsung Galaxy S21",
                                  currentStock: 0,
                                  minStock: threshold,
                                  status: "out",
                                },
                                {
                                  id: "INV-003",
                                  name: "منفذ شحن Xiaomi",
                                  currentStock: 3,
                                  minStock: threshold,
                                  status: "low",
                                },
                              ],
                            };
                            window.dispatchEvent(
                              new CustomEvent("inventory-update", {
                                detail: inventoryData,
                              }),
                            );

                            // تحديث حالة المكون لإعادة عرضه وتطبيق التغييرات
                            window.dispatchEvent(new Event("storage"));

                            // تبديل التبويب لإظهار التغييرات
                            setActiveTab("inventory");
                            setTimeout(() => setActiveTab("settings"), 100);
                          }}
                        >
                          حفظ الإعدادات
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
