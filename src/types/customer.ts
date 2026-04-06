export type Customer = {
  id: number;
  nome: string;
  status: boolean;
};

export type CustomerFilters = {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  search?: string;
};

export type AddressType = "Cobrança" | "Entrega" | "Cobrança e Entrega";
export type ResidenceType = "Casa" | "Apartamento" | "Outro";
export type StreetType = "Rua" | "Avenida" | "Travessa";
export type PhoneType = "Residencial" | "Comercial" | "Celular";
export type CardBrand = "Visa" | "Mastercard";

export type AddressFormData = {
  nome: string;
  tipoEndereco: AddressType | "";
  tipoResidencia: ResidenceType | "";
  tipoLogradouro: StreetType | "";
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  observacoes: string;
};

export type CardFormData = {
  numero: string;
  nome: string;
  bandeira: CardBrand | "";
  cvv: string;
};

export type PhoneFormData = {
  tipo: PhoneType | "";
  ddd: string;
  numero: string;
};

export type CreateCustomerPayload = {
  nome: string;
  genero: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};