// User Roles
export type UserRole = "retailer" | "seller" | "admin" | "fos";

// Retailer types
export interface Retailer {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  gstNumber?: string;
  tradeLicense?: string;
  pan?: string;
  aadhaar?: string;
  creditLimit: number;
  creditUsed: number;
  createdAt: string;
  pincode: string;
  address: string;
}

// Product types
export interface Product {
  id: number;
  title: string;
  description: string;
  mrp: number;
  wholesalePrice: number;
  discountPercent: number;
  category: string;
  sizes: number;
  colors: string[];
  images: string[];
  stock: number;
  sellerId: string;
  pincodes: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

// Order types
export interface Order {
  id: string;
  retailerId: string;
  retailerName: string;
  sellerId: string;
  items: OrderItem[];
  status:
    | "pending"
    | "confirmed"
    | "packed"
    | "shipped"
    | "delivered"
    | "returned";
  totalAmount: number;
  paymentMode: "online" | "cod" | "credit";
  paymentStatus: "pending" | "paid" | "failed";
  deliveryCharge: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  mrp: number;
}

// Seller types
export interface Seller {
  id: number;

  businessName: string;
  ownerName: string;

  email: string;
  phone: string;

  password?: string; // only used while creating

  gstNumber?: string | null;
  pan?: string | null;

  status: "active" | "inactive" | "pending";
  approvalStatus?: string;

  moq?: number;
  deliveryCharge?: number;

  pincodes: string[];

  createdAt?: string;
}

// Coupon types
export interface Coupon {
  id: number;
  code: string;

  discount_type: "percent" | "flat";
  discount_value: number;

  min_order_value: number;

  start_date: string;
  end_date: string;

  status: "active" | "inactive";
}

// Banner types
export interface Banner {
  id: number;
  title: string;
  image_url: string;
  redirect_url?: string | null;
  status: "active" | "inactive";
  display_order: number;
  seller_id?: number | null;
  created_at?: string;
}

// Stats types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  totalRetailers?: number;
  totalSellers?: number;
  ordersChange: number;
  revenueChange: number;
}
