
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  seller: {
    _id: string;
    name: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  products: Array<{
    product: Product;
    quantity: number;
  }>;
  address: OrderAddress;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}