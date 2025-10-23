// Product Types
export interface Product {
  id: number;
  name: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductPayload {
  name: string;
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
}

export interface ProductsListResponse {
  data: {
    products: Product[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
  status: number;
  message: string;
}

export interface ProductDetailResponse {
  data: {
    product: Product;
  };
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
