import { api } from "@/lib/api";
import { CouponCheckResponse, Coupon } from "@/types/coupon";

export async function checkCoupon(code: string): Promise<Coupon | null> {
  const res = await api<CouponCheckResponse>(
    `/coupon/check?code=${encodeURIComponent(code)}`,
    { auth: true }
  );
  if (!res.data.status || !res.data.coupon) return null;
  return res.data.coupon;
}