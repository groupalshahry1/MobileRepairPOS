/**
 * Utility functions for exporting data to PDF format
 */

/**
 * Export invoices to PDF format
 * @param invoices Array of invoice data to export
 * @returns Promise that resolves when PDF is generated
 */
export const exportInvoicesToPdf = async (invoices: any[]) => {
  // This is a placeholder function that would normally use a library like jsPDF
  // or pdfmake to generate PDF files
  console.log("Exporting invoices to PDF:", invoices);

  // Simulate PDF generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create a text representation of the invoices
  const invoicesText = invoices
    .map(
      (invoice) =>
        `فاتورة رقم: ${invoice.number}\n` +
        `التاريخ: ${invoice.date}\n` +
        `العميل: ${invoice.customer}\n` +
        `النوع: ${invoice.type === "sales" ? "مبيعات" : "صيانة"}\n` +
        `المبلغ: ${invoice.amount}\n` +
        `الحالة: ${invoice.status === "paid" ? "مدفوع" : invoice.status === "pending" ? "قيد الانتظار" : "متأخر"}\n` +
        "-----------------------------------\n",
    )
    .join("\n");

  // إنشاء Blob بمحتوى النص
  const blob = new Blob([invoicesText], {
    type: "application/octet-stream;charset=utf-8",
  });

  try {
    // استخدام واجهة showSaveFilePicker إذا كانت متوفرة
    if (window.showSaveFilePicker) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "invoices.txt",
        types: [
          {
            description: "Text Files",
            accept: { "application/octet-stream": [".txt"] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert("تم تصدير الفواتير بنجاح");
    } else {
      // الطريقة التقليدية كخطة بديلة
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoices.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      alert("تم تصدير الفواتير بنجاح");
    }
  } catch (err) {
    console.error("خطأ في حفظ الملف:", err);
    // الطريقة التقليدية كخطة بديلة في حالة حدوث خطأ
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invoices.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    alert("تم تصدير الفواتير بنجاح");
  }

  return true;
};

/**
 * Export a single invoice to PDF format
 * @param invoice Invoice data to export
 * @returns Promise that resolves when PDF is generated
 */
export const exportInvoiceToPdf = async (invoice: any) => {
  console.log("Exporting invoice to PDF:", invoice);

  // Simulate PDF generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate HTML for the invoice
  const invoiceHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>فاتورة ${invoice.number}</title>
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
        .warranty-section { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 15px; margin-top: 25px; background-color: #f8fafc; }
        .warranty-title { font-weight: 700; margin-bottom: 12px; color: #475569; }
        .warranty-item { margin-bottom: 8px; color: #64748b; }
        .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
        .signature-line { border-top: 1px solid #94a3b8; width: 200px; text-align: center; padding-top: 8px; color: #64748b; }
        .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="invoice-title">📱 وكالة الموبايل</div>
        <div class="invoice-subtitle">مبيعات وصيانة أجهزة الموبايل</div>
        
        <div class="invoice-details">
          <div>
            <div><strong>🔹 اسم المحل:</strong> مكتب تاج للموبايل</div>
            <div><strong>🔹 العنوان:</strong> بغداد ناحية الرشيد مجاور مدرسة السنابل</div>
            <div><strong>🔹 رقم الهاتف:</strong> 07509931238</div>
          </div>
          <div>
            <div><strong>🔹 التاريخ:</strong> ${invoice.date}</div>
            <div><strong>🔹 رقم الفاتورة:</strong> ${invoice.number}</div>
            <div><strong>🔹 العميل:</strong> ${invoice.customer}</div>
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
          <tbody>
            <tr>
              <td>1</td>
              <td>${invoice.type === "sales" ? "مبيعات أجهزة" : "خدمة صيانة"}</td>
              <td>1</td>
              <td>${invoice.amount}</td>
              <td>${invoice.amount}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="invoice-total">🔹 المجموع الفرعي:</td>
              <td>${invoice.amount}</td>
            </tr>
            <tr>
              <td colspan="4" class="invoice-total">🔹 الخصم (إن وجد):</td>
              <td>0</td>
            </tr>
            <tr>
              <td colspan="4" class="invoice-total">🔹 الإجمالي:</td>
              <td>${invoice.amount}</td>
            </tr>
          </tfoot>
        </table>
        
        <div>
          <strong>🔹 طريقة الدفع:</strong> 
          <span>${invoice.status === "paid" ? "نقدًا" : invoice.status === "pending" ? "قيد الانتظار" : "متأخر"}</span>
        </div>
        
        <div class="warranty-section">
          <div class="warranty-title">🔧 الضمان وشروط الخدمة</div>
          <div class="warranty-item">• الأجهزة المباعة مشمولة بضمان لمدة 30 أيام ضد العيوب المصنعية.</div>
          <div class="warranty-item">• الصيانة تشمل الإصلاح وتكون مكفولة لمدة 15 أيام (في حال الضمان).</div>
          <div class="warranty-item">• لا يشمل الضمان الأعطال الناتجة عن سوء الاستخدام أو الكسر أو السوائل.</div>
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
          📞 لمزيد من المعلومات، تواصل معنا على: 07509931238<br>
          شكرًا لاختياركم مكتب تاج للموبايل! 🎉
        </div>
      </div>
    </body>
    </html>
  `;

  // تحويل HTML إلى Blob
  const blob = new Blob([invoiceHtml], {
    type: "application/octet-stream;charset=utf-8",
  });

  try {
    // استخدام واجهة showSaveFilePicker إذا كانت متوفرة
    if (window.showSaveFilePicker) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `invoice-${invoice.number}.html`,
        types: [
          {
            description: "HTML Files",
            accept: { "application/octet-stream": [".html"] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      alert(`تم تصدير الفاتورة ${invoice.number || ""} بنجاح`);
    } else {
      // الطريقة التقليدية كخطة بديلة
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `invoice-${invoice.number}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      alert(`تم تصدير الفاتورة ${invoice.number || ""} بنجاح`);
    }
  } catch (err) {
    console.error("خطأ في حفظ الملف:", err);
    // الطريقة التقليدية كخطة بديلة في حالة حدوث خطأ
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${invoice.number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    alert(`تم تصدير الفاتورة ${invoice.number || ""} بنجاح`);
  }

  return true;
};

/**
 * Export analytics report to PDF format
 * @param reportData Report data to export
 * @returns Promise that resolves when PDF is generated
 */
export const exportReportToPdf = async (reportData: any) => {
  console.log("Exporting report to PDF:", reportData);

  // Simulate PDF generation delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real implementation, this would generate and download a PDF file
  alert("تم تصدير التقرير بنجاح بصيغة PDF");

  return true;
};
