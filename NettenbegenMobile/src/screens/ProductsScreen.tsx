import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Product, Category } from '../types';
import apiService from '../services/api';

const { width } = Dimensions.get('window');
const numColumns = 2;

interface ProductsScreenProps {
  navigation: any;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);

      setProducts(productsData.filter(p => p.status === 'Aktif'));
      setCategories(categoriesData.filter(c => c.status === 'Aktif'));
    } catch (error) {
      console.error('Data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filterAndSortProducts = () => {
    let filteredProducts = products.filter(product => {
      // Arama filtresi
      const matchesQuery = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Kategori filtresi
      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    // Sıralama
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'price') {
        aValue = a.price;
        bValue = b.price;
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    setProducts(filteredProducts);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await apiService.addToCart(product, 1);
      // Başarı mesajı göster
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.productPriceContainer}>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>
              {item.originalPrice.toLocaleString('tr-TR')} TL
            </Text>
          )}
          <Text style={styles.productPrice}>
            {item.price.toLocaleString('tr-TR')} TL
          </Text>
        </View>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <MaterialIcons name="add-shopping-cart" size={16} color="white" />
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>%{item.discount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilterItem,
        selectedCategory === item.name && styles.selectedCategoryFilter,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.name ? '' : item.name)}
    >
      <Text
        style={[
          styles.categoryFilterText,
          selectedCategory === item.name && styles.selectedCategoryFilterText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#667eea" />
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#667eea" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialIcons name="filter-list" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Kategoriler</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryFilter}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFiltersList}
            />
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sıralama</Text>
            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'name' && styles.activeSortButton,
                ]}
                onPress={() => setSortBy('name')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>
                  İsim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'price' && styles.activeSortButton,
                ]}
                onPress={() => setSortBy('price')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'price' && styles.activeSortButtonText]}>
                  Fiyat
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'date' && styles.activeSortButton,
                ]}
                onPress={() => setSortBy('date')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'date' && styles.activeSortButtonText]}>
                  Tarih
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.sortOrderButton}
              onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <MaterialIcons
                name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                size={20}
                color="#667eea"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Ürün bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              Arama kriterlerinizi değiştirmeyi deneyin
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#667eea',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  categoryFiltersList: {
    paddingRight: 15,
  },
  categoryFilterItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryFilter: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryFilterText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activeSortButton: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeSortButtonText: {
    color: 'white',
  },
  sortOrderButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  productsList: {
    padding: 10,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productItem: {
    width: (width - 30) / numColumns,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#6c757d',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 2,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addToCartText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ProductsScreen;
