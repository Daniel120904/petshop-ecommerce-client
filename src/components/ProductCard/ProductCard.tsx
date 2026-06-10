import styles from "./ProductCard.module.css";
import { Product } from "@/types/product";

const FALLBACK_IMAGE = "https://placehold.co/300x200/e2e8f0/94a3b8?text=Sem+Imagem";

type ProductCardProps = {
  product: Product;
  onAddToCart: (id: number) => void;
  isAdding: boolean;
  isSuccess: boolean;
};

export function ProductCard({ product, onAddToCart, isAdding, isSuccess }: ProductCardProps) {
  const image = product.images?.[0] ?? FALLBACK_IMAGE;
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.price;
  const displayPrice = hasDiscount ? product.salePrice : product.price;

  const categories = Array.from(
    new Set(product.subCategories.map((s) => s.subCategory.category.name))
  );

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={product.name}
          className={styles.image}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {hasDiscount && <span className={styles.discountBadge}>Oferta</span>}
      </div>

      <div className={styles.body}>
        {categories.length > 0 && (
          <span className={styles.category}>{categories.join(" · ")}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.priceRow}>
          {hasDiscount && (
            <span className={styles.originalPrice}>
              R$ {product.price.toFixed(2)}
            </span>
          )}
          <span className={styles.price}>R$ {displayPrice.toFixed(2)}</span>
        </div>

        <button
          className={`${styles.button} ${isSuccess ? styles.success : ""}`}
          onClick={() => onAddToCart(product.id)}
          disabled={isAdding || product.stock === 0}
        >
          {isAdding
            ? "Adicionando..."
            : isSuccess
            ? "✓ Adicionado!"
            : product.stock === 0
            ? "Sem estoque"
            : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}