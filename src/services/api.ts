import { Product } from '../types';

const BASE_URL = 'https://fakestoreapi.com';

let cachedProducts: Product[] | null = null;
let cachedCategories: string[] | null = null;

export const fetchProducts = async (forceRefresh = false): Promise<Product[]> => {
  if (!forceRefresh && cachedProducts && cachedProducts.length > 0) {
    return cachedProducts;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${BASE_URL}/products`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned error code ${res.status}`);
    }

    const data: Product[] = await res.json();
    cachedProducts = data;
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out while fetching products.');
    }
    throw new Error(err.message || 'Failed to fetch products from FakeStore API.');
  }
};

export const fetchCategories = async (forceRefresh = false): Promise<string[]> => {
  if (!forceRefresh && cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  try {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) {
      throw new Error(`Failed to load categories: ${res.status}`);
    }
    const data: string[] = await res.json();
    cachedCategories = data;
    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to load categories.');
  }
};

export const clearApiCache = () => {
  cachedProducts = null;
  cachedCategories = null;
};
