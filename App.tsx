import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Header } from './src/components/Header';
import { PostcodeModal } from './src/components/PostcodeModal';
import { SavingsBanner } from './src/components/SavingsBanner';
import { CuisineFilter } from './src/components/CuisineFilter';
import { RestaurantCard } from './src/components/RestaurantCard';
import { RestaurantDetailModal } from './src/components/RestaurantDetailModal';
import { CartModal } from './src/components/CartModal';
import { DirectCheckoutModal } from './src/components/DirectCheckoutModal';
import { OrderTrackingModal } from './src/components/OrderTrackingModal';
import { scrapeTakeawaysForPostcode } from './src/services/takeawayScraperService';
import { ALL_RESTAURANTS } from './src/data/mockRestaurants';
import { getDeviceLiveLocation } from './src/services/postcodeService';
import {
  PostcodeInfo,
  Restaurant,
  MenuItem,
  CartItem,
  PlatformType,
  OrderDetails,
} from './src/types';
import { calculateRestaurantSampleComparison } from './src/services/comparisonEngine';

export default function App() {
  // Postcode state
  const [currentPostcode, setCurrentPostcode] = useState<PostcodeInfo>({
    postcode: 'SW1A 1AA',
    area: 'Westminster',
    district: 'City of Westminster',
    city: 'London',
    region: 'London',
  });
  const [isPostcodeModalOpen, setIsPostcodeModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Live Scraped Takeaways
  const [liveRestaurants, setLiveRestaurants] = useState<Restaurant[]>(ALL_RESTAURANTS);
  const [isScraping, setIsScraping] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortFilter, setSortFilter] = useState<'all' | 'savings' | 'rating' | 'free_del'>('all');

  // Modals & Navigation
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutPlatform, setCheckoutPlatform] = useState<PlatformType>('just_eat');
  const [checkoutTotal, setCheckoutTotal] = useState<number>(0);
  const [checkoutSavings, setCheckoutSavings] = useState<number>(0);
  const [placedOrder, setPlacedOrder] = useState<OrderDetails | null>(null);
  const [lifetimeSavings, setLifetimeSavings] = useState<number>(42.60);

  // Live Scrape on Postcode Change
  useEffect(() => {
    let isMounted = true;
    setIsScraping(true);

    scrapeTakeawaysForPostcode(currentPostcode)
      .then((data) => {
        if (isMounted) {
          setLiveRestaurants(data);
          setIsScraping(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsScraping(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentPostcode]);

  // Handle Quick GPS Live Location
  const handleQuickLiveLocation = async () => {
    setIsLocating(true);
    try {
      const res = await getDeviceLiveLocation();
      if (res.success && res.data) {
        setCurrentPostcode(res.data);
      } else {
        setIsPostcodeModalOpen(true);
        if (res.error) {
          Alert.alert('Location Notice', res.error);
        }
      }
    } catch {
      setIsPostcodeModalOpen(true);
    } finally {
      setIsLocating(false);
    }
  };

  // Filtered & Sorted Outlets from Live Scraped Data
  const displayedRestaurants = useMemo(() => {
    let list = liveRestaurants;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.menu.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      list = list.filter((r) =>
        r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }

    // Sort tabs
    if (sortFilter === 'savings') {
      list = [...list].sort((a, b) => {
        const savA = calculateRestaurantSampleComparison(a).maxSavings;
        const savB = calculateRestaurantSampleComparison(b).maxSavings;
        return savB - savA;
      });
    } else if (sortFilter === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortFilter === 'free_del') {
      list = list.filter((r) =>
        r.tags.some((t) => t.toLowerCase().includes('free delivery'))
      );
    }

    return list;
  }, [liveRestaurants, searchQuery, selectedCuisine, sortFilter]);

  // Cart operations
  const handleAddToCart = (restaurant: Restaurant, item: MenuItem) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
      setCart([{ restaurantId: restaurant.id, restaurantName: restaurant.name, item, quantity: 1 }]);
    } else {
      setCart((prev) => {
        const existing = prev.find((c) => c.item.id === item.id);
        if (existing) {
          return prev.map((c) =>
            c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          );
        }
        return [...prev, { restaurantId: restaurant.id, restaurantName: restaurant.name, item, quantity: 1 }];
      });
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.item.id !== itemId);
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    if (delta > 0) {
      setCart((prev) =>
        prev.map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity + 1 } : c))
      );
    } else {
      handleRemoveFromCart(itemId);
    }
  };

  const handleOpenRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailModalOpen(true);
  };

  // Start direct checkout
  const handleDirectCheckout = (platform: PlatformType, total: number, savings: number) => {
    setCheckoutPlatform(platform);
    setCheckoutTotal(total);
    setCheckoutSavings(savings);
    setIsCartModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Completed payment
  const handlePaymentSuccess = ({
    address,
    instructions,
    total,
    savings,
  }: {
    address: string;
    instructions: string;
    total: number;
    savings: number;
  }) => {
    const newOrder: OrderDetails = {
      orderId: `AWCE-${Math.floor(100000 + Math.random() * 900000)}`,
      restaurantName: selectedRestaurant?.name || 'Takeaway',
      platformChosen: checkoutPlatform,
      items: [...cart],
      total,
      savings,
      address,
      deliveryNotes: instructions,
      estimatedDeliveryTime: '25-35 mins',
      status: 'confirmed',
    };

    setPlacedOrder(newOrder);
    setLifetimeSavings((prev) => prev + savings);
    setCart([]);
    setIsCheckoutModalOpen(false);
    setIsDetailModalOpen(false);
    setIsTrackingModalOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header with 1-Tap GPS Live Location */}
      <Header
        currentPostcode={currentPostcode}
        onPressPostcode={() => setIsPostcodeModalOpen(true)}
        onPressLiveLocation={handleQuickLiveLocation}
        isLocating={isLocating}
        cartCount={totalCartCount}
        onPressCart={() => setIsCartModalOpen(true)}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Savings Tracker Banner */}
        <SavingsBanner totalSavingsTracker={lifetimeSavings} />

        {/* Live Scrape Status Banner */}
        {isScraping ? (
          <View style={styles.scrapingBanner}>
            <ActivityIndicator size="small" color="#0284C7" />
            <Text style={styles.scrapingText}>
              Scraping takeaways in {currentPostcode.postcode} from Just Eat, Deliveroo & Uber Eats...
            </Text>
          </View>
        ) : null}

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes, takeaways, addresses..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sort Filter Tabs */}
        <View style={styles.sortFilterBar}>
          <TouchableOpacity
            style={[styles.sortTab, sortFilter === 'all' && styles.sortTabActive]}
            onPress={() => setSortFilter('all')}
          >
            <Text style={[styles.sortTabText, sortFilter === 'all' && styles.sortTabTextActive]}>
              All Outlets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortTab, sortFilter === 'savings' && styles.sortTabActive]}
            onPress={() => setSortFilter('savings')}
          >
            <Text style={[styles.sortTabText, sortFilter === 'savings' && styles.sortTabTextActive]}>
              🔥 Biggest Savings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortTab, sortFilter === 'free_del' && styles.sortTabActive]}
            onPress={() => setSortFilter('free_del')}
          >
            <Text style={[styles.sortTabText, sortFilter === 'free_del' && styles.sortTabTextActive]}>
              🚚 Free Delivery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortTab, sortFilter === 'rating' && styles.sortTabActive]}
            onPress={() => setSortFilter('rating')}
          >
            <Text style={[styles.sortTabText, sortFilter === 'rating' && styles.sortTabTextActive]}>
              ⭐ Top Rated
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cuisine Filter Scroll */}
        <CuisineFilter
          selectedCuisine={selectedCuisine}
          onSelectCuisine={setSelectedCuisine}
        />

        {/* Section Title with Live Postcode and Area */}
        <View style={styles.sectionHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.locationTagRow}>
              <Text style={styles.locationTagPin}>📍</Text>
              <Text style={styles.sectionTitle}>
                Takeaways delivering to {currentPostcode.postcode}
              </Text>
            </View>
            <View style={styles.liveMetaRow}>
              <View style={styles.liveDot} />
              <Text style={styles.sectionSubtitle}>
                {displayedRestaurants.length} verified takeaways in {currentPostcode.area || currentPostcode.city} • Comparing Just Eat vs Deliveroo vs Uber Eats
              </Text>
            </View>
          </View>
        </View>

        {/* Restaurant Cards */}
        {displayedRestaurants.length === 0 && !isScraping ? (
          <View style={styles.emptySearch}>
            <Text style={styles.emptySearchEmoji}>🍽️</Text>
            <Text style={styles.emptySearchTitle}>No takeaways found</Text>
            <Text style={styles.emptySearchSub}>
              Try searching for something else or reset your filters.
            </Text>
            <TouchableOpacity
              style={styles.resetFiltersBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCuisine('all');
                setSortFilter('all');
              }}
            >
              <Text style={styles.resetFiltersText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={handleOpenRestaurant}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Postcode Selection Modal */}
      <PostcodeModal
        visible={isPostcodeModalOpen}
        onClose={() => setIsPostcodeModalOpen(false)}
        currentPostcode={currentPostcode}
        onSelectPostcode={(info) => setCurrentPostcode(info)}
      />

      {/* Restaurant Menu Modal */}
      <RestaurantDetailModal
        visible={isDetailModalOpen}
        restaurant={selectedRestaurant}
        onClose={() => setIsDetailModalOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onOpenCart={() => {
          setIsDetailModalOpen(false);
          setIsCartModalOpen(true);
        }}
      />

      {/* Cart & 3-Way Platform Comparison Modal */}
      <CartModal
        visible={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cart={cart}
        restaurant={
          selectedRestaurant ||
          (cart.length > 0
            ? liveRestaurants.find((r) => r.id === cart[0].restaurantId) || null
            : null)
        }
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
        onDirectCheckout={handleDirectCheckout}
      />

      {/* Direct Payment Checkout Modal */}
      <DirectCheckoutModal
        visible={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        platform={checkoutPlatform}
        total={checkoutTotal}
        savings={checkoutSavings}
        postcodeInfo={currentPostcode}
        restaurantName={selectedRestaurant?.name || 'Takeaway'}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Order Live Tracker Modal */}
      <OrderTrackingModal
        visible={isTrackingModalOpen}
        order={placedOrder}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingBottom: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  scrapingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  scrapingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
  },
  sortFilterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    overflow: 'scroll',
  },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortTabActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  sortTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  sortTabTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 12,
  },
  locationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationTagPin: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },
  liveMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
  },
  emptySearchEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptySearchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySearchSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFiltersBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetFiltersText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
