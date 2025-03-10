import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface RepairStatusFiltersProps {
  onFilterChange?: (filters: RepairFilters) => void;
}

interface RepairFilters {
  status: string;
  searchQuery: string;
  dateRange: string;
  technician: string;
}

const RepairStatusFilters = ({
  onFilterChange = () => {},
}: RepairStatusFiltersProps) => {
  const [filters, setFilters] = useState<RepairFilters>({
    status: "all",
    searchQuery: "",
    dateRange: "all",
    technician: "all",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof RepairFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update active filters list
    if (value && value !== "all" && !activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    } else if (value === "all" && activeFilters.includes(key)) {
      setActiveFilters(activeFilters.filter((filter) => filter !== key));
    }

    onFilterChange(newFilters);
  };

  const clearFilter = (key: keyof RepairFilters) => {
    handleFilterChange(key, "all");
  };

  const clearAllFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
      dateRange: "all",
      technician: "all",
    });
    setActiveFilters([]);
    onFilterChange({
      status: "all",
      searchQuery: "",
      dateRange: "all",
      technician: "all",
    });
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="بحث عن رقم الطلب، اسم العميل، أو رقم الهاتف"
            className="pl-10 w-full"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            dir="rtl"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="حالة الصيانة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="new">جديد</SelectItem>
              <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
              <SelectItem value="waiting-parts">بانتظار قطع الغيار</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="delivered">تم التسليم</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="w-full md:w-48">
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleFilterChange("dateRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفترات</SelectItem>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="yesterday">أمس</SelectItem>
              <SelectItem value="this-week">هذا الأسبوع</SelectItem>
              <SelectItem value="this-month">هذا الشهر</SelectItem>
              <SelectItem value="last-month">الشهر الماضي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Technician Filter */}
        <div className="w-full md:w-48">
          <Select
            value={filters.technician}
            onValueChange={(value) => handleFilterChange("technician", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="الفني المسؤول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفنيين</SelectItem>
              <SelectItem value="ahmed">أحمد</SelectItem>
              <SelectItem value="mohamed">محمد</SelectItem>
              <SelectItem value="ali">علي</SelectItem>
              <SelectItem value="omar">عمر</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear All Filters Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="md:self-end"
          disabled={activeFilters.length === 0 && !filters.searchQuery}
        >
          <X className="h-4 w-4 mr-2" />
          مسح الفلاتر
        </Button>
      </div>

      {/* Active Filters */}
      {(activeFilters.length > 0 || filters.searchQuery) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              بحث: {filters.searchQuery}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => handleFilterChange("searchQuery", "")}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              الحالة:{" "}
              {filters.status === "new"
                ? "جديد"
                : filters.status === "in-progress"
                  ? "قيد التنفيذ"
                  : filters.status === "waiting-parts"
                    ? "بانتظار قطع الغيار"
                    : filters.status === "completed"
                      ? "مكتمل"
                      : filters.status === "delivered"
                        ? "تم التسليم"
                        : "ملغي"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearFilter("status")}
              />
            </Badge>
          )}
          {filters.dateRange !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              الفترة:{" "}
              {filters.dateRange === "today"
                ? "اليوم"
                : filters.dateRange === "yesterday"
                  ? "أمس"
                  : filters.dateRange === "this-week"
                    ? "هذا الأسبوع"
                    : filters.dateRange === "this-month"
                      ? "هذا الشهر"
                      : "الشهر الماضي"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearFilter("dateRange")}
              />
            </Badge>
          )}
          {filters.technician !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              الفني:{" "}
              {filters.technician === "ahmed"
                ? "أحمد"
                : filters.technician === "mohamed"
                  ? "محمد"
                  : filters.technician === "ali"
                    ? "علي"
                    : "عمر"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearFilter("technician")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairStatusFilters;
