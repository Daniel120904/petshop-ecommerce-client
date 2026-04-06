export type SaleStatus =
  | "processamento"
  | "aprovada"
  | "reprovada"
  | "transito"
  | "emTroca"
  | "trocaAutorizada"
  | "entregue";

export type SaleItem = {
  product: {
    category: {
      name: string;
    };
  };
};

export type Sale = {
  id: number;
  status: SaleStatus;
  createdAt: string;
  user: { nome: string };
  items?: SaleItem[];
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
  processamento:   { label: "Em Processamento", color: "#92400e", bg: "#fef3c7" },
  aprovada:        { label: "Aprovada",          color: "#0369a1", bg: "#e0f2fe" },
  reprovada:       { label: "Reprovada",         color: "#b91c1c", bg: "#fee2e2" },
  transito:        { label: "Em Trânsito",       color: "#374151", bg: "#f1f5f9" },
  emTroca:         { label: "Em Troca",          color: "#b91c1c", bg: "#fee2e2" },
  trocaAutorizada: { label: "Troca Autorizada",  color: "#166534", bg: "#dcfce7" },
  entregue:        { label: "Entregue",          color: "#166534", bg: "#dcfce7" },
};

export type StatusAction = {
  label: string;
  nextStatus: SaleStatus;
  variant: "success" | "danger" | "primary" | "dark" | "warning";
};

export const STATUS_ACTIONS: Partial<Record<SaleStatus, StatusAction[]>> = {
  processamento: [
    { label: "Aprovar Pagamento",      nextStatus: "aprovada",  variant: "success" },
    { label: "Reprovar Pagamento",     nextStatus: "reprovada", variant: "danger"  },
  ],
  aprovada: [
    { label: "Enviar para Transporte", nextStatus: "transito",  variant: "primary" },
  ],
  transito: [
    { label: "Confirmar Entrega",      nextStatus: "entregue",  variant: "dark"    },
  ],
  emTroca: [
    { label: "Autorizar Troca",        nextStatus: "trocaAutorizada", variant: "warning" },
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