import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Package,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: "available" | "low-stock" | "out-of-stock";
}

interface SalesManagementProps {
  items?: SalesItem[];
  onAddItem?: (item: Partial<SalesItem>) => void;
  onEditItem?: (id: string, item: Partial<SalesItem>) => void;
  onDeleteItem?: (id: string) => void;
}

const SalesManagement = ({
  items = [
    {
      id: "S001",
      name: "شاشة iPhone 13",
      category: "قطع غيار",
      price: 450,
      quantity: 15,
      status: "available",
    },
    {
      id: "S002",
      name: "بطارية Samsung S21",
      category: "قطع غيار",
      price: 120,
      quantity: 8,
      status: "available",
    },
    {
      id: "S003",
      name: "واقي شاشة زجاجي",
      category: "اكسسوارات",
      price: 30,
      quantity: 50,
      status: "available",
    },
    {
      id: "S004",
      name: "كفر حماية iPhone 13",
      category: "اكسسوارات",
      price: 45,
      quantity: 25,
      status: "available",
    },
    {
      id: "S005",
      name: "شاحن سريع 20W",
      category: "اكسسوارات",
      price: 75,
      quantity: 3,
      status: "low-stock",
    },
    {
      id: "S006",
      name: "سماعة بلوتوث",
      category: "اكسسوارات",
      price: 120,
      quantity: 0,
      status: "out-of-stock",
    },
  ],
  onAddItem = () => {},
  onEditItem = () => {},
  onDeleteItem = () => {},
}: SalesManagementProps) => {
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<SalesItem>>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
  });
  const [salesData, setSalesData] = useState({
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
  });

  // Filter items based on search term and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter dropdown
  const categories = ["all", ...new Set(items.map((item) => item.category))];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">متوفر</Badge>;
      case "low-stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">مخزون منخفض</Badge>
        );
      case "out-of-stock":
        return <Badge variant="destructive">نفذ من المخزون</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle add new item
  const handleAddItem = () => {
    onAddItem({
      ...newItem,
      status:
        newItem.quantity === 0
          ? "out-of-stock"
          : newItem.quantity && newItem.quantity < 5
            ? "low-stock"
            : "available",
    });
    setNewItem({
      name: "",
      category: "",
      price: 0,
      quantity: 0,
    });
    setIsAddItemDialogOpen(false);
  };

  // Update dashboard when sales data changes
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sales-update", { detail: salesData }),
    );
  }, [salesData]);

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المبيعات</h1>
            <p className="text-gray-500 mt-1">
              إدارة المنتجات والمبيعات بكفاءة
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="products"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  <span>المنتجات</span>
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>المبيعات</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>التقارير</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>قائمة المنتجات</CardTitle>
                      <Button onClick={() => setIsAddItemDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة منتج
                      </Button>
                    </div>
                    <CardDescription>
                      إدارة المنتجات وقطع الغيار المتوفرة للبيع
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="بحث عن منتج..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={categoryFilter}
                          onValueChange={setCategoryFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="تصنيف المنتج" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category === "all"
                                  ? "جميع التصنيفات"
                                  : category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="حالة المنتج" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الحالات</SelectItem>
                            <SelectItem value="available">متوفر</SelectItem>
                            <SelectItem value="low-stock">
                              مخزون منخفض
                            </SelectItem>
                            <SelectItem value="out-of-stock">
                              نفذ من المخزون
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>اسم المنتج</TableHead>
                            <TableHead>التصنيف</TableHead>
                            <TableHead>السعر</TableHead>
                            <TableHead>الكمية</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead className="text-right">
                              الإجراءات
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  {item.name}
                                </TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                  {formatCurrency(item.price)}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  {getStatusBadge(item.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          فتح القائمة
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onEditItem(item.id, item)
                                        }
                                      >
                                        تعديل
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => onDeleteItem(item.id)}
                                        className="text-red-600"
                                      >
                                        حذف
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-center py-8"
                              >
                                لا توجد منتجات مطابقة للبحث
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {isAddItemDialogOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-auto">
                      <CardHeader>
                        <CardTitle>إضافة منتج جديد</CardTitle>
                        <CardDescription>
                          أدخل بيانات المنتج الجديد
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">اسم المنتج</Label>
                            <Input
                              id="name"
                              placeholder="أدخل اسم المنتج"
                              value={newItem.name}
                              onChange={(e) =>
                                setNewItem({ ...newItem, name: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">التصنيف</Label>
                            <Input
                              id="category"
                              placeholder="أدخل تصنيف المنتج"
                              value={newItem.category}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  category: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="price">السعر</Label>
                              <Input
                                id="price"
                                type="number"
                                placeholder="0"
                                value={newItem.price}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    price: parseFloat(e.target.value) || 0,
                                  })
                                }
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="quantity">الكمية</Label>
                              <Input
                                id="quantity"
                                type="number"
                                placeholder="0"
                                value={newItem.quantity}
                                onChange={(e) =>
                                  setNewItem({
                                    ...newItem,
                                    quantity: parseInt(e.target.value) || 0,
                                  })
                                }
                                required
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <div className="flex justify-end gap-2 p-6 pt-0">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddItemDialogOpen(false)}
                        >
                          إلغاء
                        </Button>
                        <Button onClick={handleAddItem}>إضافة</Button>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sales" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>المبيعات الحالية</CardTitle>
                    <CardDescription>
                      عرض وإدارة المبيعات الحالية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="بحث في سجل المبيعات..."
                          className="pl-8 pr-4"
                        />
                      </div>
                      <Select defaultValue="today">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="الفترة الزمنية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">اليوم</SelectItem>
                          <SelectItem value="week">هذا الأسبوع</SelectItem>
                          <SelectItem value="month">هذا الشهر</SelectItem>
                          <SelectItem value="year">هذا العام</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              رقم المبيعة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              الوقت
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              الوصف
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              المبلغ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {salesData.recentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(transaction.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-blue-800">
                            إجمالي المبيعات اليومية
                          </h3>
                          <p className="text-sm text-blue-600">
                            إجمالي المبيعات لليوم الحالي
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatCurrency(salesData.dailyTotal)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>تقارير المبيعات</CardTitle>
                    <CardDescription>
                      تحليل وعرض تقارير المبيعات
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            إجمالي المبيعات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12,450 ر.س</div>
                          <p className="text-xs text-green-600 mt-1">
                            ↑ 15% من الشهر السابق
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            عدد المبيعات
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">48</div>
                          <p className="text-xs text-green-600 mt-1">
                            ↑ 8% من الشهر السابق
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            متوسط قيمة البيع
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">259 ر.س</div>
                          <p className="text-xs text-green-600 mt-1">
                            ↑ 5% من الشهر السابق
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            المبيعات حسب الفئة
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span>قطع غيار</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "65%" }}
                                ></div>
                              </div>
                              <span className="text-sm">65%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>اكسسوارات</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "35%" }}
                                ></div>
                              </div>
                              <span className="text-sm">35%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            المنتجات الأكثر مبيعاً
                          </CardTitle>
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
                              <span>واقي شاشة زجاجي</span>
                              <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: "55%" }}
                                ></div>
                              </div>
                              <span className="text-sm">55%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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

export default SalesManagement;
