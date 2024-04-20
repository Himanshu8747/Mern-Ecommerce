import { Product, User } from "./types";

export type MessageResponse = {
  success: boolean;
  message: string;
};
export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};
export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};
export type searchProductsResponse = AllProductsResponse & {
  totalPage: number;
};
export type searchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};
export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};
export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};
