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
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react";

interface DeveloperInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeveloperInfo = ({ open, onOpenChange }: DeveloperInfoProps) => {
  // معلومات المطور - في التطبيق الحقيقي يمكن تحميلها من ملف خارجي
  const developer = {
    name: "اسم المطور",
    title: "مطور برمجيات ومؤسس شركة البرمجيات",
    bio: "مطور برمجيات بخبرة 10 سنوات في تطوير تطبيقات سطح المكتب والويب. متخصص في تطوير حلول برمجية مبتكرة لقطاع الأعمال مع التركيز على تجربة المستخدم وسهولة الاستخدام.",
    website: "https://www.example.com",
    email: "developer@example.com",
    imagePath: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
    socialMedia: {
      twitter: "https://twitter.com/username",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
    skills: ["React", "TypeScript", "Node.js", "UI/UX", "Electron"],
    projects: [
      {
        name: "برنامج إدارة المخزون",
        description: "نظام متكامل لإدارة المخزون والمبيعات",
      },
      {
        name: "تطبيق إدارة المهام",
        description: "تطبيق لإدارة المهام والمشاريع",
      },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">حول المطور</DialogTitle>
          <DialogDescription>معلومات عن مطور البرنامج</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={developer.imagePath}
                alt={developer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-center md:text-right flex-1">
              <div>
                <h3 className="text-xl font-bold">{developer.name}</h3>
                <p className="text-gray-500">{developer.title}</p>
              </div>

              <p className="text-sm">{developer.bio}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {developer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">معلومات الاتصال</h4>
              <div className="space-y-2">
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {developer.website}
                </a>
                <a
                  href={`mailto:${developer.email}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {developer.email}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">مواقع التواصل الاجتماعي</h4>
              <div className="space-y-2">
                <a
                  href={developer.socialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
                <a
                  href={developer.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
                <a
                  href={developer.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">مشاريع سابقة</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {developer.projects.map((project, index) => (
                <div
                  key={index}
                  className="border rounded-md p-3 hover:bg-gray-50"
                >
                  <h5 className="font-medium">{project.name}</h5>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => window.open(developer.website, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            زيارة الموقع
          </Button>
          <Button onClick={() => onOpenChange(false)}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperInfo;
