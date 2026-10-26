# Shopora — Premium Flutter E-Commerce App

A modern shopping experience built with Flutter, featuring product discovery, category browsing, search, filters, wishlists, a persistent cart, and light/dark themes.

**Auspify Internship — Task 05 (Advanced)**

<p align="center">
  <img src="assets/screenshots/shopora-screen-1.jpeg" width="240" alt="Shopora app screenshot 1" />
  &nbsp;&nbsp;&nbsp;
  <img src="assets/screenshots/shopora-screen-2.jpeg" width="240" alt="Shopora app screenshot 2" />
</p>

<p align="center">
  <strong>Discover products. Manage your cart. Shop in style.</strong>
</p>

## Project Badges

![Flutter](https://img.shields.io/badge/Flutter-Framework-02569B?logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-Language-0175C2?logo=dart&logoColor=white)
![API](https://img.shields.io/badge/API-FakeStore-2E8B57)
![Tests](https://img.shields.io/badge/Automated_Tests-15_Passing-2E8B57)
![Analysis](https://img.shields.io/badge/Flutter_Analyze-No_Issues-2E8B57)

## Features

- **Product catalogue** — Browse products loaded from the FakeStore API.
- **Search** — Find products by name and relevant details.
- **Category browsing** — Explore products by category.
- **Filtering and sorting** — Refine the catalogue using available price filters and sorting options.
- **Product details** — View product information before adding an item to the cart.
- **Shopping cart** — Manage cart items and quantities and review totals.
- **Wishlist** — Save products for later.
- **Theme preferences** — Switch between light and dark themes.
- **Local persistence** — Keep supported cart, wishlist, theme, and order-history data between app sessions.
- **Checkout flow** — Explore the app's simulated checkout experience without processing real payments.
- **Responsive interface** — Flutter UI designed for supported mobile and web layouts.

## Technology Stack

| Technology | Purpose |
|---|---|
| Flutter | Cross-platform user interface |
| Dart | Application logic |
| FakeStore API | Product and category data |
| Provider | State management |
| `http` | API requests |
| `shared_preferences` | Local preference and supported shopping-data persistence |
| `cached_network_image` | Network product images |
| Material 3 | UI components and visual styling |
| Google Fonts | Typography |

## Getting Started

### Prerequisites

- Flutter SDK installed and configured
- Dart SDK compatible with the project's Flutter SDK
- Android emulator, physical device, or supported desktop browser
- Internet connection for product API requests

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SilvaDeShakila/shopora-premium-ecommerce.git
   ```

2. Open the project directory:

   ```bash
   cd shopora-premium-ecommerce/flutter_shopora
   ```

3. Install dependencies:

   ```bash
   flutter pub get
   ```

4. Run the application:

   ```bash
   flutter run
   ```

To run in Chrome, use:

```bash
flutter run -d chrome
```

## Testing and Code Quality

Run the automated test suite:

```bash
flutter test
```

Run static analysis:

```bash
flutter analyze
```

### Verified results

- **15 automated tests passed** in the latest recorded test run.
- **No issues found** in the latest recorded Flutter analysis.
- The automated suite covers product models, cart logic, category/filter/sorting logic, and a navigation smoke test.
- The app has also been manually exercised on a physical phone.

The navigation smoke test is not a full end-to-end test of every shopping flow. API availability and simulated checkout behaviour can vary by environment.

## API

Shopora uses the [FakeStore API](https://fakestoreapi.com/) to retrieve product and category data. An internet connection is required for API-backed catalogue features.

## Project Structure

```text
flutter_shopora/
├── android/
├── ios/
├── web/
├── assets/
│   └── screenshots/
│       ├── shopora-screen-1.jpeg
│       └── shopora-screen-2.jpeg
├── lib/
│   ├── core/
│   │   └── constants/
│   ├── models/
│   ├── providers/
│   ├── screens/
│   ├── services/
│   └── widgets/
├── test/
├── pubspec.yaml
└── README.md
```

This is a high-level overview; the exact folders and files in the repository are authoritative.

## Important Notes

- Checkout is a demonstration flow; no real payment is collected.
- Product availability and data depend on the external FakeStore API.
- Local persistence depends on the platform and storage implementation.

## Author

**Shakila Silva**

Developed as part of the Auspify internship assignment.

---

<p align="center">
  <strong>Shopora — Curated Modern Living</strong>
</p>
