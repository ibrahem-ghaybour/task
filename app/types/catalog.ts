// Catalog Types
export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  data: {
    categories: Category[];
  };
  status: number;
  message: string;
}

export interface BrandsResponse {
  data: {
    brands: Brand[];
  };
  status: number;
  message: string;
}

export interface UnitsResponse {
  data: {
    units: Unit[];
  };
  status: number;
  message: string;
}
