export type SaleStatus =
  | "processing"
  | "approved"
  | "shipped"
  | "exchange"
  | "exchangeAuthorized"
  | "delivered"
  | "canceled";

export type SaleProduct = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  images: string[];
  stock: number;
  active: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SaleItem = {
  quantity: number;
  price: number;
  saleId: number;
  productId: number;
  product: SaleProduct;
};

export type SalePayment = {
  id: number;
  saleId: number;
  type: "card" | "pix";
  status: string;
  cardId: number | null;
  amount: number;
};

export type Sale = {
  id: number;
  finalPrice: number;
  totalPrice: number;
  status: SaleStatus;
  createdAt: string;
  updatedAt: string;
  cancelReason: string | null;
  userId: number;
  addressId: number;
  items: SaleItem[];
  payment: SalePayment;
  user?: { nome: string };
};

export type SaleMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type SaleListResponse = {
  data: {
    data: Sale[];
    meta: SaleMeta;
  };
};

export type SaleFilters = {
  dataStart?: string;
  dataEnd?: string;
};

export type StatusConfig = {
  label: string;
  color: string;
  bg: string;
};

export const STATUS_CONFIG: Record<SaleStatus, StatusConfig> = {
  processing:         { label: "Em Processamento", color: "#92400e", bg: "#fef3c7" },
  approved:           { label: "Aprovada",          color: "#0369a1", bg: "#e0f2fe" },
  shipped:            { label: "Em Trânsito",       color: "#374151", bg: "#f1f5f9" },
  exchange:           { label: "Em Troca",          color: "#b91c1c", bg: "#fee2e2" },
  exchangeAuthorized: { label: "Troca Autorizada",  color: "#166534", bg: "#dcfce7" },
  delivered:          { label: "Entregue",          color: "#166534", bg: "#dcfce7" },
  canceled:           { label: "Cancelada",         color: "#6b7280", bg: "#f1f5f9" },
};

export type StatusAction = {
  label: string;
  nextStatus: SaleStatus;
  variant: "success" | "danger" | "primary" | "dark" | "warning";
};

export const STATUS_ACTIONS: Partial<Record<SaleStatus, StatusAction[]>> = {
  processing: [
    { label: "Aprovar Pagamento",      nextStatus: "approved",           variant: "success" },
    { label: "Reprovar Pagamento",     nextStatus: "canceled",           variant: "danger"  },
  ],
  approved: [
    { label: "Enviar para Transporte", nextStatus: "shipped",            variant: "primary" },
  ],
  shipped: [
    { label: "Confirmar Entrega",      nextStatus: "delivered",          variant: "dark"    },
  ],
  exchange: [
    { label: "Autorizar Troca",        nextStatus: "exchangeAuthorized", variant: "warning" },
  ],
};

export type ChartDataPoint = {
  date: string;
  [categoryName: string]: number | string;
};

export const CHART_COLORS = [
  "#ef4444", "#3b82f6", "#f59e0b", "#10b981",
  "#8b5cf6", "#f97316", "#6b7280", "#6366f1",
  "#ec4899", "#22c55e",
];