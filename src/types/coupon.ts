export type CouponType = "percent" | "value";

export type Coupon = {
  id: number;
  code: string;
  type: CouponType;
  discount: number;
  maxUses: number;
  createdAt: string;
  updatedAt: string;
};

export type CouponCheckResponse = {
  data: {
    status: boolean;
    coupon?: Coupon;
  };
};