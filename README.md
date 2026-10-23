# 🍔 Aaron wants a cheap eat

A cross-platform mobile app for **iOS**, **Android**, and **Web** that compares takeaway prices in real-time across the UK's top three food delivery platforms: **Just Eat**, **Deliveroo**, and **Uber Eats**.

---

## ⚡ Key Features

1. **UK Postcode Lookup**:
   - Live validation and district resolution via [postcodes.io](https://postcodes.io).
   - Instant quick-selector for popular UK areas (London Westminster, Manchester Piccadilly, Birmingham, Edinburgh Old Town, Bristol Harbourside, etc.).
   - Discovers all available takeaways within delivery range.

2. **3-Way Real-Time Price Comparison Engine**:
   - Compares menu prices, service fees, delivery fees, and platform discounts side-by-side.
   - Highlights the **"Cheapest Option"** with a badge calculating exact pounds saved (e.g. *"Save £4.20 on Deliveroo"*).
   - Accounts for platform markups (where aggregators increase dish prices by 10–25%).

3. **Interactive Menu & Basket Customizer**:
   - Browse dishes across categories (Mains, Sides, Drinks, Desserts).
   - Add items to your basket and see a live 3-way side-by-side total checkout breakdown across Just Eat, Deliveroo, and Uber Eats.

4. **Dual Checkout Options**:
   - **Direct In-App Checkout (Aaron Pay)**:
     - 1-click payment simulation via Apple Pay (iOS), Google Pay (Android), or Debit/Credit Card.
     - Live order status tracker: *Order Confirmed ➔ Kitchen Cooking ➔ Courier on Bike ➔ Delivered*.
   - **Redirect to Vendor / Aggregator Website or App**:
     - Direct deep-links (`just-eat://`, `deliveroo://`, `ubereats://`) with automatic fallback to official UK website menus (`https://www.just-eat.co.uk/...`, `https://deliveroo.co.uk/...`, `https://www.ubereats.com/...`).

5. **"Aaron's Cheap Radar" & Savings Counter**:
   - Tracks lifetime savings accumulated by picking the cheapest delivery service.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm` or `yarn`

### 1. Run in Web Browser
To quickly view and interact with the app in your desktop or mobile browser:
```bash
npm run web
```
The app will open automatically at `http://localhost:8081`.

### 2. Run on Mobile (iOS & Android via Expo Go)
1. Install **Expo Go** from the Apple App Store or Google Play Store on your phone.
2. Run:
```bash
npm start
```
3. Scan the QR code with your camera (iOS) or inside the Expo Go app (Android).

### 3. Run in Simulators / Emulators
- **Android**: `npm run android`
- **iOS** (Requires macOS & Xcode): `npm run ios`

---

## 📁 Project Architecture

```
aaron-wants-a-cheap-eat/
├── App.tsx                          # Main app state, search, and modal controller
├── src/
│   ├── types/
│   │   └── index.ts                 # TypeScript types (Restaurant, MenuItem, Cart, Order)
│   ├── data/
│   │   └── mockRestaurants.ts       # Realistic takeaways with 3-platform pricing deltas
│   ├── services/
│   │   ├── comparisonEngine.ts      # Just Eat vs Deliveroo vs Uber Eats fee & savings logic
│   │   ├── postcodeService.ts       # Live UK postcodes.io lookup & popular city fallbacks
│   │   └── linkingService.ts        # App URI schemes & web fallbacks
│   └── components/
│       ├── Header.tsx               # Branding, postcode delivery pill, cart counter
│       ├── PostcodeModal.tsx        # Postcode entry, autocomplete & popular UK chips
│       ├── SavingsBanner.tsx        # Lifetime savings tracker & explanation badge
│       ├── CuisineFilter.tsx        # Category selector (Burgers, Pizza, Indian, Kebabs...)
│       ├── RestaurantCard.tsx       # Restaurant card with 3-way price pill & cheapest highlight
│       ├── RestaurantDetailModal.tsx# Full menu modal with dish-level price differences
│       ├── CartModal.tsx            # Basket comparison engine & dual checkout launcher
│       ├── DirectCheckoutModal.tsx  # In-app checkout with Apple/Google Pay simulation
│       ├── OrderTrackingModal.tsx   # Live delivery progress & ETA tracker
│       └── PlatformBadge.tsx        # Platform badge components
└── app.json                         # Expo configuration for iOS & Android
```
