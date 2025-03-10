import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Printer,
  Share,
  MoreVertical,
  Download,
  Search,
} from "lucide-react";
import { exportInvoicesToPdf, exportInvoiceToPdf } from "@/utils/pdfExport";

interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  type: "sales" | "repair";
  amount: number;
  status: "paid" | "pending" | "overdue";
}

interface InvoiceListProps {
  invoices?: Invoice[];
}

const InvoiceList = ({ invoices = [] }: InvoiceListProps) => {
  // Default mock data if no invoices are provided
  const defaultInvoices: Invoice[] = [
    {
      id: "1",
      number: "INV-001",
      date: "2023-05-15",
      customer: "محمد أحمد",
      type: "sales",
      amount: 1250,
      status: "paid",
    },
    {
      id: "2",
      number: "INV-002",
      date: "2023-05-16",
      customer: "فاطمة علي",
      type: "repair",
      amount: 850,
      status: "pending",
    },
    {
      id: "3",
      number: "INV-003",
      date: "2023-05-14",
      customer: "أحمد محمود",
      type: "sales",
      amount: 2100,
      status: "paid",
    },
    {
      id: "4",
      number: "INV-004",
      date: "2023-05-10",
      customer: "سارة حسن",
      type: "repair",
      amount: 450,
      status: "overdue",
    },
    {
      id: "5",
      number: "INV-005",
      date: "2023-05-12",
      customer: "خالد عبدالله",
      type: "sales",
      amount: 3200,
      status: "paid",
    },
  ];

  const [displayInvoices, setDisplayInvoices] = useState(
    invoices.length > 0 ? invoices : defaultInvoices,
  );

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            مدفوع
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            قيد الانتظار
          </Badge>
        );
      case "overdue":
        return <Badge variant="destructive">متأخر</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Type badge color mapping
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sales":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            مبيعات
          </Badge>
        );
      case "repair":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            صيانة
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = displayInvoices.filter((invoice) => {
    return (
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Listen for new invoices being created
  React.useEffect(() => {
    const handleInvoiceCreated = (event: any) => {
      const newInvoice = event.detail;
      if (newInvoice) {
        setDisplayInvoices((prevInvoices) => [newInvoice, ...prevInvoices]);
      }
    };

    const invoiceListElement = document.getElementById(
      "invoice-list-component",
    );
    if (invoiceListElement) {
      invoiceListElement.addEventListener(
        "invoice-created",
        handleInvoiceCreated,
      );
    }

    return () => {
      if (invoiceListElement) {
        invoiceListElement.removeEventListener(
          "invoice-created",
          handleInvoiceCreated,
        );
      }
    };
  }, []);

  return (
    <div
      id="invoice-list-component"
      className="w-full bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">قائمة الفواتير</h2>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => exportInvoicesToPdf(displayInvoices)}
        >
          <Download className="mr-2 h-4 w-4" /> تصدير الفواتير
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="بحث عن رقم الفاتورة أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4"
          />
        </div>
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            if (value === "all") {
              setDisplayInvoices(
                invoices.length > 0 ? invoices : defaultInvoices,
              );
            } else {
              const filtered = (
                invoices.length > 0 ? invoices : defaultInvoices
              ).filter((invoice) => invoice.type === value);
              setDisplayInvoices(filtered);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع الفاتورة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفواتير</SelectItem>
            <SelectItem value="sales">فواتير المبيعات</SelectItem>
            <SelectItem value="repair">فواتير الصيانة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>قائمة الفواتير الحالية</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الفاتورة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium text-right">
                  {invoice.number}
                </TableCell>
                <TableCell className="text-right">{invoice.date}</TableCell>
                <TableCell className="text-right">{invoice.customer}</TableCell>
                <TableCell className="text-right">
                  {getTypeBadge(invoice.type)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(invoice.status)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        alert("عرض تفاصيل الفاتورة " + invoice.number)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => exportInvoiceToPdf(invoice)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Create a shareable link
                        const shareData = {
                          title: `فاتورة رقم ${invoice.number}`,
                          text: `فاتورة ${invoice.type === "sales" ? "مبيعات" : "صيانة"} للعميل ${invoice.customer} بمبلغ ${formatCurrency(invoice.amount)}`,
                          url: window.location.href,
                        };

                        // Use Web Share API if available
                        if (navigator.share) {
                          navigator
                            .share(shareData)
                            .then(() => console.log("تمت المشاركة بنجاح"))
                            .catch((error) =>
                              console.log("خطأ في المشاركة:", error),
                            );
                        } else {
                          // Fallback for browsers that don't support Web Share API
                          const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`;
                          window.open(shareUrl, "_blank");
                        }
                      }}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            // Open invoice editor in a new window
                            const editWindow = window.open(
                              "",
                              "_blank",
                              "width=800,height=600",
                            );
                            if (editWindow) {
                              // Generate invoice HTML with edit capabilities
                              const invoiceHtml = `
                                <!DOCTYPE html>
                                <html dir="rtl" lang="ar">
                                <head>
                                  <meta charset="UTF-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                  <title>تعديل الفاتورة ${invoice.number}</title>
                                  <style>
                                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
                                    body { font-family: 'Tajawal', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; color: #333; }
                                    .invoice { max-width: 800px; margin: 0 auto; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px; }
                                    .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                                    .invoice-title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 10px; color: #3b82f6; }
                                    .invoice-subtitle { text-align: center; margin-bottom: 25px; font-size: 18px; color: #64748b; }
                                    .invoice-details { margin-bottom: 30px; display: flex; justify-content: space-between; background-color: #f8fafc; border-radius: 8px; padding: 15px; }
                                    .invoice-details div { margin-bottom: 8px; }
                                    .invoice-items { width: 100%; border-collapse: collapse; margin-bottom: 25px; border-radius: 8px; overflow: hidden; }
                                    .invoice-items th, .invoice-items td { border: 1px solid #e2e8f0; padding: 12px; text-align: right; }
                                    .invoice-items th { background-color: #3b82f6; color: white; font-weight: 500; }
                                    .invoice-items tr:nth-child(even) { background-color: #f8fafc; }
                                    .invoice-items tr:hover { background-color: #f1f5f9; }
                                    .invoice-total { text-align: left; font-weight: bold; font-size: 18px; }
                                    .print-button { background-color: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; transition: background-color 0.3s; }
                                    .print-button:hover { background-color: #2563eb; }
                                    .edit-button { background-color: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; transition: background-color 0.3s; }
                                    .edit-button:hover { background-color: #059669; }
                                    .settings-button { background-color: #f59e0b; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; transition: background-color 0.3s; }
                                    .settings-button:hover { background-color: #d97706; }
                                    .button-container { display: flex; justify-content: center; margin-top: 30px; }
                                    .warranty-section { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 15px; margin-top: 25px; background-color: #f8fafc; }
                                    .warranty-title { font-weight: 700; margin-bottom: 12px; color: #475569; }
                                    .warranty-item { margin-bottom: 8px; color: #64748b; }
                                    .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
                                    .signature-line { border-top: 1px solid #94a3b8; width: 200px; text-align: center; padding-top: 8px; color: #64748b; }
                                    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                                    .settings-panel { display: none; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
                                    .settings-panel.active { display: block; }
                                    .settings-panel h3 { margin-top: 0; color: #3b82f6; }
                                    .settings-panel label { display: block; margin-bottom: 8px; color: #475569; }
                                    .settings-panel input, .settings-panel textarea { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 6px; }
                                    @media print { 
                                      .no-print { display: none; } 
                                      body { background-color: #fff; }
                                      .invoice { box-shadow: none; }
                                    }
                                  </style>
                                </head>
                                <body>
                                  <div class="invoice">
                                    <div class="invoice-title">📱 وكالة الموبايل</div>
                                    <div class="invoice-subtitle" contenteditable="true">مبيعات وصيانة أجهزة الموبايل</div>
                                    
                                    <div class="settings-panel no-print" id="settings-panel">
                                      <h3>إعدادات الفاتورة</h3>
                                      <label for="shop-name">اسم المحل:</label>
                                      <input type="text" id="shop-name" value="مكتب تاج للموبايل" />
                                      
                                      <label for="shop-address">عنوان المحل:</label>
                                      <input type="text" id="shop-address" value="بغداد ناحية الرشيد مجاور مدرسة السنابل" />
                                      
                                      <label for="shop-phone">رقم الهاتف:</label>
                                      <input type="text" id="shop-phone" value="07509931238" />
                                      
                                      <label for="warranty-days">مدة ضمان الأجهزة (بالأيام):</label>
                                      <input type="number" id="warranty-days" value="30" />
                                      
                                      <label for="repair-warranty-days">مدة ضمان الصيانة (بالأيام):</label>
                                      <input type="number" id="repair-warranty-days" value="15" />
                                      
                                      <label for="warranty-terms">شروط الضمان الإضافية:</label>
                                      <textarea id="warranty-terms" rows="3">لا يشمل الضمان الأعطال الناتجة عن سوء الاستخدام أو الكسر أو السوائل.</textarea>
                                      
                                      <button onclick="applySettings()" class="edit-button">تطبيق الإعدادات</button>
                                    </div>
                                    
                                    <div class="invoice-details">
                                      <div>
                                        <div><strong>🔹 اسم المحل:</strong> <span id="shop-name-display">مكتب تاج للموبايل</span></div>
                                        <div><strong>🔹 العنوان:</strong> <span id="shop-address-display">بغداد ناحية الرشيد مجاور مدرسة السنابل</span></div>
                                        <div><strong>🔹 رقم الهاتف:</strong> <span id="shop-phone-display">07509931238</span></div>
                                      </div>
                                      <div>
                                        <div><strong>🔹 التاريخ:</strong> <span id="invoice-date" contenteditable="true">${invoice.date}</span></div>
                                        <div><strong>🔹 رقم الفاتورة:</strong> <span id="invoice-number" contenteditable="true">${invoice.number}</span></div>
                                        <div><strong>🔹 العميل:</strong> <span id="customer-name" contenteditable="true">${invoice.customer}</span></div>
                                        <div><strong>🔹 رقم الهاتف:</strong> <span id="customer-phone" contenteditable="true">-</span></div>
                                      </div>
                                    </div>
                                    
                                    <div><strong>🛒 تفاصيل المبيعات / الصيانة</strong></div>
                                    <table class="invoice-items">
                                      <thead>
                                        <tr>
                                          <th>الرقم</th>
                                          <th>الوصف</th>
                                          <th>الكمية</th>
                                          <th>السعر للوحدة</th>
                                          <th>المجموع</th>
                                        </tr>
                                      </thead>
                                      <tbody id="invoice-items">
                                        <tr>
                                          <td>1</td>
                                          <td contenteditable="true">${invoice.type === "sales" ? "مبيعات أجهزة" : "خدمة صيانة"}</td>
                                          <td contenteditable="true">1</td>
                                          <td contenteditable="true">${invoice.amount}</td>
                                          <td>${invoice.amount}</td>
                                        </tr>
                                      </tbody>
                                      <tfoot>
                                        <tr>
                                          <td colspan="4" class="invoice-total">🔹 المجموع الفرعي:</td>
                                          <td id="subtotal">${invoice.amount}</td>
                                        </tr>
                                        <tr>
                                          <td colspan="4" class="invoice-total">🔹 الخصم (إن وجد):</td>
                                          <td contenteditable="true" id="discount">0</td>
                                        </tr>
                                        <tr>
                                          <td colspan="4" class="invoice-total">🔹 الإجمالي:</td>
                                          <td id="total">${invoice.amount}</td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                    
                                    <div>
                                      <strong>🔹 طريقة الدفع:</strong> 
                                      <select id="payment-method" class="no-print" style="margin-right: 10px;">
                                        <option value="نقدًا" ${invoice.status === "paid" ? "selected" : ""}>نقدًا</option>
                                        <option value="بطاقة" ${invoice.status === "pending" ? "selected" : ""}>بطاقة</option>
                                        <option value="تحويل">تحويل</option>
                                      </select>
                                      <span id="payment-method-text">${invoice.status === "paid" ? "نقدًا" : invoice.status === "pending" ? "بطاقة" : "متأخر"}</span>
                                    </div>
                                    
                                    <div class="warranty-section">
                                      <div class="warranty-title">🔧 الضمان وشروط الخدمة</div>
                                      <div class="warranty-item">• الأجهزة المباعة مشمولة بضمان لمدة <span id="warranty-days-display" contenteditable="true">30</span> أيام ضد العيوب المصنعية.</div>
                                      <div class="warranty-item">• الصيانة تشمل <span contenteditable="true">الإصلاح</span> وتكون مكفولة لمدة <span id="repair-warranty-days-display" contenteditable="true">15</span> أيام (في حال الضمان).</div>
                                      <div class="warranty-item" id="warranty-terms-display">• لا يشمل الضمان الأعطال الناتجة عن سوء الاستخدام أو الكسر أو السوائل.</div>
                                    </div>
                                    
                                    <div class="signature-section">
                                      <div>
                                        <div class="signature-line">توقيع الفني</div>
                                      </div>
                                      <div>
                                        <div class="signature-line">توقيع العميل</div>
                                      </div>
                                    </div>
                                    
                                    <div class="footer">
                                      📞 لمزيد من المعلومات، تواصل معنا على: <span id="footer-phone-display">07509931238</span><br>
                                      شكرًا لاختياركم <span id="footer-shop-name-display">مكتب تاج للموبايل</span>! 🎉
                                    </div>
                                    
                                    <div class="button-container no-print">
                                      <button class="print-button" onclick="window.print()">طباعة الفاتورة</button>
                                      <button class="edit-button" onclick="updateTotal()">تحديث المجموع</button>
                                      <button class="settings-button" onclick="toggleSettings()">تعديل معلومات المحل</button>
                                    </div>
                                  </div>
                                  
                                  <script>
                                    // Update payment method text when select changes
                                    document.getElementById('payment-method').addEventListener('change', function() {
                                      document.getElementById('payment-method-text').textContent = this.value;
                                    });
                                    
                                    // Function to update totals
                                    function updateTotal() {
                                      // Get all rows
                                      const rows = document.querySelectorAll('#invoice-items tr');
                                      let subtotal = 0;
                                      
                                      // Calculate subtotal
                                      rows.forEach(row => {
                                        const quantity = parseFloat(row.cells[2].textContent.replace(/[^0-9.-]+/g, '')) || 0;
                                        const price = parseFloat(row.cells[3].textContent.replace(/[^0-9.-]+/g, '')) || 0;
                                        const rowTotal = quantity * price;
                                        row.cells[4].textContent = rowTotal.toLocaleString('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 });
                                        subtotal += rowTotal;
                                      });
                                      
                                      // Update subtotal
                                      document.getElementById('subtotal').textContent = subtotal.toLocaleString('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 });
                                      
                                      // Get discount
                                      const discount = parseFloat(document.getElementById('discount').textContent.replace(/[^0-9.-]+/g, '')) || 0;
                                      
                                      // Calculate total
                                      const total = subtotal - discount;
                                      document.getElementById('total').textContent = total.toLocaleString('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 });
                                    }
                                    
                                    // Toggle settings panel
                                    function toggleSettings() {
                                      const settingsPanel = document.getElementById('settings-panel');
                                      settingsPanel.classList.toggle('active');
                                    }
                                    
                                    // Apply settings to invoice
                                    function applySettings() {
                                      // Get values from settings form
                                      const shopName = document.getElementById('shop-name').value;
                                      const shopAddress = document.getElementById('shop-address').value;
                                      const shopPhone = document.getElementById('shop-phone').value;
                                      const warrantyDays = document.getElementById('warranty-days').value;
                                      const repairWarrantyDays = document.getElementById('repair-warranty-days').value;
                                      const warrantyTerms = document.getElementById('warranty-terms').value;
                                      
                                      // Update invoice with new values
                                      document.getElementById('shop-name-display').textContent = shopName;
                                      document.getElementById('shop-address-display').textContent = shopAddress;
                                      document.getElementById('shop-phone-display').textContent = shopPhone;
                                      document.getElementById('warranty-days-display').textContent = warrantyDays;
                                      document.getElementById('repair-warranty-days-display').textContent = repairWarrantyDays;
                                      document.getElementById('warranty-terms-display').textContent = '• ' + warrantyTerms;
                                      document.getElementById('footer-phone-display').textContent = shopPhone;
                                      document.getElementById('footer-shop-name-display').textContent = shopName;
                                      // لا نقوم بتحديث عنوان الفاتورة الرئيسي عند تغيير اسم المحل
                                      // document.querySelector('.invoice-subtitle').textContent = shopName;
                                      
                                      // Hide settings panel
                                      document.getElementById('settings-panel').classList.remove('active');
                                      
                                      // Save settings to localStorage for future use
                                      localStorage.setItem('invoiceSettings', JSON.stringify({
                                        shopName,
                                        shopAddress,
                                        shopPhone,
                                        warrantyDays,
                                        repairWarrantyDays,
                                        warrantyTerms
                                      }));
                                    }
                                    
                                    // Load saved settings if available
                                    window.onload = function() {
                                      const savedSettings = localStorage.getItem('invoiceSettings');
                                      if (savedSettings) {
                                        const settings = JSON.parse(savedSettings);
                                        
                                        // Fill settings form
                                        document.getElementById('shop-name').value = settings.shopName;
                                        document.getElementById('shop-address').value = settings.shopAddress;
                                        document.getElementById('shop-phone').value = settings.shopPhone;
                                        document.getElementById('warranty-days').value = settings.warrantyDays;
                                        document.getElementById('repair-warranty-days').value = settings.repairWarrantyDays;
                                        document.getElementById('warranty-terms').value = settings.warrantyTerms;
                                        
                                        // Apply settings to invoice
                                        document.getElementById('shop-name-display').textContent = settings.shopName;
                                        document.getElementById('shop-address-display').textContent = settings.shopAddress;
                                        document.getElementById('shop-phone-display').textContent = settings.shopPhone;
                                        document.getElementById('warranty-days-display').textContent = settings.warrantyDays;
                                        document.getElementById('repair-warranty-days-display').textContent = settings.repairWarrantyDays;
                                        document.getElementById('warranty-terms-display').textContent = '• ' + settings.warrantyTerms;
                                        document.getElementById('footer-phone-display').textContent = settings.shopPhone;
                                        document.getElementById('footer-shop-name-display').textContent = settings.shopName;
                                        // لا نقوم بتحديث عنوان الفاتورة الرئيسي عند تحميل الإعدادات
                                        // document.querySelector('.invoice-subtitle').textContent = settings.shopName;
                                      }
                                    };
                                    
                                    // Add row to invoice items
                                    function addRow() {
                                      const tbody = document.getElementById('invoice-items');
                                      const rowCount = tbody.rows.length;
                                      const newRow = tbody.insertRow();
                                      
                                      // Add cells
                                      const cell1 = newRow.insertCell(0);
                                      const cell2 = newRow.insertCell(1);
                                      const cell3 = newRow.insertCell(2);
                                      const cell4 = newRow.insertCell(3);
                                      const cell5 = newRow.insertCell(4);
                                      
                                      // Set cell contents
                                      cell1.textContent = rowCount + 1;
                                      cell2.textContent = 'وصف العنصر';
                                      cell2.contentEditable = 'true';
                                      cell3.textContent = '1';
                                      cell3.contentEditable = 'true';
                                      cell4.textContent = '0';
                                      cell4.contentEditable = 'true';
                                      cell5.textContent = '0';
                                      
                                      // Update totals
                                      updateTotal();
                                    }
                                    
                                    // Add button to add new row
                                    const table = document.querySelector('.invoice-items');
                                    const addRowButton = document.createElement('button');
                                    addRowButton.textContent = 'إضافة عنصر';
                                    addRowButton.className = 'edit-button no-print';
                                    addRowButton.style.marginTop = '10px';
                                    addRowButton.onclick = addRow;
                                    table.after(addRowButton);
                                  </script>
                                </body>
                                </html>
                              `;

                              editWindow.document.write(invoiceHtml);
                              editWindow.document.close();
                            }
                          }}
                        >
                          تعديل الفاتورة
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // Create WhatsApp message with invoice details
                            const message =
                              `*فاتورة ${invoice.type === "sales" ? "مبيعات" : "صيانة"}*\n\n` +
                              `رقم الفاتورة: ${invoice.number}\n` +
                              `التاريخ: ${invoice.date}\n` +
                              `العميل: ${invoice.customer}\n` +
                              `المبلغ: ${formatCurrency(invoice.amount)}\n` +
                              `الحالة: ${invoice.status === "paid" ? "مدفوع" : invoice.status === "pending" ? "قيد الانتظار" : "متأخر"}\n\n` +
                              `شكراً لتعاملكم معنا`;

                            // Open WhatsApp with the message
                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, "_blank");
                          }}
                        >
                          إرسال عبر الواتساب
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (
                              confirm(
                                `هل أنت متأكد من حذف الفاتورة ${invoice.number}؟`,
                              )
                            ) {
                              // Remove the invoice from the displayed invoices
                              const updatedInvoices = displayInvoices.filter(
                                (inv) => inv.id !== invoice.id,
                              );
                              setDisplayInvoices(updatedInvoices);
                              alert(`تم حذف الفاتورة ${invoice.number} بنجاح`);
                            }
                          }}
                        >
                          حذف الفاتورة
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceList;
