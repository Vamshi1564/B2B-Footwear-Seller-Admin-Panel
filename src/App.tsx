import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerCatalog from "./pages/seller/SellerCatalog";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerPricing from "./pages/seller/SellerPricing";
import SellerSettings from "./pages/seller/SellerSettings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRetailers from "./pages/admin/AdminRetailers";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Seller Routes */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/catalog" element={<SellerCatalog />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/pricing" element={<SellerPricing />} />
          <Route path="/seller/settings" element={<SellerSettings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/retailers" element={<AdminRetailers />} />
          <Route path="/admin/sellers" element={<AdminSellers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
