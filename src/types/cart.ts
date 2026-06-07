import { Product } from "./product";

export type CartItem = {
  id: number;
  quantity: number;
  inStock: boolean;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

export type CartResponse = {
  data: {
    data: CartItem[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};