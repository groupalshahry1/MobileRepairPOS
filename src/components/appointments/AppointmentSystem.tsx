import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CalendarDays,
  Clock,
  User,
  Phone,
  Wrench,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  timeSlot: string;
  serviceType: string;
  deviceType: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
}

interface AppointmentSystemProps {
  appointments?: Appointment[];
  onAddAppointment?: (appointment: Appointment) => void;
  onCancelAppointment?: (id: string) => void;
  onCompleteAppointment?: (id: string) => void;
}

const AppointmentSystem = ({
  appointments = [
    {
      id: "A001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      date: new Date(2023, 5, 20, 10, 0),
      timeSlot: "10:00 AM",
      serviceType: "صيانة",
      deviceType: "iPhone 13",
      notes: "شاشة مكسورة",
      status: "scheduled",
    },
    {
      id: "A002",
      customerName: "سارة عبدالله",
      customerPhone: "0559876543",
      date: new Date(2023, 5, 20, 14, 30),
      timeSlot: "2:30 PM",
      serviceType: "فحص",
      deviceType: "Samsung Galaxy S22",
      notes: "بطارية لا تشحن",
      status: "scheduled",
    },
    {
      id: "A003",
      customerName: "خالد العمري",
      customerPhone: "0561122334",
      date: new Date(2023, 5, 19, 11, 0),
      timeSlot: "11:00 AM",
      serviceType: "صيانة",
      deviceType: "Xiaomi Redmi Note 11",
      notes: "مشكلة في السماعة",
      status: "completed",
    },
  ],
  onAddAppointment = () => {},
  onCancelAppointment = () => {},
  onCompleteAppointment = () => {},
}: AppointmentSystemProps) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [newAppointment, setNewAppointment] = useState({
    customerName: "",
    customerPhone: "",
    date: new Date(),
    timeSlot: "",
    serviceType: "",
    deviceType: "",
    notes: "",
  });

  // Available time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  // Service types
  const serviceTypes = [
    "صيانة",
    "فحص",
    "استشارة",
    "شراء قطع غيار",
    "استلام جهاز",
  ];

  // Filter appointments for selected date
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return appointments.filter(
      (appointment) =>
        appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear(),
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">مجدول</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">مكتمل</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
      case "no-show":
        return (
          <Badge variant="outline" className="border-red-200 text-red-800">
            لم يحضر
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create new appointment object
    const appointment = {
      id: `A${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...newAppointment,
      status: "scheduled" as const,
    };
    onAddAppointment(appointment);
    // Reset form
    setNewAppointment({
      customerName: "",
      customerPhone: "",
      date: new Date(),
      timeSlot: "",
      serviceType: "",
      deviceType: "",
      notes: "",
    });
    // Switch to calendar view
    setActiveTab("calendar");
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">نظام المواعيد</h1>
            <p className="text-gray-500 mt-1">
              إدارة مواعيد الصيانة والاستشارات
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="calendar"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>التقويم</span>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>موعد جديد</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>قائمة المواعيد</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>التقويم</CardTitle>
                      <CardDescription>
                        اختر تاريخ لعرض المواعيد
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border mx-auto"
                      />
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>
                        مواعيد {selectedDate?.toLocaleDateString("ar-SA")}
                      </CardTitle>
                      <CardDescription>
                        {getAppointmentsForDate(selectedDate).length > 0
                          ? `${getAppointmentsForDate(selectedDate).length} مواعيد مجدولة`
                          : "لا توجد مواعيد لهذا اليوم"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getAppointmentsForDate(selectedDate).length > 0 ? (
                          getAppointmentsForDate(selectedDate).map(
                            (appointment) => (
                              <Card key={appointment.id} className="border">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="font-medium">
                                          {appointment.timeSlot}
                                        </span>
                                        <span className="mx-2">•</span>
                                        {getStatusBadge(appointment.status)}
                                      </div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>{appointment.customerName}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{appointment.customerPhone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Wrench className="h-4 w-4 text-gray-500" />
                                        <span>
                                          {appointment.serviceType} -{" "}
                                          {appointment.deviceType}
                                        </span>
                                      </div>
                                      {appointment.notes && (
                                        <p className="text-sm text-gray-500 mt-2">
                                          {appointment.notes}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {appointment.status === "scheduled" && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8"
                                            onClick={() =>
                                              onCompleteAppointment(
                                                appointment.id,
                                              )
                                            }
                                          >
                                            تم الحضور
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() =>
                                              onCancelAppointment(
                                                appointment.id,
                                              )
                                            }
                                          >
                                            إلغاء
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ),
                          )
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p>لا توجد مواعيد مجدولة لهذا اليوم</p>
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={() => setActiveTab("new")}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              إضافة موعد جديد
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>حجز موعد جديد</CardTitle>
                    <CardDescription>أدخل بيانات الموعد الجديد</CardDescription>
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
                              value={newAppointment.customerName}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
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
                              value={newAppointment.customerPhone}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  customerPhone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="deviceType">نوع الجهاز</Label>
                            <Input
                              id="deviceType"
                              placeholder="مثال: iPhone 13 Pro"
                              value={newAppointment.deviceType}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
                                  deviceType: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="appointmentDate">
                              تاريخ الموعد
                            </Label>
                            <div className="border rounded-md p-2">
                              <Calendar
                                mode="single"
                                selected={newAppointment.date}
                                onSelect={(date) =>
                                  setNewAppointment({
                                    ...newAppointment,
                                    date: date || new Date(),
                                  })
                                }
                                className="mx-auto"
                                disabled={(date) =>
                                  date <
                                  new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="timeSlot">وقت الموعد</Label>
                              <Select
                                value={newAppointment.timeSlot}
                                onValueChange={(value) =>
                                  setNewAppointment({
                                    ...newAppointment,
                                    timeSlot: value,
                                  })
                                }
                                required
                              >
                                <SelectTrigger id="timeSlot">
                                  <SelectValue placeholder="اختر الوقت" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                      {slot}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="serviceType">نوع الخدمة</Label>
                              <Select
                                value={newAppointment.serviceType}
                                onValueChange={(value) =>
                                  setNewAppointment({
                                    ...newAppointment,
                                    serviceType: value,
                                  })
                                }
                                required
                              >
                                <SelectTrigger id="serviceType">
                                  <SelectValue placeholder="اختر الخدمة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {serviceTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">ملاحظات</Label>
                            <Input
                              id="notes"
                              placeholder="أي ملاحظات إضافية"
                              value={newAppointment.notes}
                              onChange={(e) =>
                                setNewAppointment({
                                  ...newAppointment,
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
                          onClick={() => setActiveTab("calendar")}
                        >
                          إلغاء
                        </Button>
                        <Button type="submit">حجز الموعد</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>قائمة المواعيد</CardTitle>
                    <CardDescription>
                      جميع المواعيد المجدولة القادمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.length > 0 ? (
                        appointments
                          .sort((a, b) => a.date.getTime() - b.date.getTime())
                          .map((appointment) => (
                            <Card key={appointment.id} className="border">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <CalendarDays className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        {appointment.date.toLocaleDateString(
                                          "ar-SA",
                                        )}
                                      </span>
                                      <span className="mx-1">-</span>
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="font-medium">
                                        {appointment.timeSlot}
                                      </span>
                                      <span className="mx-2">•</span>
                                      {getStatusBadge(appointment.status)}
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span>{appointment.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span>{appointment.customerPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Wrench className="h-4 w-4 text-gray-500" />
                                      <span>
                                        {appointment.serviceType} -{" "}
                                        {appointment.deviceType}
                                      </span>
                                    </div>
                                    {appointment.notes && (
                                      <p className="text-sm text-gray-500 mt-2">
                                        {appointment.notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    {appointment.status === "scheduled" && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8"
                                          onClick={() =>
                                            onCompleteAppointment(
                                              appointment.id,
                                            )
                                          }
                                        >
                                          تم الحضور
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                                          onClick={() =>
                                            onCancelAppointment(appointment.id)
                                          }
                                        >
                                          إلغاء
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p>لا توجد مواعيد مجدولة</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setActiveTab("new")}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة موعد جديد
                          </Button>
                        </div>
                      )}
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

export default AppointmentSystem;
