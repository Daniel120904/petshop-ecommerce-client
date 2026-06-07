export type Category = {
  id: number;
  name: string;
};

export type CategoryResponse = {
  data: {
    data: Category[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};