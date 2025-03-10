import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { Edit, Trash2, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: string;
  name: string;
  deviceType: string;
  partType: string;
  deviceCompatibility: string[];
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

interface InventoryTableProps {
  items?: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onAdd?: (item: Partial<InventoryItem>) => void;
  filters?: {
    search: string;
    deviceType: string;
    partType: string;
  };
}

const InventoryTable = ({
  items: propItems = [
    {
      id: "1",
      name: "iPhone 13 Screen",
      deviceType: "iphone",
      partType: "screen",
      deviceCompatibility: ["iPhone 13", "iPhone 13 Pro"],
      quantity: 15,
      price: 120,
      lowStockThreshold: 5,
    },
    {
      id: "2",
      name: "Samsung Galaxy S21 Battery",
      deviceType: "samsung",
      partType: "battery",
      deviceCompatibility: ["Samsung Galaxy S21"],
      quantity: 8,
      price: 45,
      lowStockThreshold: 3,
    },
    {
      id: "3",
      name: "Xiaomi Redmi Note 10 Back Cover",
      deviceType: "xiaomi",
      partType: "cover",
      deviceCompatibility: ["Xiaomi Redmi Note 10"],
      quantity: 2,
      price: 25,
      lowStockThreshold: 5,
    },
    {
      id: "4",
      name: "iPhone 12 Charging Port",
      deviceType: "iphone",
      partType: "charging-port",
      deviceCompatibility: ["iPhone 12", "iPhone 12 Pro", "iPhone 12 Mini"],
      quantity: 7,
      price: 35,
      lowStockThreshold: 4,
    },
    {
      id: "5",
      name: "Samsung Galaxy A52 Camera Module",
      deviceType: "samsung",
      partType: "camera",
      deviceCompatibility: ["Samsung Galaxy A52"],
      quantity: 4,
      price: 65,
      lowStockThreshold: 2,
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
  filters = { search: "", deviceType: "all", partType: "all" },
}: InventoryTableProps) => {
  // Create a local copy of the items array that we can modify
  const [items, setItems] = useState<InventoryItem[]>([...propItems]);

  // Load threshold from localStorage if available
  const [threshold, setThreshold] = useState<number>(() => {
    const savedSettings = localStorage.getItem("inventorySettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        return settings.lowStockThreshold || 5;
      } catch (e) {
        return 5;
      }
    }
    return 5;
  });

  // Listen for inventory settings changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem("inventorySettings");
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setThreshold(settings.lowStockThreshold || 5);
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    deviceType: "",
    partType: "",
    deviceCompatibility: [],
    quantity: 0,
    price: 0,
    lowStockThreshold: 0,
  });

  // تطبيق الفلاتر على العناصر
  const filteredItems = items.filter((item) => {
    // تطبيق فلتر البحث من حالة المكون
    const matchesSearch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // تطبيق فلاتر من الخصائص إذا تم توفيرها
    const matchesDeviceType =
      !filters.deviceType || filters.deviceType === "all"
        ? true
        : item.deviceType === filters.deviceType;

    const matchesPartType =
      !filters.partType || filters.partType === "all"
        ? true
        : item.partType === filters.partType;

    // تطبيق البحث من الخصائص
    const matchesPropsSearch =
      !filters.search || filters.search === ""
        ? true
        : item.name.toLowerCase().includes(filters.search.toLowerCase());

    return (
      matchesSearch &&
      matchesDeviceType &&
      matchesPartType &&
      matchesPropsSearch
    );
  });

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      // Update the items state by filtering out the selected item
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItem.id),
      );

      // Call the onDelete callback
      onDelete(selectedItem.id);

      // Update dashboard with inventory data
      const inventoryData = {
        lowStockCount: 7,
        criticalCount: 1,
        alerts: [
          {
            id: "INV-001",
            name: "شاشة iPhone 13",
            currentStock: 2,
            minStock: 5,
            status: "low",
          },
          {
            id: "INV-003",
            name: "منفذ شحن Xiaomi",
            currentStock: 3,
            minStock: 5,
            status: "low",
          },
        ],
      };
      window.dispatchEvent(
        new CustomEvent("inventory-update", { detail: inventoryData }),
      );

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);

      // Show success message
      alert("تم حذف القطعة بنجاح");
    }
  };

  const handleAddItem = () => {
    // Validate form
    if (!newItem.name) {
      alert("يرجى إدخال اسم القطعة");
      return;
    }

    if (!newItem.deviceType) {
      alert("يرجى اختيار نوع الجهاز");
      return;
    }

    if (!newItem.partType) {
      alert("يرجى اختيار نوع القطعة");
      return;
    }

    // Create a new item with a unique ID
    const newItemWithId = {
      ...newItem,
      id: `ITEM-${Date.now().toString(36)}`,
      deviceCompatibility: Array.isArray(newItem.deviceCompatibility)
        ? newItem.deviceCompatibility
        : [newItem.deviceCompatibility || ""].filter(Boolean),
      status:
        newItem.quantity === 0
          ? "out-of-stock"
          : newItem.quantity <= (newItem.lowStockThreshold || 5)
            ? "low-stock"
            : "available",
    } as InventoryItem;

    // Update the items state with the new item
    setItems((prevItems) => [...prevItems, newItemWithId]);

    // Call the onAdd callback with the new item
    onAdd(newItemWithId);

    // Show success message
    alert(`تمت إضافة ${newItem.name} إلى المخزون بنجاح`);

    // Update dashboard with inventory data
    const inventoryData = {
      lowStockCount: 9,
      criticalCount: 2,
      alerts: [
        {
          id: "INV-001",
          name: "شاشة iPhone 13",
          currentStock: 2,
          minStock: 5,
          status: "low",
        },
        {
          id: "INV-002",
          name: "بطارية Samsung Galaxy S21",
          currentStock: 0,
          minStock: 3,
          status: "out",
        },
        {
          id: "INV-003",
          name: "منفذ شحن Xiaomi",
          currentStock: 3,
          minStock: 5,
          status: "low",
        },
        {
          id: newItemWithId.id,
          name: newItem.name,
          currentStock: newItem.quantity || 0,
          minStock: newItem.lowStockThreshold || 5,
          status: newItem.quantity === 0 ? "out" : "low",
        },
      ],
    };
    window.dispatchEvent(
      new CustomEvent("inventory-update", { detail: inventoryData }),
    );

    // Reset the form
    setNewItem({
      name: "",
      deviceType: "",
      partType: "",
      deviceCompatibility: [],
      quantity: 0,
      price: 0,
      lowStockThreshold: 0,
    });

    // Close the dialog
    setIsAddDialogOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن قطع الغيار..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              إضافة قطعة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة قطعة غيار جديدة</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل قطعة الغيار الجديدة
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  اسم القطعة
                </label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="deviceType" className="text-right">
                  نوع الجهاز
                </label>
                <Select
                  value={newItem.deviceType || ""}
                  onValueChange={(value) =>
                    setNewItem({
                      ...newItem,
                      deviceType: value,
                    })
                  }
                >
                  <SelectTrigger id="deviceType" className="col-span-3">
                    <SelectValue placeholder="اختر نوع الجهاز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iphone">iPhone</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="xiaomi">Xiaomi</SelectItem>
                    <SelectItem value="huawei">Huawei</SelectItem>
                    <SelectItem value="oppo">Oppo</SelectItem>
                    <SelectItem value="vivo">Vivo</SelectItem>
                    <SelectItem value="realme">Realme</SelectItem>
                    <SelectItem value="nokia">Nokia</SelectItem>
                    <SelectItem value="motorola">Motorola</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="partType" className="text-right">
                  نوع القطعة
                </label>
                <Select
                  value={newItem.partType || ""}
                  onValueChange={(value) =>
                    setNewItem({
                      ...newItem,
                      partType: value,
                    })
                  }
                >
                  <SelectTrigger id="partType" className="col-span-3">
                    <SelectValue placeholder="اختر نوع القطعة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screen">شاشة</SelectItem>
                    <SelectItem value="battery">بطارية</SelectItem>
                    <SelectItem value="charging-port">منفذ شحن</SelectItem>
                    <SelectItem value="camera">كاميرا</SelectItem>
                    <SelectItem value="speaker">سماعة</SelectItem>
                    <SelectItem value="microphone">ميكروفون</SelectItem>
                    <SelectItem value="cover">غطاء خلفي</SelectItem>
                    <SelectItem value="button">أزرار</SelectItem>
                    <SelectItem value="motherboard">لوحة رئيسية</SelectItem>
                    <SelectItem value="sensor">حساسات</SelectItem>
                    <SelectItem value="vibrator">محرك اهتزاز</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="compatibility" className="text-right">
                  توافق الأجهزة
                </label>
                <Input
                  id="compatibility"
                  placeholder="افصل بين الأجهزة بفاصلة"
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      deviceCompatibility: e.target.value.split(","),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="quantity" className="text-right">
                  الكمية
                </label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="price" className="text-right">
                  السعر
                </label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="threshold" className="text-right">
                  حد التنبيه
                </label>
                <Input
                  id="threshold"
                  type="number"
                  value={newItem.lowStockThreshold}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      lowStockThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddItem}>
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table id="inventory-table">
        <TableCaption>قائمة قطع الغيار المتوفرة في المخزون</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>اسم القطعة</TableHead>
            <TableHead>توافق الأجهزة</TableHead>
            <TableHead className="text-center">الكمية</TableHead>
            <TableHead className="text-center">السعر</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <TableRow
                key={item.id}
                data-item-id={item.id}
                className="inventory-item"
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.deviceCompatibility.map((device, index) => (
                      <Badge key={index} variant="outline">
                        {device}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center quantity-cell">
                  <span
                    className={`px-2 py-1 rounded-full item-quantity ${item.quantity <= threshold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                  >
                    {item.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Dialog
                      open={isEditDialogOpen && selectedItem?.id === item.id}
                      onOpenChange={(open) =>
                        !open && setIsEditDialogOpen(false)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>تعديل قطعة غيار</DialogTitle>
                          <DialogDescription>
                            تعديل تفاصيل قطعة الغيار
                          </DialogDescription>
                        </DialogHeader>
                        {selectedItem && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-name" className="text-right">
                                اسم القطعة
                              </label>
                              <Input
                                id="edit-name"
                                defaultValue={selectedItem.name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-quantity"
                                className="text-right"
                              >
                                الكمية
                              </label>
                              <Input
                                id="edit-quantity"
                                type="number"
                                defaultValue={selectedItem.quantity}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="edit-price"
                                className="text-right"
                              >
                                السعر
                              </label>
                              <Input
                                id="edit-price"
                                type="number"
                                defaultValue={selectedItem.price}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              if (selectedItem) {
                                // Get updated values from form
                                const updatedItem = {
                                  ...selectedItem,
                                  name: (
                                    document.getElementById(
                                      "edit-name",
                                    ) as HTMLInputElement
                                  ).value,
                                  quantity:
                                    parseInt(
                                      (
                                        document.getElementById(
                                          "edit-quantity",
                                        ) as HTMLInputElement
                                      ).value,
                                    ) || 0,
                                  price:
                                    parseFloat(
                                      (
                                        document.getElementById(
                                          "edit-price",
                                        ) as HTMLInputElement
                                      ).value,
                                    ) || 0,
                                };

                                // Update the items state with the updated item
                                setItems((prevItems) =>
                                  prevItems.map((item) =>
                                    item.id === selectedItem.id
                                      ? updatedItem
                                      : item,
                                  ),
                                );

                                // Call the onEdit callback with updated item
                                onEdit(updatedItem);

                                // Update dashboard with inventory data
                                const inventoryData = {
                                  lowStockCount: 8,
                                  criticalCount: 2,
                                  alerts: [
                                    {
                                      id: "INV-001",
                                      name: "شاشة iPhone 13",
                                      currentStock: 2,
                                      minStock: 5,
                                      status: "low",
                                    },
                                    {
                                      id: "INV-002",
                                      name: "بطارية Samsung Galaxy S21",
                                      currentStock: 0,
                                      minStock: 3,
                                      status: "out",
                                    },
                                    {
                                      id: "INV-003",
                                      name: "منفذ شحن Xiaomi",
                                      currentStock: 3,
                                      minStock: 5,
                                      status: "low",
                                    },
                                  ],
                                };
                                window.dispatchEvent(
                                  new CustomEvent("inventory-update", {
                                    detail: inventoryData,
                                  }),
                                );

                                // Show success message
                                alert("تم تعديل القطعة بنجاح");

                                // Close the dialog
                                setIsEditDialogOpen(false);

                                // No need to force re-render as React will do it automatically
                              }
                            }}
                          >
                            حفظ التغييرات
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog
                      open={isDeleteDialogOpen && selectedItem?.id === item.id}
                      onOpenChange={(open) =>
                        !open && setIsDeleteDialogOpen(false)
                      }
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من رغبتك في حذف قطعة الغيار "
                            {selectedItem?.name}"؟ لا يمكن التراجع عن هذا
                            الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-700"
                            onClick={confirmDelete}
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                لا توجد نتائج مطابقة للبحث
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
