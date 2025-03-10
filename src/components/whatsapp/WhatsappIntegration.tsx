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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Send,
  Users,
  History,
  Settings,
  Plus,
  Check,
  Copy,
  Phone,
} from "lucide-react";
import { ItemTypeSelector } from "@/components/ui/item-type-selector";

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: "repair" | "sales" | "notification" | "marketing";
}

interface MessageHistory {
  id: string;
  customerName: string;
  customerPhone: string;
  message: string;
  timestamp: string;
  status: "sent" | "delivered" | "read" | "failed";
  type: "repair" | "sales" | "notification" | "marketing";
}

interface WhatsappIntegrationProps {
  templates?: Template[];
  messageHistory?: MessageHistory[];
  onSendMessage?: (message: {
    phone: string;
    content: string;
    templateId?: string;
  }) => void;
  onCreateTemplate?: (template: Omit<Template, "id">) => void;
}

const WhatsappIntegration = ({
  templates = [
    {
      id: "T001",
      name: "إشعار استلام جهاز",
      content:
        "مرحباً {{customerName}}، تم استلام جهازك {{deviceType}} للصيانة. رقم الطلب: {{orderNumber}}. سنتواصل معك فور الانتهاء من الصيانة.",
      variables: ["customerName", "deviceType", "orderNumber"],
      category: "repair",
    },
    {
      id: "T002",
      name: "إشعار اكتمال الصيانة",
      content:
        "مرحباً {{customerName}}، تم الانتهاء من صيانة جهازك {{deviceType}}. يمكنك استلامه من المحل. رقم الطلب: {{orderNumber}}.",
      variables: ["customerName", "deviceType", "orderNumber"],
      category: "repair",
    },
    {
      id: "T003",
      name: "تأكيد طلب قطع غيار",
      content:
        "مرحباً {{customerName}}، نود إعلامك بأن طلبك رقم {{orderNumber}} للحصول على {{partName}} قد تم تأكيده وسيتم إشعارك عند توفره.",
      variables: ["customerName", "orderNumber", "partName"],
      category: "sales",
    },
    {
      id: "T004",
      name: "عرض خاص",
      content:
        "عميلنا العزيز {{customerName}}، نقدم لك عرض خاص على {{productName}} بخصم {{discountPercentage}}% لفترة محدودة. زورنا اليوم للاستفادة من العرض!",
      variables: ["customerName", "productName", "discountPercentage"],
      category: "marketing",
    },
  ],
  messageHistory = [
    {
      id: "M001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      message:
        "مرحباً أحمد، تم استلام جهازك iPhone 13 للصيانة. رقم الطلب: REP-001. سنتواصل معك فور الانتهاء من الصيانة.",
      timestamp: "2023-06-15 10:30",
      status: "read",
      type: "repair",
    },
    {
      id: "M002",
      customerName: "سارة عبدالله",
      customerPhone: "0559876543",
      message:
        "مرحباً سارة، تم الانتهاء من صيانة جهازك Samsung Galaxy S22. يمكنك استلامه من المحل. رقم الطلب: REP-002.",
      timestamp: "2023-06-14 15:45",
      status: "delivered",
      type: "repair",
    },
    {
      id: "M003",
      customerName: "خالد العمري",
      customerPhone: "0561122334",
      message:
        "عميلنا العزيز خالد، نقدم لك عرض خاص على شاشات الحماية بخصم 20% لفترة محدودة. زورنا اليوم للاستفادة من العرض!",
      timestamp: "2023-06-13 12:15",
      status: "sent",
      type: "marketing",
    },
  ],
  onSendMessage = () => {},
  onCreateTemplate = () => {},
}: WhatsappIntegrationProps) => {
  const [activeTab, setActiveTab] = useState("send");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [templateVariables, setTemplateVariables] = useState<
    Record<string, string>
  >({});
  const [messageType, setMessageType] = useState<string>("both");
  const [newTemplate, setNewTemplate] = useState<Omit<Template, "id">>({
    name: "",
    content: "",
    variables: [],
    category: "notification",
  });

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessageContent(template.content);
      // Initialize template variables
      const variables: Record<string, string> = {};
      template.variables.forEach((variable) => {
        variables[variable] = "";
      });
      setTemplateVariables(variables);
    }
  };

  // Handle variable change
  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables({
      ...templateVariables,
      [variable]: value,
    });

    // Update message content with variable values
    let updatedContent =
      templates.find((t) => t.id === selectedTemplate)?.content || "";
    Object.entries({ ...templateVariables, [variable]: value }).forEach(
      ([key, val]) => {
        updatedContent = updatedContent.replace(
          new RegExp(`\{\{${key}\}\}`, "g"),
          val,
        );
      },
    );
    setMessageContent(updatedContent);
  };

  // Filter templates by category for the dropdown
  const getTemplatesByCategory = (category: Template["category"]) => {
    return templates.filter((template) => template.category === category);
  };

  // Filter templates by type (repair, sales, or both)
  const getTemplatesByType = () => {
    if (messageType === "both") {
      return templates;
    }
    return templates.filter((template) => template.category === messageType);
  };

  // Get all templates for the dropdown
  const getAllTemplates = () => {
    return templates;
  };

  // Handle send message
  const handleSendMessage = () => {
    // Replace variables in the message content
    let finalContent = messageContent;
    Object.entries(templateVariables).forEach(([key, value]) => {
      finalContent = finalContent.replace(
        new RegExp(`\{\{${key}\}\}`, "g"),
        value,
      );
    });

    onSendMessage({
      phone: customerPhone,
      content: finalContent,
      templateId: selectedTemplate,
    });

    // Reset form
    setMessageContent("");
    setCustomerPhone("");
    setSelectedTemplate("");
    setTemplateVariables({});
  };

  // Handle create template
  const handleCreateTemplate = () => {
    // Extract variables from content (format: {{variableName}})
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(newTemplate.content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    onCreateTemplate({
      ...newTemplate,
      variables,
    });

    // Reset form
    setNewTemplate({
      name: "",
      content: "",
      variables: [],
      category: "notification",
    });
  };

  // Message history component
  const MessageHistoryComponent = () => {
    return (
      <div className="space-y-4">
        {messageHistory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الرسالة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>النوع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messageHistory.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{message.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {message.customerPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {message.message}
                  </TableCell>
                  <TableCell>{message.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        message.status === "read"
                          ? "default"
                          : message.status === "delivered"
                            ? "secondary"
                            : message.status === "sent"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {message.status === "read"
                        ? "مقروءة"
                        : message.status === "delivered"
                          ? "تم التسليم"
                          : message.status === "sent"
                            ? "تم الإرسال"
                            : "فشل الإرسال"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        message.type === "repair"
                          ? "default"
                          : message.type === "sales"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {message.type === "repair"
                        ? "صيانة"
                        : message.type === "sales"
                          ? "مبيعات"
                          : message.type === "notification"
                            ? "إشعار"
                            : "تسويق"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">لا توجد رسائل سابقة</p>
          </div>
        )}
      </div>
    );
  };

  // Template list component
  const TemplateList = ({ templates }: { templates: Template[] }) => {
    return (
      <div className="space-y-4">
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge
                      variant={
                        template.category === "repair"
                          ? "default"
                          : template.category === "sales"
                            ? "secondary"
                            : template.category === "notification"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {template.category === "repair"
                        ? "صيانة"
                        : template.category === "sales"
                          ? "مبيعات"
                          : template.category === "notification"
                            ? "إشعار"
                            : "تسويق"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {template.content}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => {
                      setActiveTab("send");
                      handleTemplateChange(template.id);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    استخدام القالب
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      navigator.clipboard.writeText(template.content);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    نسخ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">لا توجد قوالب متاحة</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تكامل الواتساب</h1>
            <p className="text-gray-500 mt-1">
              إرسال رسائل واتساب للعملاء وإدارة القوالب
            </p>
          </div>

          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="send"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger value="send" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>إرسال رسالة</span>
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>القوالب</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span>السجل</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="send" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إرسال رسالة واتساب</CardTitle>
                    <CardDescription>
                      إرسال رسالة واتساب للعملاء باستخدام القوالب الجاهزة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">رقم هاتف العميل</Label>
                        <div className="flex">
                          <Input
                            id="customerPhone"
                            placeholder="05xxxxxxxx"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>نوع الرسالة</Label>
                        <ItemTypeSelector
                          value={messageType}
                          onValueChange={setMessageType}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template">اختر قالب الرسالة</Label>
                        <Select
                          value={selectedTemplate}
                          onValueChange={handleTemplateChange}
                        >
                          <SelectTrigger id="template">
                            <SelectValue placeholder="اختر قالب الرسالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">بدون قالب</SelectItem>
                            {getTemplatesByType().map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedTemplate && (
                        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
                          <h3 className="font-medium">متغيرات القالب</h3>
                          {templates
                            .find((t) => t.id === selectedTemplate)
                            ?.variables.map((variable) => (
                              <div key={variable} className="space-y-2">
                                <Label htmlFor={variable}>{variable}</Label>
                                <Input
                                  id={variable}
                                  placeholder={`أدخل ${variable}`}
                                  value={templateVariables[variable] || ""}
                                  onChange={(e) =>
                                    handleVariableChange(
                                      variable,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="message">نص الرسالة</Label>
                        <Textarea
                          id="message"
                          placeholder="أدخل نص الرسالة هنا..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          rows={6}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMessageContent("");
                        setCustomerPhone("");
                        setSelectedTemplate("");
                        setTemplateVariables({});
                      }}
                    >
                      مسح
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!customerPhone || !messageContent}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      إرسال الرسالة
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="templates" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>قوالب الرسائل</CardTitle>
                      <Button
                        onClick={() => setActiveTab("create-template")}
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        إنشاء قالب جديد
                      </Button>
                    </div>
                    <CardDescription>
                      إدارة قوالب الرسائل المستخدمة في التواصل مع العملاء
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">الكل</TabsTrigger>
                        <TabsTrigger value="repair">الصيانة</TabsTrigger>
                        <TabsTrigger value="sales">المبيعات</TabsTrigger>
                        <TabsTrigger value="marketing">التسويق</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        <TemplateList templates={getAllTemplates()} />
                      </TabsContent>
                      <TabsContent value="repair" className="mt-4">
                        <TemplateList
                          templates={getTemplatesByCategory("repair")}
                        />
                      </TabsContent>
                      <TabsContent value="sales" className="mt-4">
                        <TemplateList
                          templates={getTemplatesByCategory("sales")}
                        />
                      </TabsContent>
                      <TabsContent value="marketing" className="mt-4">
                        <TemplateList
                          templates={getTemplatesByCategory("marketing")}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل الرسائل</CardTitle>
                    <CardDescription>
                      عرض سجل الرسائل المرسلة للعملاء
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageHistoryComponent />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create-template" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>إنشاء قالب جديد</CardTitle>
                    <CardDescription>
                      قم بإنشاء قالب رسالة جديد للاستخدام في التواصل مع العملاء
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="templateName">اسم القالب</Label>
                        <Input
                          id="templateName"
                          placeholder="أدخل اسم القالب"
                          value={newTemplate.name}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>نوع القالب</Label>
                        <ItemTypeSelector
                          value={messageType}
                          onValueChange={setMessageType}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateCategory">تصنيف القالب</Label>
                        <Select
                          value={newTemplate.category}
                          onValueChange={(value: Template["category"]) =>
                            setNewTemplate({
                              ...newTemplate,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger id="templateCategory">
                            <SelectValue placeholder="اختر تصنيف القالب" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="repair">الصيانة</SelectItem>
                            <SelectItem value="sales">المبيعات</SelectItem>
                            <SelectItem value="notification">
                              إشعارات
                            </SelectItem>
                            <SelectItem value="marketing">التسويق</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateContent">
                          محتوى القالب
                          <span className="text-xs text-gray-500 block mt-1">
                            استخدم الصيغة {{ variableName }} لإضافة متغيرات
                          </span>
                        </Label>
                        <Textarea
                          id="templateContent"
                          placeholder="أدخل محتوى القالب هنا..."
                          value={newTemplate.content}
                          onChange={(e) =>
                            setNewTemplate({
                              ...newTemplate,
                              content: e.target.value,
                            })
                          }
                          rows={6}
                        />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-md">
                        <h3 className="font-medium mb-2">
                          مثال على المتغيرات:
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          مرحباً {{ customerName }}، تم استلام جهازك{" "}
                          {{ deviceType }}
                          للصيانة.{" "}
                        </p>
                        <p className="text-xs text-gray-500">
                          سيتم استبدال {{ customerName }} و {{ deviceType }}{" "}
                          بالقيم الفعلية عند إرسال الرسالة.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("templates")}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleCreateTemplate}
                      disabled={!newTemplate.name || !newTemplate.content}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      إنشاء القالب
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappIntegration;
