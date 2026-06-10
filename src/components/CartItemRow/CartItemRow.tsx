import styles from "./CartItemRow.module.css";
import { CartItem } from "@/types/cart";

const FALLBACK_IMAGE = "https://placehold.co/100x100/e2e8f0/94a3b8?text=Sem+Imagem";

type CartItemRowProps = {
  item: CartItem;
  onIncrease: (productId: number, currentQty: number) => void;
  onDecrease: (productId: number, currentQty: number) => void;
};

export function CartItemRow({ item, onIncrease, onDecrease }: CartItemRowProps) {
  const { product, quantity, productId } = item;
  const image = product.images?.[0] ?? FALLBACK_IMAGE;
  const hasDiscount =
    product.salePrice > 0 && product.salePrice < product.price;
  const unitPrice = hasDiscount ? product.salePrice : product.price;
  const lineTotal = unitPrice * quantity;

  return (
    <li className={styles.row}>
      <img
        src={image}
        alt={product.name}
        className={styles.image}
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
      />

      <div className={styles.info}>
        <h5 className={styles.name}>{product.name}</h5>
        <div className={styles.priceRow}>
          {hasDiscount && (
            <span className={styles.originalPrice}>
              R$ {product.price.toFixed(2)}
            </span>
          )}
          <span className={styles.price}>R$ {unitPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.qtyControl}>
        <button
          className={styles.qtyBtn}
          onClick={() => onDecrease(productId, quantity)}
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onIncrease(productId, quantity)}
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <span className={styles.lineTotal}>
        R$ {lineTotal.toFixed(2)}
      </span>
    </li>
  );
}