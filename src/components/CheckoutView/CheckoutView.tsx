"use client";

import Link from "next/link";
import styles from "./CheckoutView.module.css";
import { useCheckout } from "@/hooks/useCheckout";
import { PaymentType } from "@/types/user";

const FALLBACK_IMAGE = "https://placehold.co/50x50/e2e8f0/94a3b8?text=?";

export function CheckoutView() {
  const {
    cartItems,
    profile,
    loading,
    submitting,
    error,
    subtotal,
    discount,
    total,
    shipping,
    selectedAddressId,
    setSelectedAddressId,
    paymentType,
    setPaymentType,
    selectedCardId,
    setSelectedCardId,
    couponCode,
    setCouponCode,
    appliedCoupons,
    couponLoading,
    couponError,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleSubmit,
  } = useCheckout();

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando dados da compra...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.grid}>
        {/* LEFT column */}
        <div className={styles.column}>

          {/* Cart summary */}
          <section className={styles.card}>
            <h4 className={styles.cardTitle}>Resumo do Carrinho</h4>

            {cartItems.length === 0 ? (
              <p className={styles.empty}>Carrinho vazio.</p>
            ) : (
              <ul className={styles.itemList}>
                {cartItems.map((item) => {
                  const price =
                    item.product.salePrice > 0 &&
                    item.product.salePrice < item.product.price
                      ? item.product.salePrice
                      : item.product.price;
                  const image = item.product.images?.[0] ?? FALLBACK_IMAGE;

                  return (
                    <li key={item.id} className={styles.item}>
                      <img
                        src={image}
                        alt={item.product.name}
                        className={styles.itemImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className={styles.itemName}>
                        {item.product.name}{" "}
                        <span className={styles.itemQty}>
                          ({item.quantity} unid.)
                        </span>
                      </span>
                      <span className={styles.itemPrice}>
                        R$ {(price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Frete</span>
                <span>R$ {shipping.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Desconto</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Coupon */}
          <section className={styles.card}>
            <h4 className={styles.cardTitle}>Cupom de Desconto</h4>
            <div className={styles.couponBody}>
              <div className={styles.couponInputRow}>
                <input
                  type="text"
                  className={styles.couponInput}
                  placeholder="Digite o código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <button
                  className={styles.couponButton}
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  type="button"
                >
                  {couponLoading ? "..." : "Aplicar"}
                </button>
              </div>

              {couponError && (
                <p className={styles.couponError}>{couponError}</p>
              )}

              {appliedCoupons.length > 0 && (
                <ul className={styles.couponList}>
                  {appliedCoupons.map((coupon) => (
                    <li key={coupon.code} className={styles.couponTag}>
                      <div className={styles.couponInfo}>
                        <span className={styles.couponCode}>{coupon.code}</span>
                        <span className={styles.couponDesc}>
                          {coupon.type === "percent"
                            ? `${coupon.discount}% de desconto`
                            : `R$ ${coupon.discount.toFixed(2)} de desconto`}
                        </span>
                      </div>
                      <button
                        className={styles.couponRemove}
                        onClick={() => handleRemoveCoupon(coupon.code)}
                        type="button"
                        aria-label="Remover cupom"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT column */}
        <div className={styles.column}>

          {/* Address */}
          <section className={styles.card}>
            <h4 className={styles.cardTitle}>Endereço de Entrega</h4>

            {!profile || profile.addresses.length === 0 ? (
              <p className={styles.empty}>Nenhum endereço cadastrado.</p>
            ) : (
              <div className={styles.optionList}>
                {profile.addresses.map((addr) => (
                  <label
                    key={addr.adressId}
                    className={`${styles.optionCard} ${
                      selectedAddressId === addr.adressId
                        ? styles.optionSelected
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className={styles.radioHidden}
                      checked={selectedAddressId === addr.adressId}
                      onChange={() => setSelectedAddressId(addr.adressId)}
                    />
                    <div>
                      <span className={styles.optionTitle}>{addr.nickname}</span>
                      <span className={styles.optionSub}>
                        {addr.street}, {addr.number}
                        {addr.complement ? ` — ${addr.complement}` : ""},{" "}
                        {addr.neighborhood}, {addr.city} — {addr.abbreviation},{" "}
                        {addr.zip}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className={styles.card}>
            <h4 className={styles.cardTitle}>Forma de Pagamento</h4>

            <div className={styles.paymentToggle}>
              {(["card", "pix"] as PaymentType[]).map((type) => (
                <button
                  key={type}
                  className={`${styles.toggleBtn} ${
                    paymentType === type ? styles.toggleActive : ""
                  }`}
                  onClick={() => setPaymentType(type)}
                  type="button"
                >
                  {type === "card" ? "Cartão" : "Pix"}
                </button>
              ))}
            </div>

            {paymentType === "pix" && (
              <p className={styles.pixInfo}>
                Após confirmar, você receberá um QR Code para pagamento via Pix.
              </p>
            )}

            {paymentType === "card" && (
              <>
                {!profile || profile.cards.length === 0 ? (
                  <p className={styles.empty}>Nenhum cartão cadastrado.</p>
                ) : (
                  <div className={styles.optionList}>
                    {profile.cards.map((card) => (
                      <label
                        key={card.cardId}
                        className={`${styles.optionCard} ${
                          selectedCardId === card.cardId
                            ? styles.optionSelected
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="card"
                          className={styles.radioHidden}
                          checked={selectedCardId === card.cardId}
                          onChange={() => setSelectedCardId(card.cardId)}
                        />
                        <div>
                          <span className={styles.optionTitle}>
                            {card.nickname}
                          </span>
                          <span className={styles.optionSub}>
                            **** **** **** {card.last4}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <button
            className={styles.confirmButton}
            onClick={handleSubmit}
            disabled={submitting || cartItems.length === 0}
          >
            {submitting ? "Processando..." : `Confirmar Compra — R$ ${total.toFixed(2)}`}
          </button>

          <Link href="/user/cart" className={styles.backLink}>
            ← Voltar ao carrinho
          </Link>
        </div>
      </div>
    </main>
  );
}