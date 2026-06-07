export type OrderProduct = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  images: string[];
};

export type OrderItem = {
  quantity: number;
  price: number;
  saleId: number;
  productId: number;
  product: OrderProduct;
};

export type OrderPayment = {
  id: number;
  saleId: number;
  type: string;
  status: string;
  cardId: number | null;
  amount: number;
};

export type Order = {
  id: number;
  finalPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancelReason: string | null;
  userId: number;
  addressId: number;
  items: OrderItem[];
  payment: OrderPayment;
};

export type OrderMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type OrderListResponse = {
  data: {
    data: Order[];
    meta: OrderMeta;
  };
};