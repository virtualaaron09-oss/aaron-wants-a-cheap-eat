export type PlatformType = 'just_eat' | 'deliveroo' | 'uber_eats';

export interface PlatformPricing {
  available: boolean;
  itemPrice: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number; // e.g. -2.00
  discountLabel?: string; // e.g. '15% Off Over £15'
  estimatedDeliveryMins: string; // e.g. '25-35 min'
  appScheme: string; // e.g. 'just-eat://'
  webUrl: string; // e.g. 'https://www.just-eat.co.uk/restaurants-...'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Popular' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
  image: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  pricing: Record<PlatformType, number>; // base menu price on each platform (shows aggregator markup differences!)
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string; // Full physical takeaway address
  city: string;
  postcodeOutcodes: string[]; // Supported outcodes e.g. ['SW1A', 'SW1', 'W1'] or ['ALL']
  rating: number;
  ratingCount: number;
  distanceMiles: number;
  headerImage: string;
  logo: string;
  tags: string[]; // e.g. ['Halal', 'Burgers', 'Free Delivery over £15']
  sampleItemName: string; // For the quick comparison on the list card
  sampleItemPricing: Record<PlatformType, PlatformPricing>;
  menu: MenuItem[];
}

export interface CartItem {
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
}

export interface BasketComparison {
  platform: PlatformType;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  isCheapest: boolean;
  savingsVsHighest: number;
}

export interface PostcodeInfo {
  postcode: string;
  area: string;
  district: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderDetails {
  orderId: string;
  restaurantName: string;
  platformChosen: PlatformType | 'aaron_pay';
  items: CartItem[];
  total: number;
  savings: number;
  address: string;
  deliveryNotes: string;
  estimatedDeliveryTime: string;
  status: 'confirmed' | 'preparing' | 'on_the_way' | 'delivered';
}
