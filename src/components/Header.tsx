import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PostcodeInfo } from '../types';

interface Props {
  currentPostcode: PostcodeInfo;
  onPressPostcode: () => void;
  onPressLiveLocation?: () => void;
  isLocating?: boolean;
  cartCount: number;
  onPressCart: () => void;
}

export const Header: React.FC<Props> = ({
  currentPostcode,
  onPressPostcode,
  onPressLiveLocation,
  isLocating = false,
  cartCount,
  onPressCart,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>🔥</Text>
            <Text style={styles.brandSub}>PRICE CHECKER</Text>
          </View>
          <Text style={styles.title}>Aaron wants a cheap eat</Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={onPressCart}
          activeOpacity={0.7}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.postcodeRow}>
        <TouchableOpacity
          style={styles.postcodeBar}
          onPress={onPressPostcode}
          activeOpacity={0.8}
        >
          <View style={styles.postcodeLeft}>
            <Text style={styles.pinIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.postcodeLabel}>Delivering to</Text>
              <Text style={styles.postcodeValue} numberOfLines={1}>
                {currentPostcode.postcode} • {currentPostcode.area || currentPostcode.city}
              </Text>
            </View>
          </View>
          <View style={styles.changeBadge}>
            <Text style={styles.changeText}>Change</Text>
          </View>
        </TouchableOpacity>

        {onPressLiveLocation && (
          <TouchableOpacity
            style={[styles.gpsButton, isLocating && styles.gpsButtonLoading]}
            onPress={onPressLiveLocation}
            disabled={isLocating}
            activeOpacity={0.7}
          >
            <Text style={styles.gpsIcon}>{isLocating ? '⏳' : '🎯'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleContainer: {
    flex: 1,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  brandIcon: {
    fontSize: 12,
  },
  brandSub: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cartIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  postcodeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  postcodeBar: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  postcodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 6,
  },
  pinIcon: {
    fontSize: 18,
  },
  postcodeLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  postcodeValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  changeBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  changeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  gpsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  gpsButtonLoading: {
    borderColor: '#F59E0B',
    opacity: 0.8,
  },
  gpsIcon: {
    fontSize: 18,
  },
});
