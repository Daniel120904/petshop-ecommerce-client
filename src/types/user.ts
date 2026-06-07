export type UserPhone = {
  phoneId: number;
  number: string;
  ddd: string;
};

export type UserAddress = {
  adressId: number;
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

export type UserCard = {
  cardId: number;
  last4: string;
  nickname: string;
};

export type UserProfile = {
  id: number;
  name: string;
  birthday: string;
  cpf: string;
  gender: string;
  role: string;
  email: string;
  active: boolean;
  blocked: boolean;
  phones: UserPhone[];
  addresses: UserAddress[];
  cards: UserCard[];
};

export type UserProfileResponse = {
  data: UserProfile;
};

export type UpdateUserPayload = {
  email: string;
  name: string;
  cpf: string;
  birthday: string;
  genderId: string;
};

export type AddressPayload = {
  street: string;
  nickname: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zip: string;
  city: string;
  state: string;
  observation?: string;
};

export type UpdateAddressPayload = AddressPayload & {
  addressId: number;
};

export type PhonePayload = {
  ddd: string;
  number: string;
};

export type CardPayload = {
  nickname: string;
  holder: string;
  brand: string;
  number: string;
};

export type PaymentType = "pix" | "card";
 
export type CreateSalePayload = {
  products: { productId: number; quantity: number }[];
  coupons: string[];
  addressId: number;
  paymentType: PaymentType;
  cardId?: number;
};