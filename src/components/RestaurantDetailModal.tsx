import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Restaurant, MenuItem, CartItem } from '../types';
import { PLATFORM_CONFIG } from '../services/comparisonEngine';

interface Props {
  visible: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (restaurant: Restaurant, item: MenuItem) => void;
  onRemoveFromCart: (itemId: string) => void;
  onOpenCart: () => void;
}

export const RestaurantDetailModal: React.FC<Props> = ({
  visible,
  restaurant,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onOpenCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!restaurant) return null;

  const categories = ['All', 'Mains', 'Sides', 'Drinks', 'Desserts'];

  const filteredMenu = activeCategory === 'All'
    ? restaurant.menu
    : restaurant.menu.filter((m) => m.category === activeCategory);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quick total estimate based on Just Eat pricing
  const quickSubtotal = cart.reduce((sum, item) => {
    return sum + (item.item.pricing.just_eat * item.quantity);
  }, 0);

  const getItemQuantity = (itemId: string) => {
    const found = cart.find((c) => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.navCloseBtn}>
            <Text style={styles.navCloseText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <TouchableOpacity onPress={onOpenCart} style={styles.navCartBtn}>
            <Text style={styles.navCartIcon}>🛒</Text>
            {totalCartCount > 0 && (
              <View style={styles.navCartBadge}>
                <Text style={styles.navCartBadgeText}>{totalCartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero Banner */}
          <View style={styles.heroWrapper}>
            <Image source={{ uri: restaurant.headerImage }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.cuisinePill}>
                  <Text style={styles.cuisinePillText}>{restaurant.cuisine}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingPillText}>⭐ {restaurant.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>{restaurant.name}</Text>
              <Text style={styles.heroAddress}>📍 {restaurant.address}</Text>
              <Text style={styles.heroSub}>{restaurant.tags.join(' • ')}</Text>
            </View>
          </View>

          {/* 3 Platforms Comparison Strip */}
          <View style={styles.platformCard}>
            <Text style={styles.platformCardTitle}>Delivery Fees & Delivery Times</Text>
            <View style={styles.platformStrip}>
              {(['just_eat', 'deliveroo', 'uber_eats'] as const).map((p) => {
                const conf = PLATFORM_CONFIG[p];
                const pricing = restaurant.sampleItemPricing[p];
                return (
                  <View key={p} style={styles.platformInfoCol}>
                    <View style={[styles.platformDot, { backgroundColor: conf.color }]} />
                    <Text style={styles.platformColName}>{conf.name}</Text>
                    <Text style={styles.platformColFee}>
                      Del: £{pricing.deliveryFee.toFixed(2)}
                    </Text>
                    <Text style={styles.platformColTime}>{pricing.estimatedDeliveryMins}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Category Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesBar}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catTab, isSelected && styles.catTabSelected]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.catTabText, isSelected && styles.catTabTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Menu Items List */}
          <View style={styles.menuList}>
            {filteredMenu.map((item) => {
              const qty = getItemQuantity(item.id);
              // Find cheapest platform for this item
              const prices = [
                { p: 'JE', val: item.pricing.just_eat },
                { p: 'ROO', val: item.pricing.deliveroo },
                { p: 'UBER', val: item.pricing.uber_eats },
              ];
              const minPrice = Math.min(...prices.map((x) => x.val));

              return (
                <View key={item.id} style={styles.menuItemCard}>
                  <View style={styles.menuItemContent}>
                    <View style={styles.menuItemTextCol}>
                      <View style={styles.dishHeaderRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                      </View>
                      <Text style={styles.itemDesc} numberOfLines={3}>
                        {item.description}
                      </Text>

                      {/* 3-Platform Price Breakdown for dish */}
                      <View style={styles.dishPricingRow}>
                        <View
                          style={[
                            styles.priceChip,
                            item.pricing.just_eat === minPrice && styles.priceChipBest,
                          ]}
                        >
                          <Text style={styles.priceChipLabel}>Just Eat:</Text>
                          <Text style={styles.priceChipVal}>
                            £{item.pricing.just_eat.toFixed(2)}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.priceChip,
                            item.pricing.deliveroo === minPrice && styles.priceChipBest,
                          ]}
                        >
                          <Text style={styles.priceChipLabel}>Deliveroo:</Text>
                          <Text style={styles.priceChipVal}>
                            £{item.pricing.deliveroo.toFixed(2)}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.priceChip,
                            item.pricing.uber_eats === minPrice && styles.priceChipBest,
                          ]}
                        >
                          <Text style={styles.priceChipLabel}>Uber Eats:</Text>
                          <Text style={styles.priceChipVal}>
                            £{item.pricing.uber_eats.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.menuItemRightCol}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      
                      {qty === 0 ? (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => onAddToCart(restaurant, item)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.addButtonText}>+ Add</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyControlRow}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => onRemoveFromCart(item.id)}
                          >
                            <Text style={styles.qtyBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{qty}</Text>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => onAddToCart(restaurant, item)}
                          >
                            <Text style={styles.qtyBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Cart & Compare Button */}
        {totalCartCount > 0 && (
          <View style={styles.floatingBottom}>
            <TouchableOpacity
              style={styles.compareCartButton}
              onPress={onOpenCart}
              activeOpacity={0.88}
            >
              <View style={styles.compareCartLeft}>
                <View style={styles.cartCountPill}>
                  <Text style={styles.cartCountPillText}>{totalCartCount}</Text>
                </View>
                <View>
                  <Text style={styles.compareCartSub}>Estimated from</Text>
                  <Text style={styles.compareCartTotal}>£{quickSubtotal.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.compareCartRight}>
                <Text style={styles.compareCartActionText}>Compare 3 Apps & Order</Text>
                <Text style={styles.compareCartArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  navCartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navCartIcon: {
    fontSize: 18,
  },
  navCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
  },
  heroWrapper: {
    height: 180,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  cuisinePill: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cuisinePillText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingPill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingPillText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  heroAddress: {
    color: '#BAE6FD',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroSub: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '500',
  },
  platformCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  platformCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  platformStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  platformInfoCol: {
    alignItems: 'center',
    flex: 1,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  platformColName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  platformColFee: {
    fontSize: 11,
    color: '#475569',
  },
  platformColTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  categoriesBar: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catTabSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  catTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  catTabTextSelected: {
    color: '#FFFFFF',
  },
  menuList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    gap: 12,
  },
  menuItemTextCol: {
    flex: 1,
  },
  dishHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  dishPricingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  priceChipBest: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  priceChipLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  priceChipVal: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuItemRightCol: {
    alignItems: 'center',
    width: 90,
  },
  itemImage: {
    width: 90,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  qtyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  floatingBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  compareCartButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compareCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartCountPill: {
    backgroundColor: '#F59E0B',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountPillText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  compareCartSub: {
    color: '#94A3B8',
    fontSize: 10,
  },
  compareCartTotal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  compareCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compareCartActionText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '800',
  },
  compareCartArrow: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
  },
});
