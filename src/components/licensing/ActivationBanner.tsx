import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import { checkLicenseStatus } from "@/utils/licensing";
import ActivationDialog from "./ActivationDialog";

const ActivationBanner = () => {
  const [licenseStatus, setLicenseStatus] = useState<{
    isActivated: boolean;
    isTrial: boolean;
    daysLeft?: number;
    message: string;
  } | null>(null);
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  useEffect(() => {
    // التحقق من حالة الترخيص عند تحميل المكون
    const status = checkLicenseStatus();
    setLicenseStatus(status);

    // إذا انتهت الفترة التجريبية، اعرض نافذة التفعيل تلقائياً
    if (!status.isActivated && !status.isTrial) {
      setShowActivationDialog(true);
    }
  }, []);

  const handleActivationSuccess = () => {
    // تحديث حالة الترخيص بعد التفعيل الناجح
    const status = checkLicenseStatus();
    setLicenseStatus(status);
    setShowActivationDialog(false);
  };

  if (!licenseStatus) return null;

  // إذا كان البرنامج مفعلاً، لا تعرض الشريط
  if (licenseStatus.isActivated) return null;

  return (
    <>
      <div
        className={`w-full py-2 px-4 flex justify-between items-center ${licenseStatus.isTrial ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}
      >
        <div className="flex items-center">
          {licenseStatus.isTrial ? (
            <Shield className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span>{licenseStatus.message}</span>
        </div>
        <Button
          variant={licenseStatus.isTrial ? "outline" : "default"}
          size="sm"
          onClick={() => setShowActivationDialog(true)}
        >
          تفعيل البرنامج
        </Button>
      </div>

      <ActivationDialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
        onActivationSuccess={handleActivationSuccess}
      />
    </>
  );
};

export default ActivationBanner;
