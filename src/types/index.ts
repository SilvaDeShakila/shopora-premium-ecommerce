export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderModel {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'rating-desc';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
}
