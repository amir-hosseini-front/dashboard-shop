export interface Product {
  id: number;
  name: string;
  price: number;
  status: string;
  createdAt: Date;
  category?: string;
  image?: string;
  description?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
}
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItem[];
}
export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}
export interface OrderWithUser extends Order {
  user: User;
  notes?: string;
}
export interface OrdersResponse {
  orders: OrderWithUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  note?: string;
}
export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

export interface StatisticsData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  monthlySales: { month: string; amount: number }[];
  orderStatus: { status: string; count: number; color: string }[];
}
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
}
