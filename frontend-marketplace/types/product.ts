import { Category } from "@/types/category";

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imageUrl: string;
  categoryId: number | null;
  category: Category | null;
};

