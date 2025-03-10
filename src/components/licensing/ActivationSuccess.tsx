import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import { getLicenseInfo } from "@/utils/licensing";

interface ActivationSuccessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivationSuccess = ({ open, onOpenChange }: ActivationSuccessProps) => {
  const licenseInfo = getLicenseInfo();

  const handleDownloadCertificate = () => {
    // في التطبيق الحقيقي، يمكن إنشاء شهادة PDF وتنزيلها
    alert("جاري تنزيل شهادة التفعيل...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            تهانينا! 🎉
          </DialogTitle>
          <DialogDescription className="text-center">
            تم تفعيل البرنامج بنجاح مدى الحياة على هذا الجهاز.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <CheckCircle className="h-24 w-24 text-green-500" />
          </div>

          <div className="space-y-4 text-center">
            <p className="font-medium">أصبح لديك الآن:</p>
            <ul className="space-y-2 text-left">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                استخدام كامل لجميع الميزات
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                تحديثات مجانية مدى الحياة
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                دعم فني متواصل
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">معرّف الجهاز:</div>
              <div className="font-mono">{licenseInfo.hardwareId}</div>
              <div className="text-gray-500">تاريخ التفعيل:</div>
              <div>
                {licenseInfo.activationDate
                  ? new Date(licenseInfo.activationDate).toLocaleDateString(
                      "ar-SA",
                    )
                  : "غير متوفر"}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            ملاحظة: هذا الترخيص صالح فقط على هذا الجهاز.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleDownloadCertificate}
          >
            <Download className="h-4 w-4 mr-2" />
            تنزيل شهادة التفعيل
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            بدء الاستخدام
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivationSuccess;
