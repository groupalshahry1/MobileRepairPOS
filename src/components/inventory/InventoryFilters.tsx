import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface InventoryFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    deviceType: string;
    partType: string;
  }) => void;
}

const InventoryFilters = ({
  onFilterChange = () => {},
}: InventoryFiltersProps) => {
  const [search, setSearch] = useState("");
  const [deviceType, setDeviceType] = useState("all");
  const [partType, setPartType] = useState("all");

  // Mock device types for the dropdown
  const deviceTypes = [
    { value: "all", label: "جميع الأجهزة" },
    { value: "iphone", label: "iPhone" },
    { value: "samsung", label: "Samsung" },
    { value: "xiaomi", label: "Xiaomi" },
    { value: "huawei", label: "Huawei" },
    { value: "oppo", label: "Oppo" },
    { value: "vivo", label: "Vivo" },
    { value: "realme", label: "Realme" },
    { value: "nokia", label: "Nokia" },
    { value: "motorola", label: "Motorola" },
    { value: "other", label: "أخرى" },
  ];

  // Mock part types for the dropdown
  const partTypes = [
    { value: "all", label: "جميع القطع" },
    { value: "screen", label: "شاشة" },
    { value: "battery", label: "بطارية" },
    { value: "charging-port", label: "منفذ شحن" },
    { value: "camera", label: "كاميرا" },
    { value: "speaker", label: "سماعة" },
    { value: "microphone", label: "ميكروفون" },
    { value: "cover", label: "غطاء خلفي" },
    { value: "button", label: "أزرار" },
    { value: "motherboard", label: "لوحة رئيسية" },
    { value: "sensor", label: "حساسات" },
    { value: "vibrator", label: "محرك اهتزاز" },
    { value: "other", label: "أخرى" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, deviceType, partType });
  };

  const handleDeviceTypeChange = (value: string) => {
    setDeviceType(value);
    onFilterChange({ search, deviceType: value, partType });
  };

  const handlePartTypeChange = (value: string) => {
    setPartType(value);
    onFilterChange({ search, deviceType, partType: value });
  };

  const handleReset = () => {
    setSearch("");
    setDeviceType("all");
    setPartType("all");
    onFilterChange({ search: "", deviceType: "all", partType: "all" });
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث عن قطع الغيار..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9 text-right"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={deviceType} onValueChange={handleDeviceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الجهاز" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((device) => (
                  <SelectItem key={device.value} value={device.value}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <Select value={partType} onValueChange={handlePartTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="نوع القطعة" />
              </SelectTrigger>
              <SelectContent>
                {partTypes.map((part) => (
                  <SelectItem key={part.value} value={part.value}>
                    {part.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={handleReset}
            className="whitespace-nowrap"
          >
            <Filter className="mr-2 h-4 w-4" />
            إعادة ضبط
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
