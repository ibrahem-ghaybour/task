// Product Types
export interface Product {
  id: number;
  name: string;
  slug?: string;
  keywords_seo_ar?: string;
  keywords_seo_en?: string;
  description_seo_ar?: string;
  description_seo_en?: string;
  description: string;
  category: number;
  brand: number;
  unit: number;
  quantity: number;
  featured: 0 | 1;
  isOnline: 0 | 1;
  online_units: number;
  max_order: number;
  buying_price: number;
  selling_price: number;
  tax: number;
  sku: string;
  weight?: number;
  barcode?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  keywords_seo_ar?: string;
  keywords_seo_en?: string;
  description_seo_ar?: string;
  description_seo_en?: string;
  description: string;
  category: number;
  brand: number;
  unit: number;
  quantity: number;
  featured: 0 | 1;
  isOnline: 0 | 1;
  online_units: number;
  max_order: number;
  buying_price: number;
  selling_price: number;
  tax: number;
  sku: string;
  weight?: number;
  barcode?: string;
  content?: string;
}
export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
export interface ProductsListResponse {
  data: Product[];
  meta: Pagination;
  status: number;
  message: string;
}

export interface ProductDetailResponse {
    data: Product;
  status: number;
  message: string;
}

export interface CreateProductResponse {
  data: {
    product: Product;
  };
  status: number;
  message: string;
}
