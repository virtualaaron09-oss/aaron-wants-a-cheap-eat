import { Restaurant, PostcodeInfo } from '../types';

export const ALL_RESTAURANTS: Restaurant[] = [
  // ─── LONDON TAKEAWAYS ───
  {
    id: 'lon-1',
    name: 'Skewers Mangal',
    cuisine: 'Turkish & Kebabs',
    address: '112 Vauxhall Bridge Rd, London, SW1V 2RQ',
    city: 'London',
    postcodeOutcodes: ['SW1A', 'SW1', 'SW1V', 'SW1P', 'SW1E', 'W1', 'WC1', 'EC1', 'SE1'],
    rating: 5.0,
    ratingCount: 446,
    distanceMiles: 0.7,
    headerImage: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=80',
    logo: '🥙',
    tags: ['Turkish', 'Kebab', 'Halal', 'Live Scraped'],
    sampleItemName: 'Mixed Lamb & Chicken Shish Platter',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 10.80,
        deliveryFee: 0.69,
        serviceFee: 0.80,
        discount: 0,
        estimatedDeliveryMins: '20-35 min',
        appScheme: 'just-eat://restaurant/skewersmangal-london',
        webUrl: 'https://www.just-eat.co.uk/restaurants-skewersmangal-london'
      },
      deliveroo: {
        available: true,
        itemPrice: 11.90,
        deliveryFee: 1.79,
        serviceFee: 1.39,
        discount: -2.00,
        discountLabel: '£2 off over £12',
        estimatedDeliveryMins: '15-25 min',
        appScheme: 'deliveroo://search?q=Skewers%20Mangal',
        webUrl: 'https://deliveroo.co.uk/search?q=Skewers%20Mangal'
      },
      uber_eats: {
        available: true,
        itemPrice: 12.20,
        deliveryFee: 2.29,
        serviceFee: 1.50,
        discount: 0,
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'ubereats://search?q=Skewers%20Mangal',
        webUrl: 'https://www.ubereats.com/search?q=Skewers%20Mangal'
      }
    },
    menu: [
      {
        id: 'sk1',
        name: 'The Aaron Mixed Mangal Platter',
        description: 'Prime sliced lamb doner, marinated chicken shish, grilled peppers and fluffy pilaf rice with chili and garlic sauces.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 10.80, deliveroo: 11.90, uber_eats: 12.20 }
      },
      {
        id: 'sk2',
        name: 'Charcoal Grilled Chicken Shish Wrap',
        description: 'Fresh lavash flatbread rolled with marinated tender chicken breast, sumac onion salad and garlic sauce.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 8.90, deliveroo: 9.80, uber_eats: 10.20 }
      },
      {
        id: 'sk3',
        name: 'Halloumi Fries & Sweet Chili',
        description: 'Crispy fried halloumi sticks dusted with zaatar herbs.',
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 4.50, deliveroo: 5.10, uber_eats: 5.30 }
      }
    ]
  },
  {
    id: 'lon-2',
    name: 'Honest Burgers - Brewer Street',
    cuisine: 'Burgers & Shakes',
    address: '84 Brewer Street, Soho, London, W1F 9UB',
    city: 'London',
    postcodeOutcodes: ['SW1A', 'SW1', 'W1', 'W1F', 'WC1', 'WC2', 'EC1'],
    rating: 4.8,
    ratingCount: 1680,
    distanceMiles: 0.7,
    headerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    logo: '🍔',
    tags: ['British Beef', 'Rosemary Fries Included', 'Top Rated'],
    sampleItemName: 'Honest Beef Burger + Rosemary Salt Fries',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 11.50,
        deliveryFee: 0.99,
        serviceFee: 0.80,
        discount: 0,
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'just-eat://restaurant/honest-burgers-brewer-street-london',
        webUrl: 'https://www.just-eat.co.uk/restaurants-honest-burgers-brewer-street-london'
      },
      deliveroo: {
        available: true,
        itemPrice: 12.90,
        deliveryFee: 1.89,
        serviceFee: 1.49,
        discount: -2.50,
        discountLabel: '£2.50 off over £12',
        estimatedDeliveryMins: '15-25 min',
        appScheme: 'deliveroo://search?q=Honest%20Burgers',
        webUrl: 'https://deliveroo.co.uk/search?q=Honest%20Burgers'
      },
      uber_eats: {
        available: true,
        itemPrice: 13.20,
        deliveryFee: 2.49,
        serviceFee: 1.65,
        discount: 0,
        estimatedDeliveryMins: '25-35 min',
        appScheme: 'ubereats://search?q=Honest%20Burgers',
        webUrl: 'https://www.ubereats.com/search?q=Honest%20Burgers'
      }
    },
    menu: [
      {
        id: 'hb1',
        name: 'The Honest Double Cheeseburger',
        description: 'Honest beef, cheddar, red onion relish, smoked bacon and pickles. Served with rosemary salted chips.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 11.50, deliveroo: 12.90, uber_eats: 13.20 }
      },
      {
        id: 'hb2',
        name: 'Signature Rosemary Salted Fries',
        description: 'Hand-cut British potatoes cooked extra crisp with fresh rosemary salt.',
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 3.80, deliveroo: 4.20, uber_eats: 4.50 }
      }
    ]
  },
  {
    id: 'lon-3',
    name: 'You Me Sushi - Victoria',
    cuisine: 'Sushi & Japanese',
    address: '27 Strutton Ground, Victoria, London, SW1P 2HY',
    city: 'London',
    postcodeOutcodes: ['SW1A', 'SW1', 'SW1P', 'SW1E', 'W1', 'WC2'],
    rating: 5.0,
    ratingCount: 141,
    distanceMiles: 0.4,
    headerImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    logo: '🍣',
    tags: ['Fresh Fish Daily', 'Bento', 'Japanese'],
    sampleItemName: 'Salmon Dragon Roll + Chicken Gyoza',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 10.50,
        deliveryFee: 0.79,
        serviceFee: 0.70,
        discount: 0,
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'just-eat://restaurant/you-me-sushi---victoria-london',
        webUrl: 'https://www.just-eat.co.uk/restaurants-you-me-sushi---victoria-london'
      },
      deliveroo: {
        available: true,
        itemPrice: 11.50,
        deliveryFee: 1.69,
        serviceFee: 1.25,
        discount: -2.00,
        discountLabel: '£2 off voucher',
        estimatedDeliveryMins: '15-25 min',
        appScheme: 'deliveroo://search?q=You%20Me%20Sushi',
        webUrl: 'https://deliveroo.co.uk/search?q=You%20Me%20Sushi'
      },
      uber_eats: {
        available: true,
        itemPrice: 11.90,
        deliveryFee: 2.10,
        serviceFee: 1.45,
        discount: 0,
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'ubereats://search?q=You%20Me%20Sushi',
        webUrl: 'https://www.ubereats.com/search?q=You%20Me%20Sushi'
      }
    },
    menu: [
      {
        id: 'ym1',
        name: 'Salmon & Avocado Dragon Roll',
        description: 'Fresh Atlantic salmon, ripe avocado, Japanese mayo and tobiko roe.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 9.80, deliveroo: 10.90, uber_eats: 11.20 }
      },
      {
        id: 'ym2',
        name: 'Crispy Chicken Katsu Curry',
        description: 'Panko breaded fried chicken with rich mild Japanese curry sauce and steamed rice.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 9.50, deliveroo: 10.50, uber_eats: 10.90 }
      }
    ]
  },
  {
    id: 'lon-4',
    name: 'Pizza Express - Victoria Street',
    cuisine: 'Pizza & Italian',
    address: '85 Victoria Street, Westminster, London, SW1H 0HW',
    city: 'London',
    postcodeOutcodes: ['SW1A', 'SW1', 'SW1H', 'SW1P', 'SW1E', 'W1'],
    rating: 5.0,
    ratingCount: 890,
    distanceMiles: 0.3,
    headerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    logo: '🍕',
    tags: ['Classic Dough', 'Romana Base', 'Italian'],
    sampleItemName: 'American Hot Romana Pizza + Dough Balls',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 12.00,
        deliveryFee: 1.39,
        serviceFee: 0.85,
        discount: 0,
        estimatedDeliveryMins: '25-35 min',
        appScheme: 'just-eat://restaurant/pizzaexpress-london-victoria-street-london',
        webUrl: 'https://www.just-eat.co.uk/restaurants-pizzaexpress-london-victoria-street-london'
      },
      deliveroo: {
        available: true,
        itemPrice: 12.90,
        deliveryFee: 2.10,
        serviceFee: 1.40,
        discount: -2.50,
        discountLabel: '£2.50 off over £15',
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'deliveroo://search?q=Pizza%20Express',
        webUrl: 'https://deliveroo.co.uk/search?q=Pizza%20Express'
      },
      uber_eats: {
        available: true,
        itemPrice: 13.50,
        deliveryFee: 2.49,
        serviceFee: 1.55,
        discount: 0,
        estimatedDeliveryMins: '25-35 min',
        appScheme: 'ubereats://search?q=Pizza%20Express',
        webUrl: 'https://www.ubereats.com/search?q=Pizza%20Express'
      }
    },
    menu: [
      {
        id: 'pe1',
        name: 'American Hot Romana Pizza',
        description: 'Crispy thin crust Romana with pepperoni, hot green jalapeño peppers, mozzarella and tomato sauce.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 12.00, deliveroo: 12.90, uber_eats: 13.50 }
      },
      {
        id: 'pe2',
        name: 'Famous Dough Balls & Garlic Butter',
        description: 'Freshly oven-baked dough balls served with melted garlic butter.',
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 4.80, deliveroo: 5.20, uber_eats: 5.40 }
      }
    ]
  },

  // ─── MANCHESTER TAKEAWAYS ───
  {
    id: 'man-1',
    name: 'Wah Ji Wah',
    cuisine: 'Indian & Curries',
    address: '37 King Street West, Manchester, M3 2PW',
    city: 'Manchester',
    postcodeOutcodes: ['M1', 'M2', 'M3', 'M4', 'M14', 'M15', 'M20'],
    rating: 4.8,
    ratingCount: 650,
    distanceMiles: 0.5,
    headerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    logo: '🍛',
    tags: ['Authentic Indian', 'Tandoori', 'Manchester Local'],
    sampleItemName: 'Butter Chicken + Garlic Naan',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 11.50,
        deliveryFee: 2.29,
        serviceFee: 0.80,
        discount: 0,
        estimatedDeliveryMins: '25-35 min',
        appScheme: 'just-eat://restaurant/wah-ji-wah-manchester',
        webUrl: 'https://www.just-eat.co.uk/search?q=Wah%20Ji%20Wah'
      },
      deliveroo: {
        available: true,
        itemPrice: 12.50,
        deliveryFee: 2.79,
        serviceFee: 1.35,
        discount: -2.00,
        discountLabel: '£2 off over £12',
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'deliveroo://search?q=Wah%20Ji%20Wah',
        webUrl: 'https://deliveroo.co.uk/search?q=Wah%20Ji%20Wah'
      },
      uber_eats: {
        available: true,
        itemPrice: 12.90,
        deliveryFee: 3.10,
        serviceFee: 1.55,
        discount: 0,
        estimatedDeliveryMins: '30-40 min',
        appScheme: 'ubereats://search?q=Wah%20Ji%20Wah',
        webUrl: 'https://www.ubereats.com/search?q=Wah%20Ji%20Wah'
      }
    },
    menu: [
      {
        id: 'wjw1',
        name: 'Delhi Style Butter Chicken',
        description: 'Slow-simmered tandoori chicken chunks in rich aromatic tomato butter makhani sauce.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 10.50, deliveroo: 11.50, uber_eats: 11.90 }
      }
    ]
  },
  {
    id: 'man-2',
    name: "Archie's Piccadilly",
    cuisine: 'Burgers & Shakes',
    address: '6-8 Ranelagh St, Piccadilly, Manchester, M1 1LZ',
    city: 'Manchester',
    postcodeOutcodes: ['M1', 'M2', 'M3', 'M4', 'M14', 'M15', 'M20'],
    rating: 4.8,
    ratingCount: 3120,
    distanceMiles: 0.3,
    headerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    logo: '🍔',
    tags: ['Manchester Legend', 'Halal', 'Celebrity Shakes'],
    sampleItemName: 'The Superstar Smash Burger + Lotus Shake',
    sampleItemPricing: {
      just_eat: {
        available: true,
        itemPrice: 10.99,
        deliveryFee: 1.20,
        serviceFee: 0.70,
        discount: 0,
        estimatedDeliveryMins: '20-30 min',
        appScheme: 'just-eat://restaurant/archies-piccadilly',
        webUrl: 'https://www.just-eat.co.uk/search?q=Archies%20Piccadilly'
      },
      deliveroo: {
        available: true,
        itemPrice: 11.99,
        deliveryFee: 1.99,
        serviceFee: 1.29,
        discount: -2.00,
        discountLabel: '£2 off over £15',
        estimatedDeliveryMins: '15-25 min',
        appScheme: 'deliveroo://search?q=Archies',
        webUrl: 'https://deliveroo.co.uk/search?q=Archies'
      },
      uber_eats: {
        available: true,
        itemPrice: 12.49,
        deliveryFee: 2.49,
        serviceFee: 1.50,
        discount: 0,
        estimatedDeliveryMins: '25-35 min',
        appScheme: 'ubereats://search?q=Archies',
        webUrl: 'https://www.ubereats.com/search?q=Archies'
      }
    },
    menu: [
      {
        id: 'arch1',
        name: 'The Superstar Double Smash',
        description: 'Two smashed patties, American cheese, grilled onions and Archie pink sauce.',
        category: 'Mains',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        pricing: { just_eat: 9.99, deliveroo: 10.99, uber_eats: 11.49 }
      }
    ]
  }
];

export function getRestaurantsForPostcode(postcodeInfo: PostcodeInfo): Restaurant[] {
  const cleanPostcode = postcodeInfo.postcode.trim().toUpperCase();
  const outcode = cleanPostcode.split(' ')[0] || cleanPostcode.slice(0, 3);
  const city = postcodeInfo.city || postcodeInfo.area || 'London';

  const matched = ALL_RESTAURANTS.filter((r) => {
    const hasOutcode = r.postcodeOutcodes.some((oc) =>
      outcode.startsWith(oc) || oc.startsWith(outcode)
    );
    const hasCity =
      r.city.toLowerCase() === city.toLowerCase() ||
      city.toLowerCase().includes(r.city.toLowerCase());
    return hasOutcode || hasCity;
  });

  return matched.length > 0 ? matched : ALL_RESTAURANTS;
}
