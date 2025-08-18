import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Product, Category, Slider } from '../types';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [slidersData, categoriesData, productsData] = await Promise.all([
        apiService.getSliders(),
        apiService.getCategories(),
        apiService.getProducts(),
      ]);

      setSliders(slidersData.filter(s => s.status === 'Aktif'));
      setCategories(categoriesData.filter(c => c.status === 'Aktif'));
      setFeaturedProducts(productsData.filter(p => p.featured && p.status === 'Aktif'));
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

  const handleSliderPress = (slider: Slider) => {
    if (slider.type === 'product' && slider.targetId) {
      navigation.navigate('ProductDetail', { productId: slider.targetId });
    } else if (slider.type === 'category' && slider.targetId) {
      navigation.navigate('CategoryProducts', { categoryId: slider.targetId });
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderSliderItem = ({ item }: { item: Slider }) => (
    <TouchableOpacity
      style={styles.sliderItem}
      onPress={() => handleSliderPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.sliderImage} />
      <View style={styles.sliderOverlay}>
        <Text style={styles.sliderTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.sliderDescription}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Text style={styles.categoryIconText}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

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
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        )}
      </View>
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>%{item.discount}</Text>
        </View>
      )}
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
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Nettenbegen</Text>
            <Text style={styles.headerSubtitle}>Güvenilir e-ticaret</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Search')}
            >
              <MaterialIcons name="search" size={24} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Slider */}
        {sliders.length > 0 && (
          <View style={styles.sliderContainer}>
            <FlatList
              data={sliders}
              renderItem={renderSliderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentSliderIndex(index);
              }}
            />
            <View style={styles.sliderDots}>
              {sliders.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentSliderIndex && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Products')}
          >
            <MaterialIcons name="store" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Tüm Ürünler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Orders')}
          >
            <MaterialIcons name="receipt" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Siparişlerim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <MaterialIcons name="person" size={24} color="#667eea" />
            <Text style={styles.quickActionText}>Profilim</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 8,
  },
  sliderContainer: {
    height: 200,
    marginVertical: 10,
  },
  sliderItem: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  sliderDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#667eea',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  productsList: {
    paddingHorizontal: 20,
  },
  productItem: {
    width: 160,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
