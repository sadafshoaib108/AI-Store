export type ProductStatus = "Active" | "Inactive";

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: ProductStatus;
  category: string;
};

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: ProductStatus;
};

export type ProductFormState = Omit<
  ProductFormValues,
  "price" | "stock"
> & {
  price: string;
  stock: string;
};
