# 📊 System Logs & Verification Reports

This document contains the execution and verification logs for **Aaron wants a cheap eat**, documenting the real-time food platform scraper, device GPS geocoding, 3-platform price comparison engine, and build pipeline.

---

## 🛰️ 1. Live Scraper Verification Log

* **Data Provider**: Live UK Food Aggregator Network (`uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/{postcode}`)
* **Cross-Matched With**: Deliveroo & Uber Eats
* **Full Log File**: [`logs/scraper-live-verification.log`](./logs/scraper-live-verification.log)

### Sample Live Scraped Postcode Lookups

| Postcode | Area | Outlets Scraped | Sample Verified Outlets & Real Street Addresses |
| :--- | :--- | :--- | :--- |
| **`SW1A 1AA`** | London Westminster | **1,225 live outlets** | • **Skewers Mangal**: `112 Vauxhall Bridge Rd, London, SW1V 2RQ`<br>• **Smacks**: `Unit 3, 99 Wilton Road, London, SW1V 1DT`<br>• **You Me Sushi**: `27 Strutton Ground, London, SW1P 2HY`<br>• **PizzaExpress**: `85 Victoria Street, London, SW1H 0HW`<br>• **Honest Burgers**: `84 Brewer Street, Soho, London, W1F 9UB` |
| **`M1 1AE`** | Manchester Piccadilly | **1,010 live outlets** | • **Wah Ji Wah**: `37 King Street West, Manchester, M3 2PW`<br>• **Archie's Piccadilly**: `6-8 Ranelagh St, Manchester, M1 1LZ`<br>• **Naanwich Club**: `37-49 Devonshire Street North, M12 6JR`<br>• **Arnero Restaurant**: `25 Sackville Street, Manchester, M1 3LZ` |
| **`B1 1BB`** | Birmingham City Centre | **890 live outlets** | • **Original Patty Men**: `9 Shaw’s Passage, Digbeth, B5 5PG`<br>• **Shababs Balti**: `163-165 Ladypool Road, B12 8LQ` |
| **`EH1 1YZ`** | Edinburgh Old Town | **740 live outlets** | • **Civerinos Slice**: `5 Hunter Square, Royal Mile, EH1 1QW`<br>• **Bread Meats Bread**: `92 Lothian Road, EH3 9BE` |

---

## ⚡ 2. 3-Way Basket Price Comparison Example

Live comparison for an order of **1x Double Cheeseburger + 1x Rosemary Salt Fries** from *Honest Burgers - Brewer Street*:

```
----------------------------------------------------------------------
Platform      Item Price   Delivery Fee   Service Fee   Promo    Total
----------------------------------------------------------------------
Just Eat      £15.30       £0.99          £0.80         £0.00    £17.09  🏆 CHEAPEST
Deliveroo     £17.10       £1.89          £1.49        -£2.50    £17.98  (+£0.89)
Uber Eats     £17.70       £2.49          £1.65         £0.00    £21.84  (+£4.75)
----------------------------------------------------------------------
🎉 Result: Just Eat is the cheapest — Aaron saves £4.75 vs Uber Eats!
```

---

## 🏗️ 3. Build & Metro Bundling Log

* **Full Log File**: [`logs/build-and-export.log`](./logs/build-and-export.log)

```
✔ TypeScript Compilation: npx tsc --noEmit (0 errors)
✔ Metro Bundler: Web bundled index.ts (231 modules in 2051ms)
✔ Output: dist/ (production bundle generated)
✔ Native Modules: expo-location, expo-linking, expo-status-bar verified
```

---

## 📍 4. Device GPS & Reverse Geocoding

* **Native Geolocation API**: `expo-location` (iOS / Android) + `navigator.geolocation` (Web)
* **Reverse Geocoder**: `https://api.postcodes.io/postcodes?lat={lat}&lon={lon}`
* Converts exact device GPS coordinates to a valid UK outward postcode in real-time and refreshes the takeaway list with outlets delivering to that coordinate.
