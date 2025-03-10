/**
 * نظام التراخيص والتفعيل
 */

// واجهة لمعلومات الترخيص
export interface LicenseInfo {
  isActivated: boolean;
  isTrial: boolean;
  trialDaysLeft?: number;
  activationDate?: string;
  hardwareId: string;
  licenseKey?: string;
  expiryDate?: string;
}

// استخراج معرف فريد للجهاز
export const generateHardwareId = (): string => {
  // في التطبيق الحقيقي، يجب استخدام معلومات الأجهزة الفعلية
  // هنا نستخدم محاكاة بسيطة لإنشاء معرف
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HW-${randomPart}-${Date.now().toString(36).substring(4, 8).toUpperCase()}`;
};

// التحقق من صلاحية الفترة التجريبية
export const checkTrialValidity = (): {
  isValid: boolean;
  daysLeft: number;
} => {
  // في التطبيق الحقيقي، يجب التحقق من تاريخ التثبيت المخزن
  // هنا نستخدم محاكاة بسيطة
  const installDate = localStorage.getItem("installDate");

  if (!installDate) {
    // إذا لم يكن هناك تاريخ تثبيت، قم بتعيينه الآن
    localStorage.setItem("installDate", new Date().toISOString());
    return { isValid: true, daysLeft: 30 };
  }

  const trialPeriodDays = 30;
  const installDateTime = new Date(installDate).getTime();
  const currentDateTime = new Date().getTime();
  const elapsedDays = Math.floor(
    (currentDateTime - installDateTime) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = Math.max(0, trialPeriodDays - elapsedDays);

  return { isValid: daysLeft > 0, daysLeft };
};

// التحقق من صحة مفتاح التفعيل
export const validateLicenseKey = (
  licenseKey: string,
  hardwareId: string,
): boolean => {
  // في التطبيق الحقيقي، يجب التحقق من المفتاح باستخدام خوارزمية تشفير
  // هنا نستخدم محاكاة بسيطة للتحقق
  if (!licenseKey || licenseKey.length < 16) return false;

  // تحقق بسيط: يجب أن يحتوي المفتاح على جزء من معرف الجهاز
  const hardwareIdPart = hardwareId.substring(3, 7);
  return licenseKey.includes(hardwareIdPart);
};

// حفظ معلومات التفعيل
export const saveLicenseInfo = (licenseInfo: LicenseInfo): void => {
  // في التطبيق الحقيقي، يجب تشفير هذه المعلومات وحفظها في مكان آمن
  // هنا نستخدم localStorage للمحاكاة
  localStorage.setItem("licenseInfo", JSON.stringify(licenseInfo));
};

// استرجاع معلومات التفعيل
export const getLicenseInfo = (): LicenseInfo => {
  // في التطبيق الحقيقي، يجب فك تشفير المعلومات من مكان آمن
  // هنا نستخدم localStorage للمحاكاة
  const storedInfo = localStorage.getItem("licenseInfo");

  if (storedInfo) {
    return JSON.parse(storedInfo) as LicenseInfo;
  }

  // إذا لم تكن هناك معلومات مخزنة، قم بإنشاء معلومات جديدة
  const hardwareId = generateHardwareId();
  const trialValidity = checkTrialValidity();

  const newLicenseInfo: LicenseInfo = {
    isActivated: false,
    isTrial: true,
    trialDaysLeft: trialValidity.daysLeft,
    hardwareId,
  };

  saveLicenseInfo(newLicenseInfo);
  return newLicenseInfo;
};

// تفعيل البرنامج باستخدام مفتاح الترخيص
export const activateWithLicenseKey = (
  licenseKey: string,
): { success: boolean; message: string } => {
  const licenseInfo = getLicenseInfo();

  if (validateLicenseKey(licenseKey, licenseInfo.hardwareId)) {
    // تحديث معلومات الترخيص
    const updatedInfo: LicenseInfo = {
      ...licenseInfo,
      isActivated: true,
      isTrial: false,
      activationDate: new Date().toISOString(),
      licenseKey: licenseKey,
      // في حالة الترخيص مدى الحياة، لا نضع تاريخ انتهاء
    };

    saveLicenseInfo(updatedInfo);
    return { success: true, message: "تم تفعيل البرنامج بنجاح!" };
  }

  return {
    success: false,
    message: "مفتاح الترخيص غير صالح. يرجى التحقق والمحاولة مرة أخرى.",
  };
};

// التحقق من حالة الترخيص عند بدء التشغيل
export const checkLicenseStatus = (): {
  isActivated: boolean;
  isTrial: boolean;
  daysLeft?: number;
  message: string;
} => {
  const licenseInfo = getLicenseInfo();

  if (licenseInfo.isActivated) {
    return {
      isActivated: true,
      isTrial: false,
      message: "البرنامج مفعل بالكامل",
    };
  }

  // التحقق من صلاحية الفترة التجريبية
  const trialValidity = checkTrialValidity();

  if (trialValidity.isValid) {
    // تحديث عدد الأيام المتبقية
    licenseInfo.trialDaysLeft = trialValidity.daysLeft;
    saveLicenseInfo(licenseInfo);

    return {
      isActivated: false,
      isTrial: true,
      daysLeft: trialValidity.daysLeft,
      message: `النسخة التجريبية: متبقي ${trialValidity.daysLeft} يوم`,
    };
  }

  return {
    isActivated: false,
    isTrial: false,
    daysLeft: 0,
    message: "انتهت الفترة التجريبية. يرجى تفعيل البرنامج للاستمرار.",
  };
};
