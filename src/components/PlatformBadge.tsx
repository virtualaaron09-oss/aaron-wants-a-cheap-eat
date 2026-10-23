import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlatformType } from '../types';
import { PLATFORM_CONFIG } from '../services/comparisonEngine';

interface Props {
  platform: PlatformType;
  price?: number;
  isCheapest?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const PlatformBadge: React.FC<Props> = ({
  platform,
  price,
  isCheapest = false,
  size = 'medium'
}) => {
  const config = PLATFORM_CONFIG[platform];

  const getPlatformIcon = () => {
    switch (platform) {
      case 'just_eat':
        return 'JE';
      case 'deliveroo':
        return 'ROO';
      case 'uber_eats':
        return 'UBER';
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isCheapest ? config.color : config.bgLight },
        isCheapest && styles.cheapestGlow,
        size === 'small' && styles.containerSmall,
        size === 'large' && styles.containerLarge,
      ]}
    >
      <View style={styles.contentRow}>
        <View
          style={[
            styles.logoPill,
            { backgroundColor: isCheapest ? '#FFFFFF' : config.color }
          ]}
        >
          <Text
            style={[
              styles.logoText,
              { color: isCheapest ? config.color : '#FFFFFF' }
            ]}
          >
            {getPlatformIcon()}
          </Text>
        </View>

        <Text
          style={[
            styles.platformName,
            { color: isCheapest ? '#FFFFFF' : '#1E293B' },
            size === 'small' && styles.textSmall,
          ]}
        >
          {config.name}
        </Text>
      </View>

      {price !== undefined && (
        <Text
          style={[
            styles.priceText,
            { color: isCheapest ? '#FFFFFF' : '#0F172A' },
            size === 'small' && styles.priceSmall,
          ]}
        >
          £{price.toFixed(2)}
        </Text>
      )}

      {isCheapest && (
        <View style={styles.cheapestTag}>
          <Text style={styles.cheapestTagText}>CHEAPEST</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  containerLarge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cheapestGlow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  platformName: {
    fontSize: 13,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 11,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
  priceSmall: {
    fontSize: 12,
  },
  cheapestTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  cheapestTagText: {
    color: '#FACC15',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
