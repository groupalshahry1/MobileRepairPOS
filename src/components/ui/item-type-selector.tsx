import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ItemTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ItemTypeSelector({
  value,
  onValueChange,
}: ItemTypeSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="flex space-x-4 rtl:space-x-reverse"
    >
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="repair" id="repair" />
        <Label htmlFor="repair">صيانة</Label>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="sales" id="sales" />
        <Label htmlFor="sales">مبيعات</Label>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="both" id="both" />
        <Label htmlFor="both">كلاهما</Label>
      </div>
    </RadioGroup>
  );
}
