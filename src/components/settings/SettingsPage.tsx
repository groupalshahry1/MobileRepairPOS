import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  User,
  Shield,
  Database,
  Bell,
  Printer,
  Save,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackupSettings from "./BackupSettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("backup");
  const [formState, setFormState] = useState({
    darkMode: false,
    language: "ar",
    currency: "iqd",
    shopName: "وكالة الموبايل",
    shopPhone: "07XXXXXXXXX",
    shopAddress: "بغداد - شارع الرشيد",
    fullName: "أحمد محمد",
    username: "admin",
    email: "admin@example.com",
    phone: "07XXXXXXXXX",
    bio: "مدير متجر وكالة الموبايل",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    googleAuth: false,
    smsAuth: true,
    notifications: {
      lowStock: true,
      outOfStock: true,
      newRepairs: true,
      completedRepairs: true,
      newSales: false,
      dailySalesReport: true,
      inApp: true,
      email: true,
      whatsapp: false,
    },
    printing: {
      printer: "default",
      paperSize: "a4",
      autoPrint: true,
      companyName: "وكالة الموبايل",
      companyAddress: "بغداد - شارع الرشيد",
      companyPhone: "07XXXXXXXXX",
    },
  });

  const handleBackupCreated = (location: string, path: string) => {
    console.log(`تم إنشاء نسخة احتياطية في ${location}: ${path}`);
    alert(`تم إنشاء نسخة احتياطية في ${location}: ${path}`);
  };

  const handleBackupRestored = (success: boolean) => {
    if (success) {
      console.log("تم استعادة النسخة الاحتياطية بنجاح");
      alert("تم استعادة النسخة الاحتياطية بنجاح");
    } else {
      console.error("فشل في استعادة النسخة الاحتياطية");
      alert("فشل في استعادة النسخة الاحتياطية");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = () => {
    alert("تم حفظ التغييرات بنجاح");
    console.log("تم حفظ الإعدادات:", formState);
  };

  const handleCancel = () => {
    alert("تم إلغاء التغييرات");
  };

  const handleEndSession = () => {
    alert("تم إنهاء الجلسة بنجاح");
  };

  const handlePreviewTemplate = () => {
    alert("جاري معاينة القالب");
  };

  const handleEditTemplate = () => {
    alert("جاري فتح محرر القالب");
  };

  const handleSetDefaultTemplate = () => {
    alert("تم تعيين القالب كافتراضي");
  };

  const handleAddTemplate = () => {
    alert("جاري فتح محرر إنشاء قالب جديد");
  };

  const handleChangeLogo = () => {
    alert("جاري فتح مربع حوار اختيار الشعار");
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
            <p className="text-gray-500 mt-1">
              إدارة إعدادات التطبيق والنسخ الاحتياطي
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <TabsList className="flex flex-col w-full h-auto">
                    <TabsTrigger
                      value="general"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("general")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      <span>إعدادات عامة</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="profile"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>الملف الشخصي</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      <span>الأمان</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="backup"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("backup")}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span>النسخ الاحتياطي</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      <span>الإشعارات</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="printing"
                      className="w-full justify-start px-3 py-2 h-10"
                      onClick={() => setActiveTab("printing")}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      <span>الطباعة</span>
                    </TabsTrigger>
                  </TabsList>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {activeTab === "backup" && (
              <BackupSettings
                onBackupCreated={handleBackupCreated}
                onBackupRestored={handleBackupRestored}
              />
            )}

            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات العامة</CardTitle>
                  <CardDescription>
                    إدارة الإعدادات العامة للتطبيق
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">إعدادات العرض</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>الوضع الداكن</span>
                            <div className="flex items-center space-x-2">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={formState.darkMode}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "darkMode",
                                      e.target.checked,
                                    )
                                  }
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>اللغة</span>
                            <select
                              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.language}
                              onChange={(e) =>
                                handleInputChange("language", e.target.value)
                              }
                            >
                              <option value="ar">العربية</option>
                              <option value="en">English</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>العملة</span>
                            <select
                              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.currency}
                              onChange={(e) =>
                                handleInputChange("currency", e.target.value)
                              }
                            >
                              <option value="iqd">دينار عراقي</option>
                              <option value="usd">دولار أمريكي</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">إعدادات المتجر</h3>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-2">
                            <label htmlFor="shopName">اسم المتجر</label>
                            <input
                              id="shopName"
                              type="text"
                              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.shopName}
                              onChange={(e) =>
                                handleInputChange("shopName", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label htmlFor="shopPhone">رقم الهاتف</label>
                            <input
                              id="shopPhone"
                              type="text"
                              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.shopPhone}
                              onChange={(e) =>
                                handleInputChange("shopPhone", e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label htmlFor="shopAddress">العنوان</label>
                            <input
                              id="shopAddress"
                              type="text"
                              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.shopAddress}
                              onChange={(e) =>
                                handleInputChange("shopAddress", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveChanges}>حفظ الإعدادات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>إدارة معلومات الملف الشخصي</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                            alt="صورة الملف الشخصي"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleChangeLogo}
                        >
                          تغيير الصورة
                        </Button>
                      </div>

                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="fullName"
                              className="text-sm font-medium"
                            >
                              الاسم الكامل
                            </label>
                            <input
                              id="fullName"
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.fullName}
                              onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="username"
                              className="text-sm font-medium"
                            >
                              اسم المستخدم
                            </label>
                            <input
                              id="username"
                              type="text"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.username}
                              onChange={(e) =>
                                handleInputChange("username", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
                              البريد الإلكتروني
                            </label>
                            <input
                              id="email"
                              type="email"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="phone"
                              className="text-sm font-medium"
                            >
                              رقم الهاتف
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                              value={formState.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="bio" className="text-sm font-medium">
                            نبذة تعريفية
                          </label>
                          <textarea
                            id="bio"
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.bio}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الأمان</CardTitle>
                  <CardDescription>
                    إدارة إعدادات الأمان وكلمات المرور
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="currentPassword"
                            className="text-sm font-medium"
                          >
                            كلمة المرور الحالية
                          </label>
                          <input
                            id="currentPassword"
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.currentPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "currentPassword",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="newPassword"
                            className="text-sm font-medium"
                          >
                            كلمة المرور الجديدة
                          </label>
                          <input
                            id="newPassword"
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.newPassword}
                            onChange={(e) =>
                              handleInputChange("newPassword", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium"
                          >
                            تأكيد كلمة المرور الجديدة
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">المصادقة الثنائية</h3>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">
                            المصادقة الثنائية عبر تطبيق Google Authenticator
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            تأمين حسابك باستخدام رمز إضافي عند تسجيل الدخول
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={formState.googleAuth}
                              onChange={(e) =>
                                handleInputChange(
                                  "googleAuth",
                                  e.target.checked,
                                )
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">
                            المصادقة عبر رسائل SMS
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            استلام رمز التحقق عبر رسالة نصية على هاتفك
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={formState.smsAuth}
                              onChange={(e) =>
                                handleInputChange("smsAuth", e.target.checked)
                              }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        جلسات تسجيل الدخول
                      </h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                الجهاز
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                الموقع
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                آخر نشاط
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                الإجراء
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Windows 10 - Chrome
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                بغداد، العراق
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                الآن
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                الجلسة الحالية
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                iPhone - Safari
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                بغداد، العراق
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                منذ 2 ساعة
                              </td>
                              <td
                                className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={handleEndSession}
                              >
                                إنهاء الجلسة
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>
                    إدارة إعدادات الإشعارات والتنبيهات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">إشعارات المخزون</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              تنبيهات المخزون المنخفض
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار عند انخفاض المخزون عن الحد الأدنى
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.lowStock}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "lowStock",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              تنبيهات نفاد المخزون
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار عند نفاد أي منتج من المخزون
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.outOfStock}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "outOfStock",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">إشعارات الصيانة</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              طلبات الصيانة الجديدة
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار عند استلام طلب صيانة جديد
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.newRepairs}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "newRepairs",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">اكتمال الصيانة</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار عند اكتمال عملية صيانة
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={
                                  formState.notifications.completedRepairs
                                }
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "completedRepairs",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">إشعارات المبيعات</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">المبيعات الجديدة</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار عند تسجيل عملية بيع جديدة
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.newSales}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "newSales",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              تقارير المبيعات اليومية
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إشعار يومي بملخص المبيعات
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={
                                  formState.notifications.dailySalesReport
                                }
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "dailySalesReport",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">طرق الإشعار</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              إشعارات داخل التطبيق
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              عرض الإشعارات داخل التطبيق
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.inApp}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "inApp",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              إشعارات البريد الإلكتروني
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إرسال الإشعارات عبر البريد الإلكتروني
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.email}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "email",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">إشعارات الواتساب</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              إرسال الإشعارات عبر الواتساب
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.notifications.whatsapp}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "notifications",
                                    "whatsapp",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "printing" && (
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الطباعة</CardTitle>
                  <CardDescription>
                    إدارة إعدادات الطباعة والقوالب
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">إعدادات الطابعة</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="printerName"
                            className="text-sm font-medium"
                          >
                            اسم الطابعة
                          </label>
                          <select
                            id="printerName"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.printing.printer}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "printing",
                                "printer",
                                e.target.value,
                              )
                            }
                          >
                            <option value="default">الطابعة الافتراضية</option>
                            <option value="thermal">
                              طابعة الإيصالات الحرارية
                            </option>
                            <option value="laser">طابعة ليزر HP</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="paperSize"
                            className="text-sm font-medium"
                          >
                            حجم الورق
                          </label>
                          <select
                            id="paperSize"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.printing.paperSize}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "printing",
                                "paperSize",
                                e.target.value,
                              )
                            }
                          >
                            <option value="a4">A4</option>
                            <option value="a5">A5</option>
                            <option value="receipt">إيصال (80mm)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">
                              طباعة تلقائية للفواتير
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              طباعة الفواتير تلقائياً عند إنشائها
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formState.printing.autoPrint}
                                onChange={(e) =>
                                  handleNestedInputChange(
                                    "printing",
                                    "autoPrint",
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">قوالب الطباعة</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                قالب الفاتورة الأساسي
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                القالب الافتراضي للفواتير
                              </p>
                            </div>
                            <Badge>افتراضي</Badge>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePreviewTemplate}
                            >
                              معاينة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditTemplate}
                            >
                              تعديل
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                قالب إيصال الصيانة
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                قالب خاص بإيصالات الصيانة
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePreviewTemplate}
                            >
                              معاينة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditTemplate}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSetDefaultTemplate}
                            >
                              تعيين كافتراضي
                            </Button>
                          </div>
                        </div>
                        <div className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">قالب ضمان المنتج</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                قالب شهادة ضمان المنتج
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePreviewTemplate}
                            >
                              معاينة
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditTemplate}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSetDefaultTemplate}
                            >
                              تعيين كافتراضي
                            </Button>
                          </div>
                        </div>
                        <div
                          className="border rounded-md p-4 border-dashed flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          onClick={handleAddTemplate}
                        >
                          <div className="text-center">
                            <Plus className="h-8 w-8 mx-auto text-gray-400" />
                            <p className="mt-2 text-sm font-medium">
                              إضافة قالب جديد
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        معلومات الشركة في المطبوعات
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="companyName"
                            className="text-sm font-medium"
                          >
                            اسم الشركة
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.printing.companyName}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "printing",
                                "companyName",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="companyAddress"
                            className="text-sm font-medium"
                          >
                            العنوان
                          </label>
                          <input
                            id="companyAddress"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.printing.companyAddress}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "printing",
                                "companyAddress",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="companyPhone"
                            className="text-sm font-medium"
                          >
                            رقم الهاتف
                          </label>
                          <input
                            id="companyPhone"
                            type="text"
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formState.printing.companyPhone}
                            onChange={(e) =>
                              handleNestedInputChange(
                                "printing",
                                "companyPhone",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor="companyLogo"
                            className="text-sm font-medium"
                          >
                            شعار الشركة
                          </label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden">
                              <img
                                src="/vite.svg"
                                alt="شعار الشركة"
                                className="w-12 h-12"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleChangeLogo}
                            >
                              تغيير الشعار
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
