import { CartItem, BasketComparison, PlatformType, Restaurant } from '../types';

export const PLATFORM_CONFIG: Record<PlatformType, { name: string; color: string; bgLight: string; icon: string }> = {
  just_eat: {
    name: 'Just Eat',
    color: '#FF8000',
    bgLight: '#FFF5EB',
    icon: 'just_eat',
  },
  deliveroo: {
    name: 'Deliveroo',
    color: '#00CDBC',
    bgLight: '#E6FAF8',
    icon: 'deliveroo',
  },
  uber_eats: {
    name: 'Uber Eats',
    color: '#06C167',
    bgLight: '#E8F9F0',
    icon: 'uber_eats',
  },
};

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function calculateRestaurantSampleComparison(restaurant: Restaurant) {
  const platforms: PlatformType[] = ['just_eat', 'deliveroo', 'uber_eats'];
  
  const comparisons = platforms.map(p => {
    const pricing = restaurant.sampleItemPricing[p];
    const total = pricing.itemPrice + pricing.deliveryFee + pricing.serviceFee + pricing.discount;
    return {
      platform: p,
      pricing,
      total: Math.max(0, total)
    };
  });

  const cheapest = [...comparisons].sort((a, b) => a.total - b.total)[0];
  const mostExpensive = [...comparisons].sort((a, b) => b.total - a.total)[0];
  const maxSavings = Math.max(0, mostExpensive.total - cheapest.total);

  return {
    comparisons,
    cheapestPlatform: cheapest.platform,
    cheapestTotal: cheapest.total,
    mostExpensiveTotal: mostExpensive.total,
    maxSavings
  };
}

export function calculateBasketComparison(cartItems: CartItem[], restaurant: Restaurant): BasketComparison[] {
  const platforms: PlatformType[] = ['just_eat', 'deliveroo', 'uber_eats'];

  const results: BasketComparison[] = platforms.map(p => {
    const subtotal = cartItems.reduce((sum, ci) => {
      const price = ci.item.pricing[p] ?? ci.item.pricing.just_eat;
      return sum + price * ci.quantity;
    }, 0);

    const platformPricing = restaurant.sampleItemPricing[p];
    const deliveryFee = platformPricing.deliveryFee;
    const serviceFee = platformPricing.serviceFee;
    
    // Dynamic discount if basket over threshold
    let discount = platformPricing.discount;
    if (p === 'deliveroo' && subtotal >= 15) {
      discount = -2.50;
    } else if (p === 'just_eat' && subtotal >= 20) {
      discount = -3.00;
    } else if (p === 'uber_eats' && subtotal >= 25) {
      discount = -4.00;
    }

    const total = Math.max(0, subtotal + deliveryFee + serviceFee + discount);

    return {
      platform: p,
      subtotal,
      deliveryFee,
      serviceFee,
      discount,
      total,
      isCheapest: false,
      savingsVsHighest: 0
    };
  });

  // Determine cheapest and savings
  const sorted = [...results].sort((a, b) => a.total - b.total);
  const lowestTotal = sorted[0].total;
  const highestTotal = sorted[sorted.length - 1].total;

  return results.map(r => ({
    ...r,
    isCheapest: Math.abs(r.total - lowestTotal) < 0.01,
    savingsVsHighest: Math.max(0, highestTotal - r.total)
  }));
}
