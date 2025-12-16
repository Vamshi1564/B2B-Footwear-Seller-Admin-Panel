import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Percent,
  Calendar,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000/api/coupons";

/* ================= UI TYPE ================= */
export interface CouponUI {
  id: number;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder: number;
  validFrom: string;
  validTo: string;
  status: "active" | "inactive";
}


export default function AdminCoupons() {
  const { toast } = useToast();

  /* ================= STATE ================= */
  const [coupons, setCoupons] = useState<CouponUI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [active, setActive] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [editingCoupon, setEditingCoupon] = useState<CouponUI | null>(null);
const isExpired = (coupon: CouponUI) => {
  const today = new Date();
  const endDate = new Date(coupon.validTo);
  return endDate < today;
};

const openEditDialog = (coupon: CouponUI) => {
  setEditingCoupon(coupon);

  setCode(coupon.code);
  setDiscount(coupon.discountPercent);
  setMinOrder(coupon.minOrder);
  setValidFrom(coupon.validFrom.slice(0, 10));
  setValidTo(coupon.validTo.slice(0, 10));
  setActive(coupon.status === "active");

  setIsEditDialogOpen(true);
};

/* ================= DATE FORMAT ================= */
const formatDate = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

  /* ================= LOAD ================= */
const loadCoupons = async () => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }



    const data = await res.json();
const mapped: CouponUI[] = data.map((c: any) => ({
  id: c.id,
  code: c.code,
  discountPercent: Number(c.discount_value),
  maxDiscount: undefined,
  minOrder: Number(c.min_order_value),
  validFrom: c.start_date,
  validTo: c.end_date,
  status: c.status, // ✅ TAKE FROM BACKEND
}));



    setCoupons(mapped);
  } catch (err) {
    console.error(err);
    toast({
      title: "Backend Error",
      description: "Failed to load coupons",
      variant: "destructive",
    });
  }
};


  useEffect(() => {
    loadCoupons();
  }, []);

  /* ================= FILTER ================= */
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================= FORMAT ================= */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  /* ================= CREATE ================= */
  const handleCreateCoupon = async () => {
  const statusValue: "active" | "inactive" = active ? "active" : "inactive";

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      discount_type: "percent",
      discount_value: discount,
      min_order_value: minOrder,
      start_date: validFrom,
      end_date: validTo,
      status: statusValue, // ✅ FIXED
    }),
  });




  const data = await res.json();

  if (!res.ok) {
    toast({
      title: "Error",
      description: data.message || "Failed to create coupon",
      variant: "destructive",
    });
    return;
  }

  toast({ title: "Coupon Created Successfully" });

  setIsAddDialogOpen(false);
  setCode("");
  setDiscount(0);
  setMinOrder(0);
  setValidFrom("");
  setValidTo("");
  setActive(true);

  loadCoupons();
};

const handleUpdateCoupon = async () => {
  if (!editingCoupon) return;

  const statusValue: "active" | "inactive" = active ? "active" : "inactive";

  const res = await fetch(`${API_URL}/${editingCoupon.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      discount_type: "percent",
      discount_value: Number(discount),
      min_order_value: Number(minOrder),
      start_date: validFrom,
      end_date: validTo,
      status: statusValue,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast({
      title: "Update Failed",
      description: data.message || "Failed to update coupon",
      variant: "destructive",
    });
    return;
  }

  toast({ title: "Coupon Updated Successfully" });

  setIsEditDialogOpen(false);
  setEditingCoupon(null);
  loadCoupons();
};


  /* ================= DELETE ================= */
  const handleDelete = async (coupon: CouponUI) => {
    await fetch(`${API_URL}/${coupon.id}`, { method: "DELETE" });

    toast({
      title: "Coupon Deleted",
      description: `Coupon ${coupon.code} removed`,
      variant: "destructive",
    });

    loadCoupons();
  };

  /* ================= TABLE ================= */
  const columns: Column<CouponUI>[] = [
  {
    key: 'code',
    header: 'Coupon Code',
    render: (coupon) => (
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-accent" />
        <span className="font-mono font-bold text-primary">
          {coupon.code}
        </span>
      </div>
    ),
  },
  {
    key: 'discount',
    header: 'Discount',
    render: (coupon) => (
      <p className="font-semibold">{coupon.discountPercent}% OFF</p>
    ),
  },
  {
  key: 'minOrder',
  header: 'Min. Order',
  render: (coupon) => (
    <p className="font-semibold">
      {formatCurrency(coupon.minOrder)}
    </p>
  ),
},
  {
  key: 'validity',
  header: 'Validity',
  render: (coupon) => (
    <div className="text-sm font-semibold">
      <p>{formatDate(coupon.validFrom)}</p>
      <p className="text-sm font-semibold">
        to {formatDate(coupon.validTo)}
      </p>
    </div>
  ),
},
  {
    key: 'status',
    header: 'Status',
    render: (coupon) => (
  <StatusBadge
    status={isExpired(coupon) ? "inactive" : coupon.status}
  />
),

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (coupon) => (
      <div className="flex gap-1">
        <Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => openEditDialog(coupon)}
>
  <Edit className="w-4 h-4" />
</Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => handleDelete(coupon)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];


  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Coupons & Schemes</h1>
            <p className="text-muted-foreground">Manage discount coupons and promotional schemes</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., SUMMER20" className="uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input id="discount" type="number"  value={discount}
                      onChange={(e) => setDiscount(+e.target.value)} placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxDiscount">Max Discount (₹)</Label>
                    <Input id="maxDiscount" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minOrder">Min. Order Value (₹)</Label>
                  <Input id="minOrder" type="number" value={minOrder}
                      onChange={(e) => setMinOrder(+e.target.value)} placeholder="0" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input id="validFrom" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input id="validTo" type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label htmlFor="active">Active</Label>
                  <Switch id="active" checked={active} onCheckedChange={setActive} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary" onClick={handleCreateCoupon} >Create Coupon</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Coupon</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Coupon Code</Label>
        <Input value={code} onChange={(e) => setCode(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Discount %</Label>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(+e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Min Order (₹)</Label>
          <Input
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(+e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Valid From</Label>
          <Input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Valid To</Label>
          <Input
            type="date"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Label>Active</Label>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button className="gradient-primary" onClick={handleUpdateCoupon}>
          Update Coupon
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
  {[
    {
      label: "Total Coupons",
      count: coupons.length,
      icon: Tag,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      count: coupons.filter(
  (c) => c.status === "active" && !isExpired(c)
).length,
      icon: Percent,
      color: "bg-success/10 text-success",
    },
    {
      label: "Expired",
      count: coupons.filter((c) => isExpired(c)).length,

      icon: Calendar,
      color: "bg-muted text-muted-foreground",
    },
  ].map((stat) => (
    <Card key={stat.label} className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
          >
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>


        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search coupons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Coupons Table */}
        <DataTable
          columns={columns}
          data={filteredCoupons}
          emptyMessage="No coupons found"
        />
      </div>
    </DashboardLayout>
  );
}
