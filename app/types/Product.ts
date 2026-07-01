export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  // Поля, которые реально приходят с бэкенда (см. controllers/product.controller.js)
  category_id: string;
  category_name?: string;
  created_at?: string;
  // Обратная совместимость: некоторые части кода обращаются к p.category?.name / p.category?.slug
  category?: Category;
}
