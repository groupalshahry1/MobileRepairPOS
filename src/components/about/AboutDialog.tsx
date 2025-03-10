import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Info } from "lucide-react";
import { getLicenseInfo } from "@/utils/licensing";
import DeveloperInfo from "./DeveloperInfo";
import ActivationDialog from "../licensing/ActivationDialog";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [showActivationDialog, setShowActivationDialog] = useState(false);

  const licenseInfo = getLicenseInfo();

  // معلومات البرنامج
  const appInfo = {
    name: "وكالة الموبايل",
    version: "1.0.0",
    releaseDate: "2023-06-15",
    description: "نظام متكامل لإدارة وكالة قطع غيار وصيانة الهواتف المحمولة",
    features: [
      "إدارة المخزون",
      "إدارة الصيانة",
      "إصدار الفواتير",
      "إدارة العملاء",
      "تقارير وإحصائيات",
      "تكامل مع الواتساب",
    ],
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              حول البرنامج
            </DialogTitle>
            <DialogDescription>معلومات عن البرنامج والترخيص</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center">
              <img src="/vite.svg" alt="شعار البرنامج" className="h-20 w-20" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{appInfo.name}</h2>
              <p className="text-gray-500">
                الإصدار {appInfo.version} | تاريخ الإصدار:{" "}
                {new Date(appInfo.releaseDate).toLocaleDateString("ar-SA")}
              </p>
            </div>

            <p className="text-center">{appInfo.description}</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {appInfo.features.map((feature) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <h3 className="font-bold">معلومات الترخيص</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">نوع الترخيص:</div>
                <div>
                  {licenseInfo.isActivated
                    ? "ترخيص مدى الحياة"
                    : "نسخة تجريبية"}
                </div>
                <div className="text-gray-500">الحالة:</div>
                <div>
                  {licenseInfo.isActivated ? (
                    <Badge className="bg-green-100 text-green-800">مفعّل</Badge>
                  ) : licenseInfo.isTrial ? (
                    <Badge className="bg-blue-100 text-blue-800">
                      تجريبي ({licenseInfo.trialDaysLeft} يوم متبقي)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">منتهي</Badge>
                  )}
                </div>
                {licenseInfo.isActivated && (
                  <>
                    <div className="text-gray-500">تاريخ التفعيل:</div>
                    <div>
                      {licenseInfo.activationDate
                        ? new Date(
                            licenseInfo.activationDate,
                          ).toLocaleDateString("ar-SA")
                        : "غير متوفر"}
                    </div>
                  </>
                )}
                <div className="text-gray-500">معرّف الجهاز:</div>
                <div className="font-mono text-xs">
                  {licenseInfo.hardwareId}
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>جميع الحقوق محفوظة © 2023</p>
              <p>تم التطوير بواسطة فريق وكالة الموبايل</p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                setShowDeveloperInfo(true);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              حول المطور
            </Button>
            {!licenseInfo.isActivated && (
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  onOpenChange(false);
                  setShowActivationDialog(true);
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                تفعيل البرنامج
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeveloperInfo
        open={showDeveloperInfo}
        onOpenChange={setShowDeveloperInfo}
      />

      <ActivationDialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
      />
    </>
  );
};

export default AboutDialog;
