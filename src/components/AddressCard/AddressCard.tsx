import { AddressFormData } from "@/types/customer";
import { FormField } from "@/components/FormField/FormField";
import styles from "./AddressCard.module.css";

type AddressCardProps = {
  index: number;
  data: AddressFormData;
  onChange: (field: keyof AddressFormData, value: string) => void;
  onRemove: () => void;
};

export function AddressCard({ index, data, onChange, onRemove }: AddressCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>Endereço {index + 1}</span>
        <button type="button" className={styles.removeBtn} onClick={onRemove}>
          Remover
        </button>
      </div>

      <div className={styles.grid2}>
        <FormField
          label="Nome do Endereço"
          required
          value={data.nome}
          onChange={(v) => onChange("nome", v)}
          placeholder="Ex: Casa, Trabalho..."
        />
        <FormField
          label="Tipo de Endereço"
          required
          as="select"
          value={data.tipoEndereco}
          onChange={(v) => onChange("tipoEndereco", v)}
          options={[
            { label: "Cobrança", value: "Cobrança" },
            { label: "Entrega", value: "Entrega" },
            { label: "Cobrança e Entrega", value: "Cobrança e Entrega" },
          ]}
        />
      </div>

      <div className={styles.grid2}>
        <FormField
          label="Tipo de Residência"
          required
          as="select"
          value={data.tipoResidencia}
          onChange={(v) => onChange("tipoResidencia", v)}
          options={[
            { label: "Casa", value: "Casa" },
            { label: "Apartamento", value: "Apartamento" },
            { label: "Outro", value: "Outro" },
          ]}
        />
        <FormField
          label="Tipo de Logradouro"
          required
          as="select"
          value={data.tipoLogradouro}
          onChange={(v) => onChange("tipoLogradouro", v)}
          options={[
            { label: "Rua", value: "Rua" },
            { label: "Avenida", value: "Avenida" },
            { label: "Travessa", value: "Travessa" },
          ]}
        />
      </div>

      <div className={styles.grid3}>
        <div className={styles.spanDouble}>
          <FormField
            label="Logradouro"
            required
            value={data.logradouro}
            onChange={(v) => onChange("logradouro", v)}
          />
        </div>
        <FormField
          label="Número"
          required
          value={data.numero}
          onChange={(v) => onChange("numero", v)}
        />
      </div>

      <div className={styles.grid2}>
        <FormField
          label="Bairro"
          required
          value={data.bairro}
          onChange={(v) => onChange("bairro", v)}
        />
        <FormField
          label="CEP"
          required
          value={data.cep}
          onChange={(v) => onChange("cep", v)}
          placeholder="00000-000"
        />
      </div>

      <div className={styles.grid3}>
        <FormField
          label="Cidade"
          required
          value={data.cidade}
          onChange={(v) => onChange("cidade", v)}
        />
        <FormField
          label="Estado"
          required
          value={data.estado}
          onChange={(v) => onChange("estado", v)}
        />
        <FormField
          label="País"
          required
          value={data.pais}
          onChange={(v) => onChange("pais", v)}
        />
      </div>

      <FormField
        label="Observações"
        as="textarea"
        value={data.observacoes}
        onChange={(v) => onChange("observacoes", v)}
        placeholder="Complemento, referência..."
      />
    </div>
  );
}