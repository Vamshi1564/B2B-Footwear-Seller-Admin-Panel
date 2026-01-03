import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Seller } from "@/types";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Eye,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MapPin,
  Package,
  Building2,
  Truck,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

export default function AdminSellers() {
  const { toast } = useToast();

  /* ================= STATES ================= */
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editSeller, setEditSeller] = useState<EditableSeller | null>(null);
  const formatDateIN = (dateString: string) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openEditDialog = (seller: Seller) => {
    setEditSeller({
      ...seller,
      pincodeInput: seller.pincodes.join(", "),
    });
    setIsEditDialogOpen(true);
  };

  type EditableSeller = Seller & {
    pincodeInput: string;
  };

  /* Add Seller Form */
  const [newSeller, setNewSeller] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    gstNumber: "",
    pan: "",
    moq: 0,
    deliveryCharge: 0,
    pincodes: [] as string[],
    pincodeInput: "", // 👈 NEW
  });

  /* ================= FETCH SELLERS ================= */
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sellers");
      const data = await res.json();

      const mapped: Seller[] = data.map((s: any) => ({
        id: s.id,
        businessName: s.businessName,
        ownerName: s.ownerName,
        email: s.email,
        phone: s.phone,
        status: s.status,
        approvalStatus: s.approval_status,
        gstNumber: s.gstNumber,
        pan: s.pan,
        createdAt: s.created_at,
        moq: s.moq || 0,
        deliveryCharge: s.deliveryCharge || 0,
        pincodes: s.pincodes || [],
      }));

      setSellers(mapped);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load sellers",
        variant: "destructive",
      });
    }
  };

  /* ================= ADD SELLER ================= */
  const handleAddSeller = async () => {
    try {
      const payload = {
        businessName: newSeller.businessName.trim(),
        ownerName: newSeller.ownerName.trim(),
        email: newSeller.email.trim(),
        phone: newSeller.phone.trim(),
        password: newSeller.password,

        gstNumber: newSeller.gstNumber || null,
        pan: newSeller.pan || null,

        moq: Number(newSeller.moq) || 0,
        deliveryCharge: Number(newSeller.deliveryCharge) || 0,

        pincodes: newSeller.pincodes.filter(Boolean),
      };

      console.log("CREATE SELLER PAYLOAD:", payload);

      const res = await fetch("http://localhost:5000/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create seller");
      }

      toast({
        title: "Seller Added",
        description: "Seller added successfully (Pending approval)",
      });

      setIsAddDialogOpen(false);

      setNewSeller({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
        gstNumber: "",
        pan: "",
        moq: 0,
        deliveryCharge: 0,
        pincodes: [],
        pincodeInput: "", // 👈 RESET THIS
      });

      fetchSellers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add seller",
        variant: "destructive",
      });
    }
  };
  const handleUpdateSeller = async () => {
    if (!editSeller) return;

    try {
      const payload = {
        businessName: editSeller.businessName,
        ownerName: editSeller.ownerName,
        phone: editSeller.phone,
        gstNumber: editSeller.gstNumber || null,
        pan: editSeller.pan || null,
        moq: Number(editSeller.moq) || 0,
        deliveryCharge: Number(editSeller.deliveryCharge) || 0,
        pincodes: editSeller.pincodes || [],
      };

      await fetch(`http://localhost:5000/api/sellers/${editSeller.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast({
        title: "Seller Updated",
        description: "Seller details updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditSeller(null);
      fetchSellers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update seller",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (seller: Seller) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${seller.businessName}?`
    );

    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/sellers/${seller.id}`, {
        method: "DELETE",
      });

      toast({
        title: "Seller Deleted",
        description: "Seller has been deleted successfully",
      });

      fetchSellers();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete seller",
        variant: "destructive",
      });
    }
  };

  /* ================= APPROVE / REJECT ================= */
  const updateStatus = async (seller: Seller, status: string) => {
    await fetch(`http://localhost:5000/api/sellers/${seller.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchSellers();
  };

  /* ================= FILTER ================= */
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || seller.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ================= TABLE COLUMNS ================= */
  const columns: Column<Seller>[] = [
    {
      key: "businessName",
      header: "Business",
      render: (seller) => (
        <div>
          <p className="font-medium">{seller.businessName}</p>
          <p className="text-xs text-muted-foreground">{seller.ownerName}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (seller) => (
        <div>
          <p className="text-sm">{seller.email}</p>
          <p className="text-xs text-muted-foreground">{seller.phone}</p>
        </div>
      ),
    },
    {
      key: "moq",
      header: "MOQ",
      render: (seller) => (
        <Badge variant="outline" className="font-mono">
          {seller.moq} pairs
        </Badge>
      ),
    },
    {
      key: "pincodes",
      header: "Service Area",
      render: (seller) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">
            {seller.pincodes?.length ?? 0} pincodes
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (seller) => <StatusBadge status={seller.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (seller) => (
        <div className="flex gap-1">
          {/* Edit */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(seller);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          {/* Delete */}
          {/* <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(seller);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button> */}

          {/* View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSeller(seller);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      ),
    },
  ];

  /* ================= STATS ================= */
  const total = sellers.length;
  const active = sellers.filter((s) => s.status === "active").length;
  const inactive = sellers.filter((s) => s.status === "inactive").length;

  /* ================= UI ================= */
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Sellers</h1>
            <p className="text-muted-foreground">
              Manage seller accounts and catalogs
            </p>
          </div>

          {/* Add Seller */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Seller
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">
                  Add New Seller
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* BASIC DETAILS */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Basic Details</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Business Name</Label>
                      <Input
                        value={newSeller.businessName}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            businessName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Owner Name</Label>
                      <Input
                        value={newSeller.ownerName}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            ownerName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Email</Label>
                      <Input
                        value={newSeller.email}
                        onChange={(e) =>
                          setNewSeller({ ...newSeller, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Phone</Label>
                      <Input
                        value={newSeller.phone}
                        onChange={(e) =>
                          setNewSeller({ ...newSeller, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={newSeller.password}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* BUSINESS INFO */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">
                    Business Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>GST Number</Label>
                      <Input
                        value={newSeller.gstNumber}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            gstNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>PAN</Label>
                      <Input
                        value={newSeller.pan}
                        onChange={(e) =>
                          setNewSeller({ ...newSeller, pan: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ORDER & DELIVERY */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">
                    Order & Delivery Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Minimum Order Quantity</Label>
                      <Input
                        type="number"
                        value={newSeller.moq}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            moq: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Delivery Charge</Label>
                      <Input
                        type="number"
                        value={newSeller.deliveryCharge}
                        onChange={(e) =>
                          setNewSeller({
                            ...newSeller,
                            deliveryCharge: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label>Service Area Pincodes (comma separated)</Label>
                      <Input
                        value={newSeller.pincodeInput}
                        onChange={(e) => {
                          const value = e.target.value;

                          setNewSeller({
                            ...newSeller,
                            pincodeInput: value,
                            pincodes: value
                              .split(",")
                              .map((p) => p.trim())
                              .filter(Boolean),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="gradient-primary"
                    onClick={handleAddSeller}
                  >
                    Add Seller
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">Edit Seller</DialogTitle>
              </DialogHeader>

              {editSeller && (
                <div className="space-y-6 py-4">
                  {/* BASIC DETAILS */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Basic Details</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Business Name</Label>
                        <Input
                          value={editSeller.businessName}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              businessName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Owner Name</Label>
                        <Input
                          value={editSeller.ownerName}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              ownerName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input
                          value={editSeller.email}
                          disabled
                          className="bg-muted cursor-not-allowed"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Phone</Label>
                        <Input
                          value={editSeller.phone}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* BUSINESS INFO */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">
                      Business Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>GST Number</Label>
                        <Input
                          value={editSeller.gstNumber || ""}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              gstNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>PAN</Label>
                        <Input
                          value={editSeller.pan || ""}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              pan: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* ORDER & DELIVERY */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">
                      Order & Delivery Settings
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Minimum Order Quantity</Label>
                        <Input
                          type="number"
                          value={editSeller.moq}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              moq: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Delivery Charge</Label>
                        <Input
                          type="number"
                          value={editSeller.deliveryCharge}
                          onChange={(e) =>
                            setEditSeller({
                              ...editSeller,
                              deliveryCharge: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="grid gap-2 md:col-span-2">
                        <Label>Service Area Pincodes (comma separated)</Label>
                        <Input
                          value={editSeller.pincodeInput}
                          onChange={(e) => {
                            const value = e.target.value;

                            setEditSeller({
                              ...editSeller,
                              pincodeInput: value,
                              pincodes: value
                                .split(",")
                                .map((p) => p.trim())
                                .filter(Boolean),
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      className="gradient-primary"
                      onClick={handleUpdateSeller}
                    >
                      Update Seller
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              {total}
              <p>Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {active}
              <p>Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              {inactive}
              <p>Inactive</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredSellers}
          onRowClick={(seller) => setSelectedSeller(seller)}
          emptyMessage="No sellers found"
        />

        {/* Seller Details Dialog */}
        <Dialog
          open={!!selectedSeller}
          onOpenChange={() => setSelectedSeller(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedSeller && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading">
                    Seller Details
                  </DialogTitle>
                </DialogHeader>

                <Separator />

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Business Name
                      </p>
                      <p className="font-medium">
                        {selectedSeller.businessName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-medium">{selectedSeller.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedSeller.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedSeller.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <StatusBadge status={selectedSeller.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {formatDateIN(selectedSeller.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Separator />

                  {/* Business Information */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4" />
                      Business Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          GST Number
                        </p>
                        <p className="font-medium">
                          {selectedSeller.gstNumber || "—"}
                        </p>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">PAN</p>
                        <p className="font-medium">
                          {selectedSeller.pan || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Settings */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4" /> Order Settings
                      </h4>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Minimum Order Quantity
                        </p>
                        <p className="font-medium">
                          {selectedSeller.moq} pairs
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Delivery Settings
                      </h4>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Delivery Charge
                        </p>
                        <p className="font-medium">
                          ₹{selectedSeller.deliveryCharge}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pincodes */}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Service Area Pincodes
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSeller.pincodes.map((p) => (
                        <Badge key={p}>{p}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable seller account
                      </p>
                    </div>

                    <Switch
                      checked={selectedSeller.status === "active"}
                      onCheckedChange={async (checked) => {
                        await fetch(
                          `http://localhost:5000/api/sellers/${selectedSeller.id}/status`,
                          {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              status: checked ? "active" : "inactive",
                            }),
                          }
                        );

                        fetchSellers();

                        setSelectedSeller({
                          ...selectedSeller,
                          status: checked ? "active" : "inactive",
                        });
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
