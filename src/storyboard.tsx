import React, { useState } from "react";
import ActivationDialog from "./components/licensing/ActivationDialog";
import ActivationSuccess from "./components/licensing/ActivationSuccess";
import DeveloperInfo from "./components/about/DeveloperInfo";
import AboutDialog from "./components/about/AboutDialog";
import { Button } from "./components/ui/button";

export default function Storyboard() {
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showActivationSuccess, setShowActivationSuccess] = useState(false);
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h1 className="text-2xl font-bold">نظام التفعيل والترخيص</h1>
          <p>اختبار مكونات نظام التفعيل والترخيص</p>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowActivationDialog(true)}>
              عرض نافذة التفعيل
            </Button>
            <Button onClick={() => setShowActivationSuccess(true)}>
              عرض رسالة التفعيل الناجح
            </Button>
            <Button onClick={() => setShowDeveloperInfo(true)}>
              عرض معلومات المطور
            </Button>
            <Button onClick={() => setShowAboutDialog(true)}>
              عرض معلومات البرنامج
            </Button>
          </div>
        </div>
      </div>

      <ActivationDialog
        open={showActivationDialog}
        onOpenChange={setShowActivationDialog}
      />

      <ActivationSuccess
        open={showActivationSuccess}
        onOpenChange={setShowActivationSuccess}
      />

      <DeveloperInfo
        open={showDeveloperInfo}
        onOpenChange={setShowDeveloperInfo}
      />

      <AboutDialog open={showAboutDialog} onOpenChange={setShowAboutDialog} />
    </div>
  );
}
