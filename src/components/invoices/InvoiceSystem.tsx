import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Plus, FileText, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import InvoiceList from "./InvoiceList";
import { exportInvoiceToPdf } from "@/utils/pdfExport";

interface InvoiceSystemProps {
  onCreateInvoice?: (invoiceData: any) => void;
  onPrintInvoice?: (invoiceId: string) => void;
  onShareViaWhatsapp?: (invoiceId: string) => void;
}

const InvoiceSystem = ({
  onCreateInvoice = () => {},
  onPrintInvoice = () => {},
  onShareViaWhatsapp = () => {},
}: InvoiceSystemProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerPhone: "",
    invoiceType: "sales",
    items: [{ id: 1, description: "", quantity: 1, price: 0 }],
    notes: "",
  });

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [
        ...newInvoice.items,
        {
          id: newInvoice.items.length + 1,
          description: "",
          quantity: 1,
          price: 0,
        },
      ],
    });
  };

  const handleItemChange = (
    id: number,
    field: string,
    value: string | number,
  ) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    });
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    if (!newInvoice.customerName.trim()) {
      alert("يرجى إدخال اسم العميل");
      return;
    }

    if (!newInvoice.customerPhone.trim()) {
      alert("يرجى إدخال رقم هاتف العميل");
      return;
    }

    if (newInvoice.items.some((item) => !item.description.trim())) {
      alert("يرجى إدخال وصف لجميع العناصر");
      return;
    }

    if (calculateTotal() <= 0) {
      alert("يجب أن يكون إجمالي الفاتورة أكبر من صفر");
      return;
    }

    // توليد رقم الفاتورة والتاريخ
    const invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    const invoiceDate = new Date().toISOString().split("T")[0];

    // إنشاء كائن الفاتورة الجديد
    const invoice = {
      ...newInvoice,
      total: calculateTotal(),
      date: invoiceDate,
      id: `INV-${Date.now().toString(36)}`,
      number: invoiceNumber,
      status: "paid",
      customer: newInvoice.customerName, // إضافة اسم العميل بالتنسيق المطلوب للعرض في القائمة
      amount: calculateTotal(), // إضافة المبلغ بالتنسيق المطلوب للعرض في القائمة
      type: newInvoice.invoiceType as "sales" | "repair", // تحويل النوع للتنسيق المطلوب
    };

    // Update sales data for dashboard
    const salesData = {
      dailyTotal: calculateTotal() + 3250,
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
          id: invoice.number,
          time: new Date().toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount: calculateTotal(),
          type: newInvoice.invoiceType,
          description: newInvoice.items[0]?.description || "فاتورة جديدة",
        },
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
      ],
    };
    window.dispatchEvent(
      new CustomEvent("sales-update", { detail: salesData }),
    );

    // معاينة الفاتورة قبل الإنشاء
    openInvoicePreview(invoice, invoiceNumber, invoiceDate, true);
  };

  // Function to reset the form
  const resetForm = () => {
    setNewInvoice({
      customerName: "",
      customerPhone: "",
      invoiceType: "sales",
      items: [{ id: 1, description: "", quantity: 1, price: 0 }],
      notes: "",
    });
  };

  // Function to open invoice preview
  const openInvoicePreview = (
    invoice: any,
    invoiceNumber: string,
    invoiceDate: string,
    isNewInvoice: boolean = false,
  ) => {
    const previewWindow = window.open("", "_blank", "width=800,height=600");
    if (previewWindow) {
      // Generate invoice HTML
      const invoiceHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>معاينة الفاتورة</title>
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
                <div><strong>🔹 التاريخ:</strong> <span id="invoice-date" contenteditable="true">${new Date(invoiceDate).toLocaleDateString("ar-EG")}</span></div>
                <div><strong>🔹 رقم الفاتورة:</strong> <span id="invoice-number" contenteditable="true">${invoiceNumber}</span></div>
                <div><strong>🔹 العميل:</strong> <span id="customer-name" contenteditable="true">${invoice.customerName}</span></div>
                <div><strong>🔹 رقم الهاتف:</strong> <span id="customer-phone" contenteditable="true">${invoice.customerPhone}</span></div>
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
                ${invoice.items
                  .map(
                    (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td contenteditable="true">${item.description || "بدون وصف"}</td>
                    <td contenteditable="true">${item.quantity}</td>
                    <td contenteditable="true">${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="invoice-total">🔹 المجموع الفرعي:</td>
                  <td id="subtotal">${formatCurrency(calculateTotal())}</td>
                </tr>
                <tr>
                  <td colspan="4" class="invoice-total">🔹 الخصم (إن وجد):</td>
                  <td contenteditable="true" id="discount">0</td>
                </tr>
                <tr>
                  <td colspan="4" class="invoice-total">🔹 الإجمالي:</td>
                  <td id="total">${formatCurrency(calculateTotal())}</td>
                </tr>
              </tfoot>
            </table>
            
            <div>
              <strong>🔹 طريقة الدفع:</strong> 
              <select id="payment-method" class="no-print" style="margin-right: 10px;">
                <option value="نقدًا">نقدًا</option>
                <option value="بطاقة">بطاقة</option>
                <option value="تحويل">تحويل</option>
              </select>
              <span id="payment-method-text">نقدًا</span>
            </div>
            
            ${invoice.notes ? `<div style="margin-top: 10px;"><strong>ملاحظات:</strong> <span contenteditable="true">${invoice.notes}</span></div>` : ""}
            
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
              ${
                isNewInvoice
                  ? `
              <button class="edit-button" style="background-color: #10b981; color: white;" onclick="confirmAndSave()">تأكيد وإنشاء الفاتورة</button>
              <button class="edit-button" onclick="cancelInvoice()">إلغاء</button>
              `
                  : `
              <button class="edit-button" onclick="saveAndClose()">حفظ والعودة</button>
              `
              }
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
            
            // Save and close function
            function saveAndClose() {
              if (confirm('هل تريد حفظ التغييرات والعودة؟')) {
                // Here you would normally save the invoice data back to the server
                // For now, we'll just close and notify the parent window
                window.opener.postMessage('invoice_saved', '*');
                window.close();
              }
            }
            
            // Confirm and save new invoice
            function confirmAndSave() {
              if (confirm('هل أنت متأكد من إنشاء هذه الفاتورة؟')) {
                // Notify the parent window to create the invoice
                window.opener.postMessage('invoice_confirmed', '*');
                window.close();
              }
            }
            
            // Cancel invoice creation
            function cancelInvoice() {
              if (confirm('هل أنت متأكد من إلغاء إنشاء الفاتورة؟')) {
                window.opener.postMessage('invoice_cancelled', '*');
                window.close();
              }
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

      previewWindow.document.write(invoiceHtml);
      previewWindow.document.close();

      // Listen for messages from the preview window
      window.addEventListener("message", function (event) {
        if (event.data === "invoice_saved") {
          // Reset form after saving
          resetForm();
          // Switch to the "all" tab to show the invoices list
          setActiveTab("all");
        } else if (event.data === "invoice_confirmed") {
          // Create the invoice when confirmed from preview
          onCreateInvoice(invoice);
          // Reset form after creating
          resetForm();
          // Switch to the "all" tab to show the invoices list
          setActiveTab("all");
          // Add the new invoice to the list in InvoiceList component
          const invoiceList = document.querySelector("#invoice-list-component");
          if (invoiceList) {
            const event = new CustomEvent("invoice-created", {
              detail: invoice,
            });
            invoiceList.dispatchEvent(event);
          }
          // Show success message
          alert("تم إنشاء الفاتورة بنجاح!");
        } else if (event.data === "invoice_cancelled") {
          // Do nothing, just keep the form open
          console.log("تم إلغاء إنشاء الفاتورة");
        }
      });
    }
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">جميع الفواتير</TabsTrigger>
            <TabsTrigger value="create">إنشاء فاتورة</TabsTrigger>
            <TabsTrigger value="template">نموذج فاتورة</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          <InvoiceList />
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء فاتورة جديدة</CardTitle>
              <CardDescription>
                قم بإدخال بيانات الفاتورة الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">اسم العميل</Label>
                      <Input
                        id="customerName"
                        placeholder="أدخل اسم العميل"
                        value={newInvoice.customerName}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
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
                        value={newInvoice.customerPhone}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            customerPhone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invoiceType">نوع الفاتورة</Label>
                      <Select
                        value={newInvoice.invoiceType}
                        onValueChange={(value) =>
                          setNewInvoice({ ...newInvoice, invoiceType: value })
                        }
                      >
                        <SelectTrigger id="invoiceType">
                          <SelectValue placeholder="اختر نوع الفاتورة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">مبيعات</SelectItem>
                          <SelectItem value="repair">صيانة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>العناصر</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddItem}
                        >
                          <Plus className="h-4 w-4 mr-2" /> إضافة عنصر
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-md">
                        {newInvoice.items.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <div className="col-span-6">
                              <Input
                                placeholder="وصف العنصر"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                placeholder="الكمية"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                min="1"
                              />
                            </div>
                            <div className="col-span-4">
                              <Input
                                type="number"
                                placeholder="السعر"
                                value={item.price}
                                onChange={(e) =>
                                  handleItemChange(
                                    item.id,
                                    "price",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                min="0"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات</Label>
                      <Input
                        id="notes"
                        placeholder="أي ملاحظات إضافية"
                        value={newInvoice.notes}
                        onChange={(e) =>
                          setNewInvoice({
                            ...newInvoice,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">المجموع:</span>
                        <span className="font-bold text-xl">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2 rtl:space-x-reverse">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <FileText className="mr-2 h-4 w-4" /> إنشاء الفاتورة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Generate invoice number and date
                      const invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
                      const invoiceDate = new Date()
                        .toISOString()
                        .split("T")[0];

                      // Create a temporary invoice object for preview
                      const previewInvoice = {
                        ...newInvoice,
                        total: calculateTotal(),
                        date: invoiceDate,
                        id: `INV-${Date.now().toString(36)}`,
                        number: invoiceNumber,
                        status: "paid",
                      };

                      // Open invoice preview
                      openInvoicePreview(
                        previewInvoice,
                        invoiceNumber,
                        invoiceDate,
                      );
                    }}
                  >
                    <Printer className="mr-2 h-4 w-4" /> معاينة وطباعة
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                    onClick={() => {
                      // التحقق من صحة البيانات
                      if (!newInvoice.customerName.trim()) {
                        alert("يرجى إدخال اسم العميل");
                        return;
                      }

                      if (!newInvoice.customerPhone.trim()) {
                        alert("يرجى إدخال رقم هاتف العميل");
                        return;
                      }

                      if (
                        newInvoice.items.some(
                          (item) => !item.description.trim(),
                        )
                      ) {
                        alert("يرجى إدخال وصف لجميع العناصر");
                        return;
                      }

                      // إنشاء رسالة WhatsApp
                      const message =
                        `*فاتورة ${newInvoice.invoiceType === "sales" ? "مبيعات" : "صيانة"}*\n\n` +
                        `📜 فاتورة مبيعات وصيانة أجهزة الموبايل\n` +
                        `🔹 اسم المحل: مكتب تاج للموبايل\n` +
                        `🔹 العنوان: بغداد ناحية الرشيد مجاور مدرسة السنابل\n` +
                        `🔹 رقم الهاتف: 07509931238\n` +
                        `🔹 التاريخ: ${new Date().toLocaleDateString("ar-EG")}\n` +
                        `🔹 رقم الفاتورة: INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}\n` +
                        `🔹 اسم العميل: ${newInvoice.customerName}\n` +
                        `🔹 رقم الهاتف: ${newInvoice.customerPhone}\n\n` +
                        `🛒 تفاصيل المبيعات / الصيانة\n` +
                        `------------------------------------------\n` +
                        newInvoice.items
                          .filter((item) => item.description.trim() !== "")
                          .map(
                            (item, index) =>
                              `${index + 1}. ${item.description || "بدون وصف"} (${item.quantity} × ${formatCurrency(item.price)}) = ${formatCurrency(item.quantity * item.price)}`,
                          )
                          .join("\n") +
                        `\n------------------------------------------\n` +
                        `🔹 المجموع الفرعي: ${formatCurrency(calculateTotal())}\n` +
                        `🔹 الخصم: 0\n` +
                        `🔹 الإجمالي: ${formatCurrency(calculateTotal())}\n` +
                        `🔹 طريقة الدفع: نقدًا\n\n` +
                        `🔧 الضمان وشروط الخدمة\n` +
                        `• الأجهزة المباعة مشمولة بضمان لمدة 30 أيام ضد العيوب المصنعية.\n` +
                        `• الصيانة تشمل الإصلاح وتكون مكفولة لمدة 15 أيام.\n` +
                        `• لا يشمل الضمان الأعطال الناتجة عن سوء الاستخدام.\n\n` +
                        `📞 للاستفسار: 07509931238\n` +
                        `شكرًا لاختياركم مكتب تاج للموبايل! 🎉`;

                      try {
                        // تنسيق رقم الهاتف (إزالة الصفر البادئ وإضافة رمز الدولة إذا لزم الأمر)
                        let phoneNumber = newInvoice.customerPhone.trim();
                        if (phoneNumber.startsWith("0")) {
                          phoneNumber = "964" + phoneNumber.substring(1);
                        } else if (
                          !phoneNumber.startsWith("+") &&
                          !phoneNumber.startsWith("964")
                        ) {
                          phoneNumber = "964" + phoneNumber;
                        }

                        // فتح WhatsApp مع الرسالة
                        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                      } catch (error) {
                        console.error("خطأ في فتح WhatsApp:", error);
                        alert(
                          "حدث خطأ أثناء محاولة فتح WhatsApp. يرجى التحقق من رقم الهاتف والمحاولة مرة أخرى.",
                        );
                      }
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> إرسال عبر
                    الواتساب
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>نموذج فاتورة جاهز</CardTitle>
              <CardDescription>
                قم بإنشاء فاتورة جاهزة بناءً على معلومات محددة مسبقاً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateType">نوع النموذج</Label>
                    <Select defaultValue="sales">
                      <SelectTrigger id="templateType">
                        <SelectValue placeholder="اختر نوع النموذج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">فاتورة مبيعات</SelectItem>
                        <SelectItem value="repair">فاتورة صيانة</SelectItem>
                        <SelectItem value="receipt">إيصال استلام</SelectItem>
                        <SelectItem value="quotation">عرض سعر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerType">نوع العميل</Label>
                    <Select defaultValue="individual">
                      <SelectTrigger id="customerType">
                        <SelectValue placeholder="اختر نوع العميل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">فرد</SelectItem>
                        <SelectItem value="company">شركة</SelectItem>
                        <SelectItem value="government">جهة حكومية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                    <Select defaultValue="cash">
                      <SelectTrigger id="paymentMethod">
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقداً</SelectItem>
                        <SelectItem value="card">بطاقة ائتمان</SelectItem>
                        <SelectItem value="transfer">تحويل بنكي</SelectItem>
                        <SelectItem value="later">آجل (دفع لاحقاً)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxIncluded">الضريبة</Label>
                    <Select defaultValue="included">
                      <SelectTrigger id="taxIncluded">
                        <SelectValue placeholder="حالة الضريبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="included">شاملة الضريبة</SelectItem>
                        <SelectItem value="excluded">
                          غير شاملة الضريبة
                        </SelectItem>
                        <SelectItem value="exempt">معفى من الضريبة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateItems">العناصر الجاهزة</Label>
                    <Select>
                      <SelectTrigger id="templateItems">
                        <SelectValue placeholder="اختر مجموعة العناصر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="screens">شاشات هواتف</SelectItem>
                        <SelectItem value="batteries">بطاريات</SelectItem>
                        <SelectItem value="accessories">اكسسوارات</SelectItem>
                        <SelectItem value="repairs">خدمات صيانة</SelectItem>
                        <SelectItem value="custom">تخصيص يدوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 border rounded-md bg-gray-50">
                    <h3 className="font-medium mb-2">العناصر المضمنة:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>شاشة iPhone 13</span>
                        <span className="font-medium">
                          {formatCurrency(120)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>تغيير بطارية</span>
                        <span className="font-medium">
                          {formatCurrency(45)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>حافظة حماية</span>
                        <span className="font-medium">
                          {formatCurrency(15)}
                        </span>
                      </li>
                      <li className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-bold">المجموع</span>
                        <span className="font-bold">{formatCurrency(180)}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="أي ملاحظات تريد إضافتها للفاتورة"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">فترة الضمان</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="warrantyPeriod">
                        <SelectValue placeholder="اختر فترة الضمان" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">بدون ضمان</SelectItem>
                        <SelectItem value="7">7 أيام</SelectItem>
                        <SelectItem value="15">15 يوم</SelectItem>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="90">3 أشهر</SelectItem>
                        <SelectItem value="180">6 أشهر</SelectItem>
                        <SelectItem value="365">سنة كاملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  معلومات النموذج
                </h3>
                <p className="text-sm text-blue-700">
                  سيتم إنشاء فاتورة جاهزة بناءً على المعلومات المحددة أعلاه.
                  يمكنك تعديل تفاصيل الفاتورة بعد إنشائها.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                onClick={() => {
                  // Generate invoice number and date
                  const invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
                  const invoiceDate = new Date().toISOString().split("T")[0];

                  // Create a temporary invoice object for preview
                  const templateInvoice = {
                    customerName: "عميل افتراضي",
                    customerPhone: "05xxxxxxxx",
                    invoiceType: "sales",
                    items: [
                      {
                        id: 1,
                        description: "شاشة iPhone 13",
                        quantity: 1,
                        price: 120,
                      },
                      {
                        id: 2,
                        description: "تغيير بطارية",
                        quantity: 1,
                        price: 45,
                      },
                      {
                        id: 3,
                        description: "حافظة حماية",
                        quantity: 1,
                        price: 15,
                      },
                    ],
                    notes: "تم إنشاء هذه الفاتورة باستخدام نموذج جاهز",
                    total: 180,
                    date: invoiceDate,
                    id: `INV-${Date.now().toString(36)}`,
                    number: invoiceNumber,
                    status: "paid",
                  };

                  // Open invoice preview
                  openInvoicePreview(
                    templateInvoice,
                    invoiceNumber,
                    invoiceDate,
                  );
                }}
              >
                <Printer className="mr-2 h-4 w-4" /> معاينة النموذج
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  // Generate invoice number and date
                  const invoiceNumber = `INV-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
                  const invoiceDate = new Date().toISOString().split("T")[0];

                  // Create a temporary invoice object
                  const templateInvoice = {
                    customerName: "عميل افتراضي",
                    customerPhone: "05xxxxxxxx",
                    invoiceType: "sales",
                    items: [
                      {
                        id: 1,
                        description: "شاشة iPhone 13",
                        quantity: 1,
                        price: 120,
                      },
                      {
                        id: 2,
                        description: "تغيير بطارية",
                        quantity: 1,
                        price: 45,
                      },
                      {
                        id: 3,
                        description: "حافظة حماية",
                        quantity: 1,
                        price: 15,
                      },
                    ],
                    notes: "تم إنشاء هذه الفاتورة باستخدام نموذج جاهز",
                    total: 180,
                    date: invoiceDate,
                    id: `INV-${Date.now().toString(36)}`,
                    number: invoiceNumber,
                    status: "paid",
                    customer: "عميل افتراضي", // إضافة اسم العميل بالتنسيق المطلوب للعرض في القائمة
                    amount: 180, // إضافة المبلغ بالتنسيق المطلوب للعرض في القائمة
                    type: "sales" as "sales" | "repair", // تحويل النوع للتنسيق المطلوب
                  };

                  // معاينة الفاتورة قبل الإنشاء
                  openInvoicePreview(
                    templateInvoice,
                    invoiceNumber,
                    invoiceDate,
                    true,
                  );
                }}
              >
                <FileText className="mr-2 h-4 w-4" /> إنشاء فاتورة من النموذج
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>تقارير الفواتير</CardTitle>
              <CardDescription>عرض وتحليل بيانات الفواتير</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      إجمالي المبيعات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-700">
                      {formatCurrency(12850)}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-blue-600">آخر 30 يوم</p>
                      <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-300">
                        +15%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      عدد الفواتير
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-700">28</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-green-600">آخر 30 يوم</p>
                      <Badge className="bg-green-200 text-green-800 hover:bg-green-300">
                        +8%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                      متوسط قيمة الفاتورة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-700">
                      {formatCurrency(459)}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-purple-600">آخر 30 يوم</p>
                      <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-300">
                        +5%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                      </svg>
                      توزيع الفواتير حسب النوع
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
                      <div className="w-full max-w-xs mx-auto">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">مبيعات</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>

                        <div className="flex justify-between mb-2 mt-4">
                          <span className="text-sm font-medium">صيانة</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{ width: "35%" }}
                          ></div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">مدفوع</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: "78%" }}
                            ></div>
                          </div>

                          <div className="flex justify-between mb-2 mt-4">
                            <span className="text-sm font-medium">
                              قيد الانتظار
                            </span>
                            <span className="text-sm font-medium">18%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-yellow-500 h-2.5 rounded-full"
                              style={{ width: "18%" }}
                            ></div>
                          </div>

                          <div className="flex justify-between mb-2 mt-4">
                            <span className="text-sm font-medium">متأخر</span>
                            <span className="text-sm font-medium">4%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-red-600 h-2.5 rounded-full"
                              style={{ width: "4%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      الفواتير حسب الشهر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-md p-4">
                      <div className="flex h-full items-end space-x-2 rtl:space-x-reverse">
                        {[
                          { month: "يناير", value: 35, color: "bg-blue-500" },
                          { month: "فبراير", value: 45, color: "bg-blue-600" },
                          { month: "مارس", value: 30, color: "bg-blue-500" },
                          { month: "أبريل", value: 55, color: "bg-blue-600" },
                          { month: "مايو", value: 65, color: "bg-blue-500" },
                          { month: "يونيو", value: 40, color: "bg-blue-600" },
                          { month: "يوليو", value: 50, color: "bg-blue-500" },
                          { month: "أغسطس", value: 75, color: "bg-blue-600" },
                          { month: "سبتمبر", value: 60, color: "bg-blue-500" },
                          { month: "أكتوبر", value: 70, color: "bg-blue-600" },
                          { month: "نوفمبر", value: 85, color: "bg-blue-500" },
                          { month: "ديسمبر", value: 90, color: "bg-blue-600" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center flex-1"
                          >
                            <div
                              className={`w-full ${item.color} rounded-t-md`}
                              style={{ height: `${item.value}%` }}
                            ></div>
                            <div className="text-xs mt-2 -rotate-45 origin-top-left">
                              {item.month}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      أعلى المبيعات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-right py-3 px-2 font-medium">
                              المنتج
                            </th>
                            <th className="text-center py-3 px-2 font-medium">
                              الكمية
                            </th>
                            <th className="text-center py-3 px-2 font-medium">
                              الإيرادات
                            </th>
                            <th className="text-center py-3 px-2 font-medium">
                              النسبة
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">شاشة iPhone 13</td>
                            <td className="py-3 px-2 text-center">42</td>
                            <td className="py-3 px-2 text-center">
                              {formatCurrency(5040)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                24%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">بطارية Samsung S21</td>
                            <td className="py-3 px-2 text-center">38</td>
                            <td className="py-3 px-2 text-center">
                              {formatCurrency(1710)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                18%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">
                              كاميرا Xiaomi Redmi Note 10
                            </td>
                            <td className="py-3 px-2 text-center">27</td>
                            <td className="py-3 px-2 text-center">
                              {formatCurrency(1350)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                12%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-2">منفذ شحن iPhone 12</td>
                            <td className="py-3 px-2 text-center">25</td>
                            <td className="py-3 px-2 text-center">
                              {formatCurrency(875)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                9%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-2">غطاء خلفي Huawei P40</td>
                            <td className="py-3 px-2 text-center">22</td>
                            <td className="py-3 px-2 text-center">
                              {formatCurrency(550)}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                7%
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button variant="outline" onClick={() => exportInvoiceToPdf({})}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                تصدير الفواتير
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> طباعة التقرير
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceSystem;
