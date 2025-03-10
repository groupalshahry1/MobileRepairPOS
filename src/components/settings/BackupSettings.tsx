import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Download,
  Upload,
  Save,
  HardDrive,
  Cloud,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

interface BackupSettingsProps {
  onBackupCreated?: (location: string, path: string) => void;
  onBackupRestored?: (success: boolean) => void;
}

const BackupSettings = ({
  onBackupCreated = () => {},
  onBackupRestored = () => {},
}: BackupSettingsProps) => {
  const [backupLocation, setBackupLocation] = useState<string>("local");
  const [localPath, setLocalPath] = useState<string>("");
  const [maxBackups, setMaxBackups] = useState<string>("5");
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] =
    useState<boolean>(false);
  const [showBackupDialog, setShowBackupDialog] = useState<boolean>(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState<boolean>(false);
  const [backupInProgress, setBackupInProgress] = useState<boolean>(false);
  const [restoreInProgress, setRestoreInProgress] = useState<boolean>(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  // مسار النسخة الاحتياطية الافتراضي
  const defaultBackupPath = "/Documents/MobileShopBackups";

  // محاكاة اختيار المجلد
  const handleSelectFolder = () => {
    // في التطبيق الحقيقي، هنا سيتم فتح مربع حوار لاختيار المجلد
    setTimeout(() => {
      setLocalPath(defaultBackupPath);
    }, 500);
  };

  // محاكاة الاتصال بـ Google Drive
  const handleConnectGoogleDrive = () => {
    setBackupInProgress(true);
    // محاكاة عملية الاتصال
    setTimeout(() => {
      setIsGoogleDriveConnected(true);
      setBackupInProgress(false);
    }, 2000);
  };

  // محاكاة إنشاء نسخة احتياطية
  const handleCreateBackup = () => {
    setBackupInProgress(true);
    // محاكاة عملية النسخ الاحتياطي
    setTimeout(() => {
      const now = new Date();
      setLastBackupDate(now.toLocaleString("ar-IQ"));
      setBackupInProgress(false);
      setShowBackupDialog(false);
      onBackupCreated(
        backupLocation,
        backupLocation === "local" ? localPath : "Google Drive",
      );
    }, 3000);
  };

  // محاكاة استعادة نسخة احتياطية
  const handleRestoreBackup = () => {
    setRestoreInProgress(true);
    // محاكاة عملية الاستعادة
    setTimeout(() => {
      setRestoreInProgress(false);
      setShowRestoreDialog(false);
      onBackupRestored(true);
    }, 3000);
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات النسخ الاحتياطي</CardTitle>
          <CardDescription>
            قم بإعداد النسخ الاحتياطي واستعادة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>موقع تخزين النسخ الاحتياطي</Label>
              <Select value={backupLocation} onValueChange={setBackupLocation}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="اختر موقع التخزين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2" />
                      <span>تخزين محلي (على جهازك)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="google-drive">
                    <div className="flex items-center">
                      <Cloud className="h-4 w-4 mr-2" />
                      <span>Google Drive (على حسابك)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {backupLocation === "local" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="localPath">مسار التخزين المحلي</Label>
                  <div className="flex gap-2">
                    <Input
                      id="localPath"
                      value={localPath}
                      onChange={(e) => setLocalPath(e.target.value)}
                      placeholder="اختر مجلد لحفظ النسخ الاحتياطية"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSelectFolder}
                    >
                      تصفح
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxBackups">عدد النسخ المحتفظ بها</Label>
                  <Select value={maxBackups} onValueChange={setMaxBackups}>
                    <SelectTrigger id="maxBackups" className="w-full">
                      <SelectValue placeholder="اختر العدد" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 نسخ</SelectItem>
                      <SelectItem value="5">5 نسخ</SelectItem>
                      <SelectItem value="10">10 نسخ</SelectItem>
                      <SelectItem value="0">الاحتفاظ بجميع النسخ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Google Drive</span>
                    </div>
                    {isGoogleDriveConnected ? (
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>متصل</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>غير متصل</span>
                      </div>
                    )}
                  </div>

                  {!isGoogleDriveConnected && (
                    <div className="mt-4">
                      <Button
                        onClick={handleConnectGoogleDrive}
                        disabled={backupInProgress}
                      >
                        {backupInProgress ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            جاري الاتصال...
                          </>
                        ) : (
                          <>الاتصال بـ Google Drive</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {isGoogleDriveConnected && (
                  <div className="space-y-2">
                    <Label htmlFor="maxBackups">عدد النسخ المحتفظ بها</Label>
                    <Select value={maxBackups} onValueChange={setMaxBackups}>
                      <SelectTrigger id="maxBackups" className="w-full">
                        <SelectValue placeholder="اختر العدد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 نسخ</SelectItem>
                        <SelectItem value="5">5 نسخ</SelectItem>
                        <SelectItem value="10">10 نسخ</SelectItem>
                        <SelectItem value="0">الاحتفاظ بجميع النسخ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {lastBackupDate && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md">
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>آخر نسخة احتياطية: {lastBackupDate}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog
            open={showBackupDialog}
            onOpenChange={setShowBackupDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                disabled={
                  (backupLocation === "local" && !localPath) ||
                  (backupLocation === "google-drive" &&
                    !isGoogleDriveConnected) ||
                  backupInProgress
                }
              >
                <Save className="h-4 w-4 mr-2" />
                إنشاء نسخة احتياطية
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>إنشاء نسخة احتياطية</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من رغبتك في إنشاء نسخة احتياطية جديدة؟ سيتم حفظ
                  جميع بيانات التطبيق الحالية.
                  <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>
                        سيتم حفظ النسخة الاحتياطية في:{" "}
                        {backupLocation === "local"
                          ? localPath
                          : "Google Drive"}
                      </span>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCreateBackup}
                  disabled={backupInProgress}
                >
                  {backupInProgress ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      جاري النسخ...
                    </>
                  ) : (
                    <>إنشاء النسخة الاحتياطية</>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={showRestoreDialog}
            onOpenChange={setShowRestoreDialog}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={
                  (backupLocation === "local" && !localPath) ||
                  (backupLocation === "google-drive" &&
                    !isGoogleDriveConnected) ||
                  restoreInProgress
                }
              >
                <Upload className="h-4 w-4 mr-2" />
                استعادة نسخة احتياطية
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>استعادة نسخة احتياطية</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-4">
                    <p>
                      هل أنت متأكد من رغبتك في استعادة نسخة احتياطية؟ سيتم
                      استبدال جميع البيانات الحالية بالبيانات من النسخة
                      الاحتياطية.
                    </p>
                    <div className="p-2 bg-amber-50 text-amber-700 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span>
                          تحذير: سيتم فقدان أي تغييرات غير محفوظة في نسخة
                          احتياطية.
                        </span>
                      </div>
                    </div>
                    <div className="p-2 border rounded-md">
                      <Label>اختر نسخة احتياطية للاستعادة:</Label>
                      <Select defaultValue="latest">
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="اختر نسخة احتياطية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">
                            آخر نسخة احتياطية (15-06-2023 10:30)
                          </SelectItem>
                          <SelectItem value="backup1">
                            14-06-2023 14:45
                          </SelectItem>
                          <SelectItem value="backup2">
                            13-06-2023 09:15
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestoreBackup}
                  disabled={restoreInProgress}
                >
                  {restoreInProgress ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      جاري الاستعادة...
                    </>
                  ) : (
                    <>استعادة النسخة الاحتياطية</>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BackupSettings;
