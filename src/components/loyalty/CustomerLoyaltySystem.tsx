import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Award, Star, Users, Trophy, Plus } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: "عادي" | "فضي" | "ذهبي" | "ماسي";
  joinDate: string;
  lastVisit: string;
  totalSpent: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  isAvailable: boolean;
}

interface CustomerLoyaltySystemProps {
  customers?: Customer[];
  rewards?: Reward[];
}

const CustomerLoyaltySystem = ({
  customers = [
    {
      id: "C001",
      name: "أحمد محمد",
      phone: "0501234567",
      points: 450,
      tier: "ذهبي",
      joinDate: "2023-01-15",
      lastVisit: "2023-06-10",
      totalSpent: 3200,
    },
    {
      id: "C002",
      name: "سارة عبدالله",
      phone: "0559876543",
      points: 180,
      tier: "فضي",
      joinDate: "2023-02-20",
      lastVisit: "2023-06-05",
      totalSpent: 1500,
    },
    {
      id: "C003",
      name: "خالد العمري",
      phone: "0561122334",
      points: 750,
      tier: "ماسي",
      joinDate: "2022-11-10",
      lastVisit: "2023-06-12",
      totalSpent: 5800,
    },
    {
      id: "C004",
      name: "نورة السالم",
      phone: "0577889900",
      points: 90,
      tier: "عادي",
      joinDate: "2023-04-05",
      lastVisit: "2023-05-28",
      totalSpent: 800,
    },
  ],
  rewards = [
    {
      id: "R001",
      name: "خصم 10% على الصيانة القادمة",
      description: "خصم 10% على أي خدمة صيانة",
      pointsCost: 100,
      isAvailable: true,
    },
    {
      id: "R002",
      name: "واقي شاشة مجاني",
      description: "واقي شاشة مجاني لأي جهاز",
      pointsCost: 150,
      isAvailable: true,
    },
    {
      id: "R003",
      name: "خصم 20% على قطع الغيار",
      description: "خصم 20% على أي قطعة غيار",
      pointsCost: 300,
      isAvailable: true,
    },
    {
      id: "R004",
      name: "صيانة مجانية",
      description: "صيانة مجانية لمشكلة بسيطة",
      pointsCost: 500,
      isAvailable: true,
    },
  ],
}: CustomerLoyaltySystemProps) => {
  const [activeTab, setActiveTab] = useState("customers");

  // Get tier badge color
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "عادي":
        return <Badge variant="outline">عادي</Badge>;
      case "فضي":
        return <Badge className="bg-gray-200 text-gray-800">فضي</Badge>;
      case "ذهبي":
        return <Badge className="bg-yellow-100 text-yellow-800">ذهبي</Badge>;
      case "ماسي":
        return <Badge className="bg-blue-100 text-blue-800">ماسي</Badge>;
      default:
        return <Badge>{tier}</Badge>;
    }
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              نظام ولاء العملاء
            </h1>
            <p className="text-gray-500 mt-1">
              إدارة نقاط الولاء والمكافآت للعملاء
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="customers"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger
                  value="customers"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>العملاء</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="flex items-center gap-2"
                >
                  <Gift className="h-4 w-4" />
                  <span>المكافآت</span>
                </TabsTrigger>
                <TabsTrigger value="tiers" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>المستويات</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>قائمة العملاء المسجلين</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة عميل
                      </Button>
                    </div>
                    <CardDescription>
                      إدارة العملاء ونقاط الولاء الخاصة بهم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اسم العميل</TableHead>
                          <TableHead>رقم الهاتف</TableHead>
                          <TableHead>النقاط</TableHead>
                          <TableHead>المستوى</TableHead>
                          <TableHead>آخر زيارة</TableHead>
                          <TableHead>إجمالي الإنفاق</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                              {customer.name}
                            </TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>{customer.points}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getTierBadge(customer.tier)}</TableCell>
                            <TableCell>{customer.lastVisit}</TableCell>
                            <TableCell>
                              {formatCurrency(customer.totalSpent)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>المكافآت المتاحة</CardTitle>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة مكافأة
                      </Button>
                    </div>
                    <CardDescription>
                      إدارة المكافآت التي يمكن للعملاء استبدال نقاطهم بها
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rewards.map((reward) => (
                        <Card key={reward.id} className="border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {reward.name}
                            </CardTitle>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-bold">
                                {reward.pointsCost} نقطة
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">
                              {reward.description}
                            </p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled={!reward.isAvailable}
                            >
                              {reward.isAvailable
                                ? "تعديل المكافأة"
                                : "غير متاح حالياً"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tiers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>مستويات الولاء</CardTitle>
                    <CardDescription>
                      إدارة مستويات الولاء والمزايا المرتبطة بكل مستوى
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border">
                        <CardHeader className="pb-2 bg-gray-50">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-gray-600" />
                            المستوى العادي
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm mb-2">
                            <span className="font-bold">متطلبات:</span> 0-100
                            نقطة
                          </p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                            <li>نقطة واحدة لكل 10 ريال إنفاق</li>
                            <li>إشعارات بالعروض الخاصة</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="pb-2 bg-gray-100">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-gray-700" />
                            المستوى الفضي
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm mb-2">
                            <span className="font-bold">متطلبات:</span> 101-300
                            نقطة
                          </p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                            <li>نقطة واحدة لكل 8 ريال إنفاق</li>
                            <li>خصم 5% على قطع الغيار</li>
                            <li>أولوية في الصيانة</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="pb-2 bg-yellow-50">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-yellow-600" />
                            المستوى الذهبي
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm mb-2">
                            <span className="font-bold">متطلبات:</span> 301-600
                            نقطة
                          </p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                            <li>نقطة واحدة لكل 5 ريال إنفاق</li>
                            <li>خصم 10% على قطع الغيار</li>
                            <li>فحص مجاني للأجهزة</li>
                            <li>أولوية قصوى في الصيانة</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border">
                        <CardHeader className="pb-2 bg-blue-50">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-blue-600" />
                            المستوى الماسي
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm mb-2">
                            <span className="font-bold">متطلبات:</span> 601+
                            نقطة
                          </p>
                          <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
                            <li>نقطة واحدة لكل 3 ريال إنفاق</li>
                            <li>خصم 15% على قطع الغيار</li>
                            <li>صيانة بسيطة مجانية شهرياً</li>
                            <li>خدمة الاستلام والتوصيل</li>
                            <li>مدير حساب خاص</li>
                          </ul>
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

export default CustomerLoyaltySystem;
