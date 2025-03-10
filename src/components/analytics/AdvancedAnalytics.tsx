import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  Calendar,
} from "lucide-react";
import { exportReportToPdf } from "@/utils/pdfExport";

// Sample data for charts
const salesData = [
  { month: "يناير", sales: 4000, repairs: 2400 },
  { month: "فبراير", sales: 3000, repairs: 1398 },
  { month: "مارس", sales: 2000, repairs: 9800 },
  { month: "أبريل", sales: 2780, repairs: 3908 },
  { month: "مايو", sales: 1890, repairs: 4800 },
  { month: "يونيو", sales: 2390, repairs: 3800 },
  { month: "يوليو", sales: 3490, repairs: 4300 },
];

const deviceTypeData = [
  { name: "iPhone", value: 400 },
  { name: "Samsung", value: 300 },
  { name: "Xiaomi", value: 200 },
  { name: "Huawei", value: 150 },
  { name: "Other", value: 100 },
];

const repairTypeData = [
  { name: "شاشة", value: 35 },
  { name: "بطارية", value: 25 },
  { name: "منفذ شحن", value: 15 },
  { name: "كاميرا", value: 10 },
  { name: "سماعة", value: 8 },
  { name: "أخرى", value: 7 },
];

const inventoryTurnoverData = [
  { name: "شاشات", turnover: 4.5 },
  { name: "بطاريات", turnover: 6.2 },
  { name: "منافذ شحن", turnover: 3.8 },
  { name: "كاميرات", turnover: 2.5 },
  { name: "سماعات", turnover: 3.2 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface AdvancedAnalyticsProps {}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              التحليلات المتقدمة
            </h1>
            <p className="text-gray-500 mt-1">
              تحليلات وإحصائيات متقدمة لمساعدتك في اتخاذ القرارات
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">آخر أسبوع</SelectItem>
                <SelectItem value="month">آخر شهر</SelectItem>
                <SelectItem value="quarter">آخر ربع سنة</SelectItem>
                <SelectItem value="year">آخر سنة</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => exportReportToPdf({ timeRange, salesData })}
            >
              <Download className="h-4 w-4 mr-2" />
              تصدير التقرير PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي المبيعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(42500)}</div>
              <p className="text-xs text-green-600 mt-1">
                ↑ 12% من الفترة السابقة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي الصيانة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(28750)}</div>
              <p className="text-xs text-green-600 mt-1">
                ↑ 8% من الفترة السابقة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                عدد طلبات الصيانة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187</div>
              <p className="text-xs text-green-600 mt-1">
                ↑ 15% من الفترة السابقة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                متوسط قيمة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(380)}</div>
              <p className="text-xs text-red-600 mt-1">
                ↓ 3% من الفترة السابقة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs
          defaultValue="sales"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>المبيعات والصيانة</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>أنواع الأجهزة</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span>المخزون</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل المبيعات والصيانة</CardTitle>
                <CardDescription>
                  مقارنة بين إيرادات المبيعات والصيانة خلال الفترة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="المبيعات" fill="#8884d8" />
                      <Bar dataKey="repairs" name="الصيانة" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        تحليل المبيعات حسب الوقت
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) =>
                                formatCurrency(value as number)
                              }
                            />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              name="المبيعات"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        تحليل الصيانة حسب الوقت
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) =>
                                formatCurrency(value as number)
                              }
                            />
                            <Line
                              type="monotone"
                              dataKey="repairs"
                              name="الصيانة"
                              stroke="#82ca9d"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل أنواع الأجهزة والإصلاحات</CardTitle>
                <CardDescription>
                  توزيع الأجهزة وأنواع الإصلاحات الأكثر شيوعاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-center">
                      توزيع أنواع الأجهزة
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {deviceTypeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value} جهاز`, "العدد"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4 text-center">
                      توزيع أنواع الإصلاحات
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={repairTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {repairTypeData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "النسبة"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليل المخزون</CardTitle>
                <CardDescription>
                  معدل دوران المخزون وتحليل المنتجات الأكثر مبيعاً
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
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={inventoryTurnoverData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [
                                `${value} مرات`,
                                "معدل الدوران",
                              ]}
                            />
                            <Bar
                              dataKey="turnover"
                              name="معدل الدوران"
                              fill="#8884d8"
                            />
                          </BarChart>
                        </ResponsiveContainer>
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
                        <div className="flex justify-between items-center">
                          <span>كاميرا iPhone 12</span>
                          <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: "55%" }}
                            ></div>
                          </div>
                          <span className="text-sm">55%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>سماعة Huawei P40</span>
                          <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: "40%" }}
                            ></div>
                          </div>
                          <span className="text-sm">40%</span>
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
  );
};

export default AdvancedAnalytics;
