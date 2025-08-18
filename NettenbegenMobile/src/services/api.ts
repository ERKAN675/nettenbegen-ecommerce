import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Product, 
  Category, 
  User, 
  Order, 
  Slider, 
  SiteSettings, 
  CartItem,
  FilterOptions,
  SearchResults,
  ApiResponse 
} from '../types';

// API Base URL - Web sitesi ile entegrasyon
const API_BASE_URL = 'https://erkan675.github.io/nettenbegen-ecommerce/';

// Local Storage Keys
const STORAGE_KEYS = {
  CART: 'nettenbegen_cart',
  USER: 'nettenbegen_user',
  SETTINGS: 'nettenbegen_settings',
  PRODUCTS: 'nettenbegen_products',
  CATEGORIES: 'nettenbegen_categories',
  SLIDERS: 'nettenbegen_sliders',
  ORDERS: 'nettenbegen_orders',
};

// API Service Class
class ApiService {
  // Local Storage işlemleri
  async getFromStorage<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  }

  async saveToStorage<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Storage write error:', error);
    }
  }

  // Ürün servisleri
  async getProducts(): Promise<Product[]> {
    try {
      // Önce local storage'dan kontrol et
      const cachedProducts = await this.getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS);
      if (cachedProducts) {
        return cachedProducts;
      }

      // Web sitesinden veri çek
      const response = await fetch(`${API_BASE_URL}data/products.json`);
      if (response.ok) {
        const products = await response.json();
        await this.saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        return products;
      }

      // Fallback: Demo veriler
      return this.getDemoProducts();
    } catch (error) {
      console.error('Products fetch error:', error);
      return this.getDemoProducts();
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  async searchProducts(query: string, filters?: FilterOptions): Promise<SearchResults> {
    const products = await this.getProducts();
    
    let filteredProducts = products.filter(product => {
      // Arama filtresi
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                          product.description.toLowerCase().includes(query.toLowerCase()) ||
                          product.category.toLowerCase().includes(query.toLowerCase());
      
      if (!matchesQuery) return false;

      // Kategori filtresi
      if (filters?.category && product.category !== filters.category) return false;

      // Fiyat filtresi
      if (filters?.minPrice && product.price < filters.minPrice) return false;
      if (filters?.maxPrice && product.price > filters.maxPrice) return false;

      // Stok filtresi
      if (filters?.inStock && product.stock <= 0) return false;

      // Öne çıkan filtresi
      if (filters?.featured && !product.featured) return false;

      return true;
    });

    // Sıralama
    if (filters?.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any = a[filters.sortBy!];
        let bValue: any = b[filters.sortBy!];

        if (filters.sortBy === 'price') {
          aValue = a.price;
          bValue = b.price;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return {
      products: filteredProducts,
      categories: [],
      total: filteredProducts.length,
      query
    };
  }

  // Kategori servisleri
  async getCategories(): Promise<Category[]> {
    try {
      const cachedCategories = await this.getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES);
      if (cachedCategories) {
        return cachedCategories;
      }

      const response = await fetch(`${API_BASE_URL}data/categories.json`);
      if (response.ok) {
        const categories = await response.json();
        await this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
        return categories;
      }

      return this.getDemoCategories();
    } catch (error) {
      console.error('Categories fetch error:', error);
      return this.getDemoCategories();
    }
  }

  // Slider servisleri
  async getSliders(): Promise<Slider[]> {
    try {
      const cachedSliders = await this.getFromStorage<Slider[]>(STORAGE_KEYS.SLIDERS);
      if (cachedSliders) {
        return cachedSliders;
      }

      const response = await fetch(`${API_BASE_URL}data/sliders.json`);
      if (response.ok) {
        const sliders = await response.json();
        await this.saveToStorage(STORAGE_KEYS.SLIDERS, sliders);
        return sliders;
      }

      return this.getDemoSliders();
    } catch (error) {
      console.error('Sliders fetch error:', error);
      return this.getDemoSliders();
    }
  }

  // Sepet servisleri
  async getCart(): Promise<CartItem[]> {
    return await this.getFromStorage<CartItem[]>(STORAGE_KEYS.CART) || [];
  }

  async addToCart(product: Product, quantity: number = 1, variant?: any): Promise<void> {
    const cart = await this.getCart();
    const existingItem = cart.find(item => 
      item.product.id === product.id && 
      (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ product, quantity, variant });
    }

    await this.saveToStorage(STORAGE_KEYS.CART, cart);
  }

  async updateCartItem(productId: string, quantity: number, variant?: any): Promise<void> {
    const cart = await this.getCart();
    const item = cart.find(item => 
      item.product.id === productId && 
      (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
    );

    if (item) {
      if (quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      } else {
        item.quantity = quantity;
      }
      await this.saveToStorage(STORAGE_KEYS.CART, cart);
    }
  }

  async removeFromCart(productId: string, variant?: any): Promise<void> {
    const cart = await this.getCart();
    const filteredCart = cart.filter(item => 
      !(item.product.id === productId && 
        (!variant || JSON.stringify(item.variant) === JSON.stringify(variant)))
    );
    await this.saveToStorage(STORAGE_KEYS.CART, filteredCart);
  }

  async clearCart(): Promise<void> {
    await this.saveToStorage(STORAGE_KEYS.CART, []);
  }

  // Kullanıcı servisleri
  async getCurrentUser(): Promise<User | null> {
    return await this.getFromStorage<User>(STORAGE_KEYS.USER);
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    // Demo login - gerçek uygulamada API'ye istek atılır
    const demoUser: User = {
      id: '1',
      name: 'Demo Kullanıcı',
      email: email,
      phone: '+90 555 123 4567',
      status: 'Aktif',
      registrationDate: new Date().toISOString(),
      totalOrders: 5,
      totalSpent: 1250.50,
      address: {
        street: 'Örnek Mahallesi, Örnek Sokak No:1',
        district: 'Kadıköy',
        city: 'İstanbul',
        postalCode: '34700',
        country: 'Türkiye'
      }
    };

    await this.saveToStorage(STORAGE_KEYS.USER, demoUser);
    return { success: true, data: demoUser };
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Sipariş servisleri
  async createOrder(orderData: Omit<Order, 'id' | 'date'>): Promise<ApiResponse<Order>> {
    try {
      const orders = await this.getFromStorage<Order[]>(STORAGE_KEYS.ORDERS) || [];
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString()
      };

      orders.push(newOrder);
      await this.saveToStorage(STORAGE_KEYS.ORDERS, orders);
      await this.clearCart();

      return { success: true, data: newOrder };
    } catch (error) {
      return { success: false, error: 'Sipariş oluşturulamadı' };
    }
  }

  async getUserOrders(): Promise<Order[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const orders = await this.getFromStorage<Order[]>(STORAGE_KEYS.ORDERS) || [];
    return orders.filter(order => order.customerEmail === user.email);
  }

  // Site ayarları
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const cachedSettings = await this.getFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS);
      if (cachedSettings) {
        return cachedSettings;
      }

      const response = await fetch(`${API_BASE_URL}data/settings.json`);
      if (response.ok) {
        const settings = await response.json();
        await this.saveToStorage(STORAGE_KEYS.SETTINGS, settings);
        return settings;
      }

      return this.getDemoSettings();
    } catch (error) {
      console.error('Settings fetch error:', error);
      return this.getDemoSettings();
    }
  }

  // Demo veriler
  private getDemoProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        description: 'Apple iPhone 15 Pro 128GB Titanium',
        price: 106199.98,
        originalPrice: 119999.99,
        discount: 12,
        category: 'Elektronik',
        image: 'https://via.placeholder.com/300x300/667eea/ffffff?text=iPhone+15+Pro',
        stock: 15,
        sku: 'IPH15PRO128',
        featured: true,
        status: 'Aktif',
        rating: 4.8,
        reviews: 125,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Samsung Galaxy S24',
        description: 'Samsung Galaxy S24 256GB Phantom Black',
        price: 89999.99,
        category: 'Elektronik',
        image: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Galaxy+S24',
        stock: 8,
        sku: 'SAMS24-256',
        featured: true,
        status: 'Aktif',
        rating: 4.6,
        reviews: 89,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '3',
        name: 'Kablosuz Kulaklık',
        description: 'Bluetooth 5.0 Kablosuz Kulaklık',
        price: 3337.97,
        category: 'Aksesuar',
        image: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Kulaklık',
        stock: 25,
        sku: 'BLT-KULAK',
        featured: false,
        status: 'Aktif',
        rating: 4.2,
        reviews: 45,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];
  }

  private getDemoCategories(): Category[] {
    return [
      {
        id: '1',
        name: 'Elektronik',
        description: 'Elektronik ürünler ve teknoloji',
        icon: '📱',
        color: '#667eea',
        status: 'Aktif',
        order: 1,
        slug: 'elektronik'
      },
      {
        id: '2',
        name: 'Aksesuar',
        description: 'Telefon ve bilgisayar aksesuarları',
        icon: '🎧',
        color: '#764ba2',
        status: 'Aktif',
        order: 2,
        slug: 'aksesuar'
      },
      {
        id: '3',
        name: 'Ev & Yaşam',
        description: 'Ev ve yaşam ürünleri',
        icon: '🏠',
        color: '#28a745',
        status: 'Aktif',
        order: 3,
        slug: 'ev-yasam'
      }
    ];
  }

  private getDemoSliders(): Slider[] {
    return [
      {
        id: '1',
        title: 'Yeni iPhone 15 Pro',
        description: 'Titanium tasarım, A17 Pro çip',
        image: 'https://via.placeholder.com/800x400/667eea/ffffff?text=iPhone+15+Pro',
        type: 'product',
        targetId: '1',
        status: 'Aktif',
        order: 1
      },
      {
        id: '2',
        title: 'Samsung Galaxy S24',
        description: 'Yapay zeka destekli kamera',
        image: 'https://via.placeholder.com/800x400/764ba2/ffffff?text=Galaxy+S24',
        type: 'product',
        targetId: '2',
        status: 'Aktif',
        order: 2
      }
    ];
  }

  private getDemoSettings(): SiteSettings {
    return {
      siteName: 'Nettenbegen',
      siteDescription: 'Güvenilir e-ticaret platformu',
      logo: 'https://via.placeholder.com/200x80/667eea/ffffff?text=Nettenbegen',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#28a745',
      currency: 'TL',
      freeShippingThreshold: 500,
      taxRate: 18,
      contactEmail: 'info@nettenbegen.com',
      contactPhone: '+90 555 123 4567',
      address: {
        street: 'Örnek Mahallesi, Örnek Sokak No:1',
        district: 'Kadıköy',
        city: 'İstanbul',
        postalCode: '34700',
        country: 'Türkiye'
      },
      socialMedia: {
        facebook: 'https://facebook.com/nettenbegen',
        instagram: 'https://instagram.com/nettenbegen',
        twitter: 'https://twitter.com/nettenbegen'
      }
    };
  }
}

export const apiService = new ApiService();
export default apiService;
