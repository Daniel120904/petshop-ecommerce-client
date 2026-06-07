export type ProductCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductSubCategory = {
  id: number;
  name: string;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category: ProductCategory;
};

export type ProductSubCategoryRelation = {
  productId: number;
  subCategoryId: number;
  subCategory: ProductSubCategory;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  images: string[];
  stock: number;
  active: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: ProductSubCategoryRelation[];
};

export type ProductMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ProductListResponse = {
  data: {
    data: Product[];
    meta: ProductMeta;
  };
};

export type ProductFilters = {
  page?: number;
  pageSize?: number;
  orderBy?: string;
};