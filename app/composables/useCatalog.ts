/**
 * Catalog Composable
 * Fetches dropdown data: categories, brands, units
 */
import type {
  CategoriesResponse,
  BrandsResponse,
  UnitsResponse,
} from "~/types/catalog";

export const useCatalog = () => {
  const api = useApi();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<CategoriesResponse>(`/dashboard/categories`);
      return res;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchBrands = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<BrandsResponse>(`/dashboard/brands`);
      return res;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUnits = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<UnitsResponse>(`/dashboard/units`);
      return res;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchCategories,
    fetchBrands,
    fetchUnits,
  };
};
