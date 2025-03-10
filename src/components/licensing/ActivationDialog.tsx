import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getLicenseInfo,
  activateWithLicenseKey,
  LicenseInfo,
} from "@/utils/licensing";

interface ActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivationSuccess?: () => void;
}

const ActivationDialog = ({
  open,
  onOpenChange,
  onActivationSuccess,
}: ActivationDialogProps) => {
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | null>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const [activationResult, setActivationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setLicenseInfo(getLicenseInfo());
      setLicenseKey("");
      setActivationResult(null);
    }
  }, [open]);

  const handleCopyHardwareId = () => {
    if (licenseInfo) {
      navigator.clipboard.writeText(licenseInfo.hardwareId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleActivate = () => {
    if (licenseKey.trim() === "") {
      setActivationResult({
        success: false,
        message: "يرجى إدخال مفتاح الترخيص",
      });
      return;
    }

    const result = activateWithLicenseKey(licenseKey);
    setActivationResult(result);

    if (result.success) {
      // تحديث معلومات الترخيص بعد التفعيل الناجح
      setLicenseInfo(getLicenseInfo());
      if (onActivationSuccess) {
        setTimeout(() => {
          onActivationSuccess();
        }, 2000);
      }
    }
  };

  const handleGetLicense = () => {
    // في التطبيق الحقيقي، يمكن توجيه المستخدم إلى صفحة الشراء
    window.open("https://example.com/purchase", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            تفعيل البرنامج
          </DialogTitle>
          <DialogDescription>
            قم بتفعيل البرنامج للحصول على جميع الميزات والتحديثات المجانية مدى
            الحياة.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {licenseInfo?.isTrial &&
          licenseInfo.trialDaysLeft &&
          licenseInfo.trialDaysLeft > 0 ? (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md">
              <p>
                أنت حالياً في الفترة التجريبية. متبقي{" "}
                <span className="font-bold">{licenseInfo.trialDaysLeft}</span>{" "}
                يوم.
              </p>
            </div>
          ) : licenseInfo?.isActivated ? (
            <div className="bg-green-50 text-green-700 p-3 rounded-md">
              <p className="font-bold">البرنامج مفعل بالكامل!</p>
              <p>تم تفعيل البرنامج بنجاح. استمتع بجميع الميزات!</p>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-md">
              <p className="font-bold">انتهت الفترة التجريبية</p>
              <p>يرجى تفعيل البرنامج للاستمرار في استخدامه.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hardwareId">معرّف الجهاز</Label>
            <div className="flex">
              <Input
                id="hardwareId"
                value={licenseInfo?.hardwareId || ""}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button
                variant="outline"
                className="ml-2"
                onClick={handleCopyHardwareId}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              قم بنسخ معرّف الجهاز وإرساله للحصول على مفتاح التفعيل
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseKey">مفتاح الترخيص</Label>
            <Input
              id="licenseKey"
              placeholder="أدخل مفتاح الترخيص هنا"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              disabled={licenseInfo?.isActivated}
            />
          </div>

          {activationResult && (
            <div
              className={`p-3 rounded-md ${activationResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              <p>{activationResult.message}</p>
            </div>
          )}

          {licenseInfo?.isActivated && (
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <h3 className="font-bold text-lg">معلومات الترخيص</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">نوع الترخيص:</div>
                <div>ترخيص مدى الحياة</div>
                <div className="text-gray-500">تاريخ التفعيل:</div>
                <div>
                  {licenseInfo.activationDate
                    ? new Date(licenseInfo.activationDate).toLocaleDateString(
                        "ar-SA",
                      )
                    : "غير متوفر"}
                </div>
                <div className="text-gray-500">الحالة:</div>
                <div>
                  <Badge className="bg-green-100 text-green-800">مفعّل</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!licenseInfo?.isActivated && (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleGetLicense}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                الحصول على مفتاح ترخيص
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleActivate}
                disabled={licenseKey.trim() === ""}
              >
                تفعيل البرنامج
              </Button>
            </>
          )}
          {licenseInfo?.isActivated && (
            <Button onClick={() => onOpenChange(false)}>إغلاق</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivationDialog;
