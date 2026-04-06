import { CardFormData } from "@/types/customer";
import { FormField } from "@/components/FormField/FormField";
import styles from "./CardItem.module.css";

type CardItemProps = {
  index: number;
  data: CardFormData;
  onChange: (field: keyof CardFormData, value: string) => void;
  onRemove: () => void;
};

export function CardItem({ index, data, onChange, onRemove }: CardItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Cartão {index + 1}</span>
        <button type="button" className={styles.removeBtn} onClick={onRemove}>
          Remover
        </button>
      </div>

      <div className={styles.grid2}>
        <FormField
          label="Nº do Cartão"
          required
          value={data.numero}
          onChange={(v) => onChange("numero", v)}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
        />
        <FormField
          label="Nome impresso no Cartão"
          required
          value={data.nome}
          onChange={(v) => onChange("nome", v)}
          placeholder="Como aparece no cartão"
        />
      </div>

      <div className={styles.grid2}>
        <FormField
          label="Bandeira"
          required
          as="select"
          value={data.bandeira}
          onChange={(v) => onChange("bandeira", v)}
          options={[
            { label: "Visa", value: "Visa" },
            { label: "Mastercard", value: "Mastercard" },
          ]}
        />
        <FormField
          label="CVV"
          required
          value={data.cvv}
          onChange={(v) => onChange("cvv", v)}
          placeholder="000"
          maxLength={4}
        />
      </div>
    </div>
  );
}