import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { CartItem, Restaurant, PlatformType } from '../types';
import {
  calculateBasketComparison,
  PLATFORM_CONFIG,
  formatGBP,
} from '../services/comparisonEngine';
import { openPlatformLink } from '../services/linkingService';

interface Props {
  visible: boolean;
  onClose: () => void;
  cart: CartItem[];
  restaurant: Restaurant | null;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onDirectCheckout: (platform: PlatformType, total: number, savings: number) => void;
}

export const CartModal: React.FC<Props> = ({
  visible,
  onClose,
  cart,
  restaurant,
  onUpdateQuantity,
  onClearCart,
  onDirectCheckout,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('just_eat');

  if (!restaurant || cart.length === 0) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <SafeAreaView style={styles.emptyContainer}>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={onClose} style={styles.navCloseBtn}>
              <Text style={styles.navCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.navTitle}>Your Basket</Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={styles.emptyContent}>
            <Text style={styles.emptyEmoji}>🧺</Text>
            <Text style={styles.emptyTitle}>Your basket is empty</Text>
            <Text style={styles.emptySub}>
              Add some tasty dishes from {restaurant?.name || 'a takeaway'} to compare Just Eat, Deliveroo, and Uber Eats prices!
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.browseBtn}>
              <Text style={styles.browseBtnText}>Explore Menu</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  const comparisons = calculateBasketComparison(cart, restaurant);
  const cheapestComp = comparisons.find((c) => c.isCheapest) || comparisons[0];
  const activeComp = comparisons.find((c) => c.platform === selectedPlatform) || comparisons[0];
  const activeConfig = PLATFORM_CONFIG[selectedPlatform];
  const cheapestConfig = PLATFORM_CONFIG[cheapestComp.platform];

  const handleRedirectToVendor = async () => {
    const pricing = restaurant.sampleItemPricing[selectedPlatform];
    const success = await openPlatformLink(
      selectedPlatform,
      pricing.appScheme,
      pricing.webUrl,
      restaurant.name
    );
    if (success) {
      // Prompt user
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Nav Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.navCloseBtn}>
            <Text style={styles.navCloseText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.navTitleWrapper}>
            <Text style={styles.navTitle}>Price Comparison</Text>
            <Text style={styles.navSub}>{restaurant.name}</Text>
          </View>
          <TouchableOpacity onPress={onClearCart} style={styles.navClearBtn}>
            <Text style={styles.navClearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Winner Banner */}
          <View style={styles.winnerBanner}>
            <View style={styles.winnerLeft}>
              <Text style={styles.winnerTrophy}>🏆</Text>
              <View>
                <Text style={styles.winnerTitle}>
                  {cheapestConfig.name} is the Cheapest!
                </Text>
                <Text style={styles.winnerSubtitle}>
                  Aaron saves up to {formatGBP(cheapestComp.savingsVsHighest)} on this exact order
                </Text>
              </View>
            </View>
          </View>

          {/* 3-Platform Tabs */}
          <View style={styles.platformSelector}>
            {comparisons.map((comp) => {
              const conf = PLATFORM_CONFIG[comp.platform];
              const isSelected = comp.platform === selectedPlatform;
              return (
                <TouchableOpacity
                  key={comp.platform}
                  style={[
                    styles.platformTab,
                    isSelected && { borderColor: conf.color, backgroundColor: conf.bgLight },
                    comp.isCheapest && styles.platformTabCheapest,
                  ]}
                  onPress={() => setSelectedPlatform(comp.platform)}
                  activeOpacity={0.8}
                >
                  {comp.isCheapest && (
                    <View style={styles.bestPricePill}>
                      <Text style={styles.bestPricePillText}>BEST DEAL</Text>
                    </View>
                  )}
                  <View style={[styles.platformDot, { backgroundColor: conf.color }]} />
                  <Text style={[styles.platformTabName, isSelected && { color: conf.color }]}>
                    {conf.name}
                  </Text>
                  <Text style={styles.platformTabPrice}>{formatGBP(comp.total)}</Text>
                  {comp.savingsVsHighest > 0 ? (
                    <Text style={styles.platformTabSavings}>
                      Save {formatGBP(comp.savingsVsHighest)}
                    </Text>
                  ) : (
                    <Text style={styles.platformTabHighest}>Highest</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Itemized Basket */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Your Items ({cart.length})</Text>
            {cart.map((cartItem) => {
              const priceOnSelected = cartItem.item.pricing[selectedPlatform];
              return (
                <View key={cartItem.item.id} style={styles.cartItemRow}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{cartItem.item.name}</Text>
                    <Text style={styles.cartItemUnitPrice}>
                      {formatGBP(priceOnSelected)} each on {activeConfig.name}
                    </Text>
                  </View>

                  <View style={styles.cartItemRight}>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity
                        style={styles.qtyMinusBtn}
                        onPress={() => onUpdateQuantity(cartItem.item.id, -1)}
                      >
                        <Text style={styles.qtyMinusText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyVal}>{cartItem.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyPlusBtn}
                        onPress={() => onUpdateQuantity(cartItem.item.id, 1)}
                      >
                        <Text style={styles.qtyPlusText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cartItemTotal}>
                      {formatGBP(priceOnSelected * cartItem.quantity)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Cost Breakdown for Selected Platform */}
          <View style={styles.sectionCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.sectionTitle}>Breakdown on {activeConfig.name}</Text>
              <View
                style={[
                  styles.activePlatformPill,
                  { backgroundColor: activeConfig.bgLight },
                ]}
              >
                <Text style={[styles.activePlatformPillText, { color: activeConfig.color }]}>
                  {activeConfig.name}
                </Text>
              </View>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Items Subtotal</Text>
              <Text style={styles.breakdownVal}>{formatGBP(activeComp.subtotal)}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Delivery Fee</Text>
              <Text style={styles.breakdownVal}>{formatGBP(activeComp.deliveryFee)}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Service Fee</Text>
              <Text style={styles.breakdownVal}>{formatGBP(activeComp.serviceFee)}</Text>
            </View>

            {activeComp.discount < 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: '#10B981', fontWeight: '700' }]}>
                  Special Offer Applied
                </Text>
                <Text style={[styles.breakdownVal, { color: '#10B981', fontWeight: '800' }]}>
                  {formatGBP(activeComp.discount)}
                </Text>
              </View>
            )}

            <View style={styles.breakdownDivider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Checkout Price</Text>
                <Text style={styles.totalSub}>Incl. all taxes & platform fees</Text>
              </View>
              <Text style={styles.totalAmount}>{formatGBP(activeComp.total)}</Text>
            </View>
          </View>

          {/* Savings Callout */}
          {activeComp.savingsVsHighest > 0 && (
            <View style={styles.savingsCallout}>
              <Text style={styles.savingsCalloutIcon}>💡</Text>
              <Text style={styles.savingsCalloutText}>
                Choosing {activeConfig.name} over the most expensive app saves you{' '}
                <Text style={{ fontWeight: '800', color: '#0F172A' }}>
                  {formatGBP(activeComp.savingsVsHighest)}
                </Text>
                !
              </Text>
            </View>
          )}

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Dual Checkout Action Panel */}
        <View style={styles.checkoutFooter}>
          {/* Path 1: Direct in-app payment */}
          <TouchableOpacity
            style={styles.directPayButton}
            onPress={() =>
              onDirectCheckout(
                selectedPlatform,
                activeComp.total,
                activeComp.savingsVsHighest
              )
            }
            activeOpacity={0.88}
          >
            <View style={styles.directPayLeft}>
              <Text style={styles.directPayBolt}>⚡</Text>
              <View>
                <Text style={styles.directPayTitle}>Direct In-App Checkout</Text>
                <Text style={styles.directPaySub}>Apple Pay, Google Pay, Card</Text>
              </View>
            </View>
            <Text style={styles.directPayPrice}>{formatGBP(activeComp.total)}</Text>
          </TouchableOpacity>

          {/* Path 2: Open in vendor/aggregator website or app */}
          <TouchableOpacity
            style={[styles.vendorRedirectBtn, { borderColor: activeConfig.color }]}
            onPress={handleRedirectToVendor}
            activeOpacity={0.8}
          >
            <Text style={[styles.vendorRedirectText, { color: activeConfig.color }]}>
              Open & Order on {activeConfig.name} Website / App ↗
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  navTitleWrapper: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  navSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  navClearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  navClearText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  winnerBanner: {
    backgroundColor: '#ECFDF5',
    margin: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  winnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  winnerTrophy: {
    fontSize: 28,
  },
  winnerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#065F46',
  },
  winnerSubtitle: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '600',
    marginTop: 2,
  },
  platformSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  platformTab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  platformTabCheapest: {
    borderColor: '#10B981',
  },
  bestPricePill: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestPricePillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  platformTabName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 2,
  },
  platformTabPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  platformTabSavings: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 2,
  },
  platformTabHighest: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cartItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cartItemUnitPrice: {
    fontSize: 11,
    color: '#64748B',
  },
  cartItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  qtyMinusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyMinusText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  qtyVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 4,
  },
  qtyPlusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyPlusText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 50,
    textAlign: 'right',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activePlatformPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activePlatformPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalSub: {
    fontSize: 10,
    color: '#94A3B8',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  savingsCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  savingsCalloutIcon: {
    fontSize: 18,
  },
  savingsCalloutText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  checkoutFooter: {
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
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  directPayButton: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directPayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  directPayBolt: {
    fontSize: 20,
  },
  directPayTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  directPaySub: {
    color: '#94A3B8',
    fontSize: 10,
  },
  directPayPrice: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '900',
  },
  vendorRedirectBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  vendorRedirectText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
