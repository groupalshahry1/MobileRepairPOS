/**
 * وحدة التعامل مع العملات في التطبيق
 */

// الحصول على العملة المختارة من localStorage أو استخدام الدينار العراقي كقيمة افتراضية
export const getCurrentCurrency = (): string => {
  return localStorage.getItem("currency") || "iqd";
};

// تنسيق المبلغ حسب العملة المختارة
export const formatCurrency = (amount: number): string => {
  const currency = getCurrentCurrency();

  if (currency === "usd") {
    // تحويل من الدينار العراقي إلى الدولار (سعر صرف تقريبي)
    const usdAmount = amount / 1300;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usdAmount);
  } else {
    // الدينار العراقي
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
};

// رمز العملة
export const getCurrencySymbol = (): string => {
  const currency = getCurrentCurrency();
  return currency === "usd" ? "$" : "د.ع";
};
