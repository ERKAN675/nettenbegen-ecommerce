// Ürün tipi
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  sku: string;
  featured: boolean;
  status: 'Aktif' | 'Pasif';
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Ürün varyantı
export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

// Kategori tipi
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  status: 'Aktif' | 'Pasif';
  order: number;
  slug: string;
}

// Kullanıcı tipi
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'Aktif' | 'Pasif' | 'VIP';
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  address?: Address;
}

// Adres tipi
export interface Address {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
}

// Sepet öğesi
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

// Sipariş tipi
export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  address: Address;
  products: OrderProduct[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: 'Beklemede' | 'Onaylandı' | 'Hazırlanıyor' | 'Kargoda' | 'Tamamlandı' | 'İptal Edildi';
  paymentMethod: string;
  shippingCompany?: string;
  trackingNumber?: string;
  date: string;
  notes?: string;
}

// Sipariş ürünü
export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  variant?: string;
}

// Slider tipi
export interface Slider {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  type: 'image' | 'campaign' | 'product' | 'category';
  targetId?: string;
  status: 'Aktif' | 'Pasif';
  order: number;
}

// Site ayarları
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  currency: string;
  freeShippingThreshold: number;
  taxRate: number;
  contactEmail: string;
  contactPhone: string;
  address: Address;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

// API Response tipleri
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Filtreleme seçenekleri
export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'date' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// Arama sonuçları
export interface SearchResults {
  products: Product[];
  categories: Category[];
  total: number;
  query: string;
}
