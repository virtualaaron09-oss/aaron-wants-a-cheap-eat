import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Restaurant, PlatformType } from '../types';
import { calculateRestaurantSampleComparison, PLATFORM_CONFIG } from '../services/comparisonEngine';

interface Props {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant, onPress }) => {
  const { comparisons, cheapestPlatform, maxSavings } = calculateRestaurantSampleComparison(restaurant);
  const cheapestConfig = PLATFORM_CONFIG[cheapestPlatform];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(restaurant)}
      activeOpacity={0.92}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: restaurant.headerImage }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageOverlay} />

        {/* Rating & Distance Badges */}
        <View style={styles.topBadgesRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingScore}>{restaurant.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({restaurant.ratingCount})</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{restaurant.distanceMiles} miles</Text>
          </View>
        </View>

        {/* Big Savings Pill */}
        {maxSavings > 0.5 && (
          <View style={styles.savingsPill}>
            <Text style={styles.savingsFlame}>🔥</Text>
            <Text style={styles.savingsText}>
              Save up to £{maxSavings.toFixed(2)} on {cheapestConfig.name}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={styles.logoEmoji}>{restaurant.logo}</Text>
        </View>

        <Text style={styles.cuisineText}>
          {restaurant.cuisine} • {restaurant.tags.slice(0, 2).join(' • ')}
        </Text>

        <View style={styles.addressRow}>
          <Text style={styles.addressPin}>📍</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {restaurant.address}
          </Text>
        </View>

        {/* Sample Item Comparison Container */}
        <View style={styles.comparisonBox}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonLabel}>
              Sample: {restaurant.sampleItemName}
            </Text>
          </View>

          <View style={styles.platformRow}>
            {comparisons.map((c) => {
              const isCheapest = c.platform === cheapestPlatform;
              const pConfig = PLATFORM_CONFIG[c.platform];
              return (
                <View
                  key={c.platform}
                  style={[
                    styles.platformCol,
                    isCheapest && styles.platformColCheapest,
                  ]}
                >
                  <View style={styles.platformHeaderItem}>
                    <View
                      style={[
                        styles.platformDot,
                        { backgroundColor: pConfig.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.platformTitle,
                        isCheapest && styles.platformTitleBold,
                      ]}
                      numberOfLines={1}
                    >
                      {pConfig.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.platformTotal,
                      isCheapest && { color: '#047857', fontWeight: '900' },
                    ]}
                  >
                    £{c.total.toFixed(2)}
                  </Text>
                  {isCheapest && (
                    <View style={styles.cheapestMiniBadge}>
                      <Text style={styles.cheapestMiniText}>CHEAPEST</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.viewMenuText}>Compare Full Menu & Prices →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageWrapper: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  star: {
    fontSize: 12,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  ratingCount: {
    fontSize: 11,
    color: '#64748B',
  },
  distanceBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  savingsPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  savingsFlame: {
    fontSize: 12,
  },
  savingsText: {
    color: '#FACC15',
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  logoEmoji: {
    fontSize: 20,
  },
  cuisineText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  addressPin: {
    fontSize: 11,
  },
  addressText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  comparisonBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  comparisonHeader: {
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  platformRow: {
    flexDirection: 'row',
    gap: 6,
  },
  platformCol: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  platformColCheapest: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
  },
  platformHeaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  platformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  platformTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  platformTitleBold: {
    color: '#065F46',
    fontWeight: '800',
  },
  platformTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  cheapestMiniBadge: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 4,
  },
  cheapestMiniText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footerRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  viewMenuText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
});
