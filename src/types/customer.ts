export type CustomerPhone = {
  number: string;
  ddd: string;
};

export type CustomerAddress = {
  nickname: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zip: string;
  city: string;
  state: string;
  abbreviation: string;
};

export type Customer = {
  id: number;
  name: string;
  birthday: string;
  cpf: string;
  gender: string;
  email: string;
  active: boolean;
  blocked: boolean;
  phones: CustomerPhone[];
  addresses: CustomerAddress[];
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  genderId: number;
  roleId: string;
};

export type FindCustomer = {
  data: {
    id: number;
    name: string;
    birthday: string;
    cpf: string;
    gender: string;
    email: string;
    active: boolean;
    blocked: boolean;
    phones: CustomerPhone[];
    addresses: CustomerAddress[];
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
    genderId: number;
    roleId: string;
  }
};


export type CustomerResponse = {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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
  senha: string;
  confirmarSenha: string;
};