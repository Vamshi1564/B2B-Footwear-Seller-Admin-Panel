import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Banner } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ================= API URL ================= */
const API_URL = "http://localhost:5000/api/banners";

export default function AdminBanners() {
  const { toast } = useToast();

  /* ================= STATE ================= */
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [editingBanner, setEditingBanner] = useState<Banner | null>(null);


  /* ================= FETCH BANNERS ================= */
  const loadBanners = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  /* ================= ADD BANNER ================= */
  const handleAddBanner = async () => {
  if (!title || !imageFile) {
    toast({
      title: "Missing fields",
      description: "Title and Image are required",
      variant: "destructive",
    });
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("redirect_url", redirectUrl);
  formData.append("status", isActive ? "active" : "inactive");
  formData.append("image", imageFile);

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      toast({
        title: "Error",
        description: err.message || "Failed to add banner",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Banner Added",
      description: "Banner saved successfully",
    });

    setIsAddDialogOpen(false);
    setTitle("");
    setRedirectUrl("");
    setIsActive(true);
    setImageFile(null);

    loadBanners();
  } catch (error) {
    console.error(error);
    toast({
      title: "Server Error",
      description: "Unable to connect to server",
      variant: "destructive",
    });
  }
};

const handleUpdateBanner = async () => {
  if (!editingBanner) return;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("redirect_url", redirectUrl);
  formData.append("status", isActive ? "active" : "inactive");

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${editingBanner.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    toast({
      title: "Error",
      description: "Failed to update banner",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Banner Updated",
    description: "Changes saved successfully",
  });

  setIsEditDialogOpen(false);
  setEditingBanner(null);
  setImageFile(null);
  loadBanners();
};

  /* ================= TOGGLE STATUS ================= */
  const handleToggleStatus = async (id: number, status: string) => {
    const newStatus = status === "active" ? "inactive" : "active";

    await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    toast({
      title: "Status Updated",
      description: "Banner visibility updated",
    });

    loadBanners();
  };

  /* ================= DELETE BANNER ================= */
  const handleDelete = async (banner: Banner) => {
    await fetch(`${API_URL}/${banner.id}`, {
      method: "DELETE",
    });

    toast({
      title: "Banner Deleted",
      description: `"${banner.title}" removed`,
      variant: "destructive",
    });

    loadBanners();
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Banners</h1>
            <p className="text-muted-foreground">
              Manage promotional banners for the home screen
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">
                  Add New Banner
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Banner Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter banner title"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Banner Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] || null)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Link URL (Optional)</Label>
                  <Input
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label>Active</Label>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="gradient-primary"
                    onClick={handleAddBanner}
                  >
                    Add Banner
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Banner</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Banner Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
  <Label>Current Image</Label>

  {editingBanner?.image_url && (
    <img
      src={`http://localhost:5000${editingBanner.image_url}`}
      alt="Banner"
      className="w-full h-32 object-cover rounded-md border"
    />
  )}

  <Label className="mt-2">Change Image (optional)</Label>
  <Input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setImageFile(e.target.files?.[0] || null)
    }
  />
</div>


      <div className="grid gap-2">
        <Label>Redirect URL</Label>
        <Input
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <Label>Active</Label>
        <Switch checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button
          className="gradient-primary"
          onClick={handleUpdateBanner}
        >
          Update
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {banners.filter(b => b.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground">Active Banners</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <p className="text-2xl font-bold">
                {banners.filter(b => b.status === "inactive").length}
              </p>
              <p className="text-sm text-muted-foreground">Inactive Banners</p>
            </CardContent>
          </Card>
        </div>

        {/* ================= LIST ================= */}
        <div className="space-y-3">
          {banners.map((banner) => (
            <Card key={banner.id} className="shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="p-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div className="w-40 h-24 bg-muted hidden sm:block">
                    <img
                      src={`http://localhost:5000${banner.image_url}`}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <h3 className="font-semibold">{banner.title}</h3>
                    {banner.redirect_url && (
                      <a
                        href={banner.redirect_url}
                        target="_blank"
                        className="text-sm text-primary flex items-center gap-1"
                      >
                        {banner.redirect_url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-4 border-l">
                      <span
    className={`text-sm mx-1 font-medium ${
      banner.status === "active"
        ? "text-green-600"
        : "text-red-600"
    }`}
  >
    {banner.status === "active" ? "Active" : "Inactive"}
  </span>
                    <Switch
                      checked={banner.status === "active"}
                      onCheckedChange={() =>
                        handleToggleStatus(banner.id, banner.status)
                      }
                    />
                    <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setRedirectUrl(banner.redirect_url || "");
    setIsActive(banner.status === "active");
    setIsEditDialogOpen(true);
  }}
>
  <Edit className="w-4 h-4" />
</Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(banner)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
