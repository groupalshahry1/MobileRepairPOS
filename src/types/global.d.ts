// إضافة تعريفات للواجهات البرمجية غير المدعومة بشكل افتراضي في TypeScript

interface Window {
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<any>;
}
