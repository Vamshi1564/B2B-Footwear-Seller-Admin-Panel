import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

/* ================= TYPES ================= */

type AddProductForm = {
  name: string;
  description: string;
  mrp: string;
  wholesalePrice: string;
  category: string; // category_id
  stock: string;
  images: File[];
};

type Product = {
  id: number;
  title: string;
  description: string;
  mrp: number;
  wholesalePrice: number;
  category: string;
  images: string[];
  status: "active" | "inactive";
};

/* ================= COMPONENT ================= */

export default function SellerCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 🔹 TEMP: Replace with API fetch later
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState<AddProductForm>({
    name: "",
    description: "",
    mrp: "",
    wholesalePrice: "",
    category: "",
    stock: "",
    images: [],
  });

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  /* ================= SUBMIT ================= */

 const handleSubmit = async () => {
  if (formData.images.length < 3) {
    alert("Minimum 3 images required");
    return;
  }

  const data = new FormData();
  data.append("name", formData.name.trim());
  data.append("description", formData.description.trim());
  data.append("mrp", formData.mrp);
  data.append("wholesale_price", formData.wholesalePrice);
  data.append("category_id", formData.category);
  data.append("stock", formData.stock);

  formData.images.forEach((img) => {
    data.append("images", img);
  });

  // 🔍 FINAL CHECK (optional)
  for (const [k, v] of data.entries()) {
    console.log(k, v);
  }

  try {
    const res = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: data,
    });

    const result = await res.json();
    console.log("SERVER RESPONSE:", result);

    if (!res.ok) {
      alert(result.message || "Failed to add product");
      return;
    }

    alert("Product added successfully");

    setIsAddDialogOpen(false);
    setFormData({
      name: "",
      description: "",
      mrp: "",
      wholesalePrice: "",
      category: "",
      stock: "",
      images: [],
    });
  } catch (error) {
    console.error("API ERROR:", error);
    alert("Server error");
  }
};


  /* ================= FILTER ================= */

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  /* ================= UI ================= */

  return (
    <DashboardLayout userType="seller">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground">
              Manage your product listings
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>

              {/* FORM */}
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Product Title</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>MRP (₹)</Label>
                    <Input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Wholesale Price (₹)</Label>
                    <Input
                      type="number"
                      name="wholesalePrice"
                      value={formData.wholesalePrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Formal</SelectItem>
                        <SelectItem value="2">Casual</SelectItem>
                        <SelectItem value="3">Sports</SelectItem>
                        <SelectItem value="4">Ethnic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Product Images (Min 3)</Label>
                  <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer block">
                    <ImageIcon className="mx-auto mb-2" />
                    <p className="text-sm">Click to upload images</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-xs mt-1">
                    Selected: {formData.images.length}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit}>
  Save Product
</Button>

                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="aspect-[4/3] bg-muted relative">
                <img
                  src={product.images[0]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={product.status} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
                <div className="flex justify-between mt-2">
                  <span className="font-bold">
                    {formatCurrency(product.wholesalePrice)}
                  </span>
                  <span className="line-through text-sm">
                    {formatCurrency(product.mrp)}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button size="icon" variant="ghost">
                    <Edit size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
