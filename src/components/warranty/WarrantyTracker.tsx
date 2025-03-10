import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

interface WarrantyItem {
  id: string;
  customerName: string;
  customerPhone: string;
  itemName: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriod: number; // in months
  expiryDate: string;
  status: "active" | "expired" | "about-to-expire";
  notes?: string;
}

interface WarrantyTrackerProps {
  warranties?: WarrantyItem[];
  onAddWarranty?: (warranty: Partial<WarrantyItem>) => void;
  onUpdateWarranty?: (id: string, warranty: Partial<WarrantyItem>) => void;
}

const WarrantyTracker = ({
  warranties = [
    {
      id: "W001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      itemName: "شاشة iPhone 13",
      serialNumber: "SCR13-78945",
      purchaseDate: "2023-01-15",
      warrantyPeriod: 6,
      expiryDate: "2023-07-15",
      status: "active",
      notes: "تم تركيب الشاشة في المحل",
    },
    {
      id: "W002",
      customerName: "سارة عبدالله",
      customerPhone: "0559876543",
      itemName: "بطارية Samsung Galaxy S21",
      serialNumber: "BAT21-12345",
      purchaseDate: "2022-12-10",
      warrantyPeriod: 3,
      expiryDate: "2023-03-10",
      status: "expired",
    },
    {
      id: "W003",
      customerName: "خالد العمري",
      customerPhone: "0561122334",
      itemName: "منفذ شحن Xiaomi Redmi Note 10",
      serialNumber: "CHG10-56789",
      purchaseDate: "2023-04-20",
      warrantyPeriod: 6,
      expiryDate: "2023-10-20",
      status: "active",
    },
    {
      id: "W004",
      customerName: "نورة السالم",
      customerPhone: "0577889900",
      itemName: "كاميرا iPhone 12",
      serialNumber: "CAM12-24680",
      purchaseDate: "2023-05-05",
      warrantyPeriod: 3,
      expiryDate: "2023-08-05",
      status: "about-to-expire",
    },
  ],
  onAddWarranty = () => {},
  onUpdateWarranty = () => {},
}: WarrantyTrackerProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newWarranty, setNewWarranty] = useState<Partial<WarrantyItem>>({
    customerName: "",
    customerPhone: "",
    itemName: "",
    serialNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    warrantyPeriod: 6,
    notes: "",
  });

  // Filter warranties based on search term and active tab
  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch =
      warranty.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && warranty.status === activeTab;
  });

  // Calculate days remaining until warranty expiry
  const getDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge
  const getStatusBadge = (status: string, expiryDate: string) => {
    const daysRemaining = getDaysRemaining(expiryDate);

    switch (status) {
      case "active":
        return daysRemaining > 30 ? (
          <Badge className="bg-green-100 text-green-800">سارية</Badge>
        ) : (
          <Badge className="bg-yellow-100 text-yellow-800">تنتهي قريباً</Badge>
        );
      case "about-to-expire":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">تنتهي قريباً</Badge>
        );
      case "expired":
        return <Badge variant="destructive">منتهية</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate expiry date
    const purchaseDate = new Date(newWarranty.purchaseDate || "");
    const expiryDate = new Date(purchaseDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + (newWarranty.warrantyPeriod || 0),
    );

    // Create new warranty object
    const warranty = {
      ...newWarranty,
      id: `W${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      expiryDate: expiryDate.toISOString().split("T")[0],
      status: "active" as const,
    };

    onAddWarranty(warranty);
    // Reset form
    setNewWarranty({
      customerName: "",
      customerPhone: "",
      itemName: "",
      serialNumber: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      warrantyPeriod: 6,
      notes: "",
    });
    // Switch to all warranties view
    setActiveTab("all");
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              نظام تتبع الضمان
            </h1>
            <p className="text-gray-500 mt-1">
              إدارة ضمانات قطع الغيار والإصلاحات
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>الكل</span>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>سارية</span>
                </TabsTrigger>
                <TabsTrigger
                  value="about-to-expire"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>قريبة الانتهاء</span>
                </TabsTrigger>
                <TabsTrigger
                  value="expired"
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>منتهية</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث عن عميل، منتج، أو رقم تسلسلي"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4"
                  />
                </div>
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة ضمان جديد
                </Button>
              </div>

              <TabsContent value="all" className="mt-4">
                <WarrantyTable
                  warranties={filteredWarranties}
                  getDaysRemaining={getDaysRemaining}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <WarrantyTable
                  warranties={filteredWarranties}
                  getDaysRemaining={getDaysRemaining}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="about-to-expire" className="mt-4">
                <WarrantyTable
                  warranties={filteredWarranties}
                  getDaysRemaining={getDaysRemaining}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="expired" className="mt-4">
                <WarrantyTable
                  warranties={filteredWarranties}
                  getDaysRemaining={getDaysRemaining}
                  getStatusBadge={getStatusBadge}
                />
              </TabsContent>

              <TabsContent value="new" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إضافة ضمان جديد</CardTitle>
                    <CardDescription>أدخل بيانات الضمان الجديد</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="customerName">اسم العميل</Label>
                            <Input
                              id="customerName"
                              placeholder="أدخل اسم العميل"
                              value={newWarranty.customerName}
                              onChange={(e) =>
                                setNewWarranty({
                                  ...newWarranty,
                                  customerName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="customerPhone">رقم الهاتف</Label>
                            <Input
                              id="customerPhone"
                              placeholder="05xxxxxxxx"
                              value={newWarranty.customerPhone}
                              onChange={(e) =>
                                setNewWarranty({
                                  ...newWarranty,
                                  customerPhone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="itemName">اسم المنتج</Label>
                            <Input
                              id="itemName"
                              placeholder="مثال: شاشة iPhone 13"
                              value={newWarranty.itemName}
                              onChange={(e) =>
                                setNewWarranty({
                                  ...newWarranty,
                                  itemName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
                            <Input
                              id="serialNumber"
                              placeholder="أدخل الرقم التسلسلي للمنتج"
                              value={newWarranty.serialNumber}
                              onChange={(e) =>
                                setNewWarranty({
                                  ...newWarranty,
                                  serialNumber: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="purchaseDate">تاريخ الشراء</Label>
                              <Input
                                id="purchaseDate"
                                type="date"
                                value={newWarranty.purchaseDate}
                                onChange={(e) =>
                                  setNewWarranty({
                                    ...newWarranty,
                                    purchaseDate: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="warrantyPeriod">
                                مدة الضمان (بالشهور)
                              </Label>
                              <Input
                                id="warrantyPeriod"
                                type="number"
                                min="1"
                                max="36"
                                value={newWarranty.warrantyPeriod}
                                onChange={(e) =>
                                  setNewWarranty({
                                    ...newWarranty,
                                    warrantyPeriod: parseInt(e.target.value),
                                  })
                                }
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">ملاحظات</Label>
                            <Input
                              id="notes"
                              placeholder="أي ملاحظات إضافية"
                              value={newWarranty.notes}
                              onChange={(e) =>
                                setNewWarranty({
                                  ...newWarranty,
                                  notes: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("all")}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit">إضافة الضمان</Button>
                      </div>
                    </form>
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

interface WarrantyTableProps {
  warranties: WarrantyItem[];
  getDaysRemaining: (expiryDate: string) => number;
  getStatusBadge: (status: string, expiryDate: string) => React.ReactNode;
}

const WarrantyTable = ({
  warranties,
  getDaysRemaining,
  getStatusBadge,
}: WarrantyTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العميل</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>الرقم التسلسلي</TableHead>
              <TableHead>تاريخ الشراء</TableHead>
              <TableHead>تاريخ انتهاء الضمان</TableHead>
              <TableHead>المدة المتبقية</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warranties.length > 0 ? (
              warranties.map((warranty) => (
                <TableRow key={warranty.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{warranty.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {warranty.customerPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{warranty.itemName}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {warranty.serialNumber}
                  </TableCell>
                  <TableCell>{warranty.purchaseDate}</TableCell>
                  <TableCell>{warranty.expiryDate}</TableCell>
                  <TableCell>
                    {getDaysRemaining(warranty.expiryDate) > 0 ? (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-primary" />
                        {getDaysRemaining(warranty.expiryDate)} يوم
                      </span>
                    ) : (
                      <span className="text-red-500">منتهي</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(warranty.status, warranty.expiryDate)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  لا توجد بيانات ضمان مطابقة للبحث
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WarrantyTracker;
