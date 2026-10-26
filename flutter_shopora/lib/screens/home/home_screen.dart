import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/theme_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/product_provider.dart';
import '../../widgets/category_chip.dart';
import '../../widgets/error_state.dart';
import '../../widgets/loading_skeleton.dart';
import '../../widgets/product_card.dart';

class HomeScreen extends StatelessWidget {
  final Function(int) onNavigateTab;

  const HomeScreen({super.key, required this.onNavigateTab});

  IconData _categoryIcon(String category) {
    final value = category.toLowerCase();
    if (value.contains('electronic')) return Icons.devices_rounded;
    if (value.contains('jewel')) return Icons.diamond_outlined;
    if (value.contains('men')) return Icons.checkroom_rounded;
    if (value.contains('women')) return Icons.shopping_bag_outlined;
    if (value.contains('cloth')) return Icons.checkroom_rounded;
    if (value.contains('home')) return Icons.chair_alt_outlined;
    return Icons.category_outlined;
  }

  Widget _sectionHeading(
    BuildContext context,
    String title,
    String subtitle, {
    VoidCallback? onViewAll,
  }) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 26, 18, 14),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.58),
                  ),
                ),
              ],
            ),
          ),
          if (onViewAll != null)
            TextButton(
              onPressed: onViewAll,
              child: const Text('View all'),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final products = context.watch<ProductProvider>();
    final cart = context.watch<CartProvider>();
    final themeProvider = context.watch<ThemeProvider>();
    final filteredProducts = products.filteredProducts;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 18,
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6D5DFB), Color(0xFF9B5CFF)],
                ),
                borderRadius: BorderRadius.circular(13),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset(
                  'assets/images/shopora_logo.jpg',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.shopping_bag_rounded,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 11),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Shopora',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.7,
                  ),
                ),
                Text(
                  'YOUR EVERYDAY STORE',
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 9,
                    letterSpacing: 1.5,
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
            icon: Icon(
              isDark ? Icons.light_mode_rounded : Icons.dark_mode_outlined,
              color: isDark ? Colors.amber : theme.colorScheme.onSurface,
            ),
            onPressed: themeProvider.toggleTheme,
          ),
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                tooltip: 'Shopping Cart',
                icon: const Icon(Icons.shopping_cart_outlined),
                onPressed: () => onNavigateTab(3),
              ),
              if (cart.totalItemCount > 0)
                Positioned(
                  top: 6,
                  right: 5,
                  child: Container(
                    constraints: const BoxConstraints(
                      minWidth: 17,
                      minHeight: 17,
                    ),
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF476F),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${cart.totalItemCount}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => products.loadInitialData(forceRefresh: true),
        child: products.isLoading
            ? const SingleChildScrollView(
                physics: AlwaysScrollableScrollPhysics(),
                child: LoadingSkeletonGrid(count: 6),
              )
            : products.errorMessage != null
                ? ErrorStateWidget(
                    message: products.errorMessage!,
                    onRetry: () => products.loadInitialData(forceRefresh: true),
                  )
                : CustomScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    slivers: [
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                          child: InkWell(
                            onTap: () => onNavigateTab(1),
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 15,
                                vertical: 14,
                              ),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF20283A)
                                    : const Color(0xFFF3F4F9),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: theme.colorScheme.outline
                                      .withValues(alpha: 0.18),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.search_rounded,
                                    color: theme.colorScheme.primary,
                                    size: 23,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      'Search products, brands and more',
                                      style:
                                          theme.textTheme.bodyMedium?.copyWith(
                                        color: theme.colorScheme.onSurface
                                            .withValues(alpha: 0.55),
                                      ),
                                    ),
                                  ),
                                  Icon(
                                    Icons.tune_rounded,
                                    color: theme.colorScheme.onSurface
                                        .withValues(alpha: 0.6),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),

                      // Premium hero banner
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
                          child: Container(
                            height: 205,
                            clipBehavior: Clip.antiAlias,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(25),
                              gradient: const LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Color(0xFF21165F),
                                  Color(0xFF5945D8),
                                  Color(0xFF9B5CFF),
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF7255E8)
                                      .withValues(alpha: 0.25),
                                  blurRadius: 22,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Stack(
                              children: [
                                Positioned(
                                  right: -35,
                                  top: -45,
                                  child: Container(
                                    width: 190,
                                    height: 190,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.white.withValues(alpha: 0.08),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  right: 15,
                                  bottom: -58,
                                  child: Container(
                                    width: 150,
                                    height: 150,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: Colors.white.withValues(alpha: 0.13),
                                        width: 25,
                                      ),
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.fromLTRB(18, 14, 10, 12),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        flex: 6,
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                horizontal: 10,
                                                vertical: 5,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.white
                                                    .withValues(alpha: 0.16),
                                                borderRadius:
                                                    BorderRadius.circular(30),
                                              ),
                                              child: const Text(
                                                'YOUR STYLE, YOUR WAY',
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 9,
                                                  fontWeight: FontWeight.w800,
                                                  letterSpacing: 1.1,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(height: 6),
                                            const Text(
                                              'Discover Your\\nEveryday Favorites',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 23,
                                                height: 1.13,
                                                fontWeight: FontWeight.w900,
                                                letterSpacing: -0.7,
                                              ),
                                            ),
                                            const SizedBox(height: 6),
                                            Text(
                                              'Find something you will love.',
                                              style: TextStyle(
                                                color: Colors.white
                                                    .withValues(alpha: 0.8),
                                                fontSize: 11,
                                              ),
                                            ),
                                            const SizedBox(height: 9),
                                            ElevatedButton(
                                              onPressed: () =>
                                                  onNavigateTab(1),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: Colors.white,
                                                foregroundColor:
                                                    const Color(0xFF4936B8),
                                                elevation: 0,
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                  horizontal: 14,
                                                  vertical: 10,
                                                ),
                                                minimumSize: Size.zero,
                                                tapTargetSize:
                                                    MaterialTapTargetSize
                                                        .shrinkWrap,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius:
                                                      BorderRadius.circular(10),
                                                ),
                                              ),
                                              child: const Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  Text(
                                                    'Shop now',
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.w800,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                  SizedBox(width: 5),
                                                  Icon(
                                                    Icons.arrow_forward_rounded,
                                                    size: 15,
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Expanded(
                                        flex: 4,
                                        child: Center(
                                          child: Icon(
                                            Icons.shopping_bag_rounded,
                                            color: Colors.white,
                                            size: 94,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Small store highlights
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                          child: Row(
                            children: [
                              Expanded(
                                child: _highlight(
                                  context,
                                  Icons.local_shipping_outlined,
                                  'Easy shopping',
                                  'Browse with ease',
                                ),
                              ),
                              const SizedBox(width: 9),
                              Expanded(
                                child: _highlight(
                                  context,
                                  Icons.verified_outlined,
                                  'Top picks',
                                  'Highly rated items',
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Category cards
                      SliverToBoxAdapter(
                        child: _sectionHeading(
                          context,
                          'Shop by Category',
                          'Find exactly what you are looking for',
                          onViewAll: () => onNavigateTab(1),
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: SizedBox(
                          height: 105,
                          child: ListView.separated(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                            ),
                            scrollDirection: Axis.horizontal,
                            itemCount: products.categories.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: 11),
                            itemBuilder: (context, index) {
                              final category = products.categories[index];
                              final selected =
                                  products.selectedCategory == category;

                              return InkWell(
                                onTap: () {
                                  products.selectCategory(category);
                                },
                                borderRadius: BorderRadius.circular(18),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 180),
                                  width: 105,
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: selected
                                        ? theme.colorScheme.primary
                                            .withValues(alpha: 0.13)
                                        : (isDark
                                            ? const Color(0xFF20283A)
                                            : const Color(0xFFF5F5FA)),
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(
                                      color: selected
                                          ? theme.colorScheme.primary
                                          : theme.colorScheme.outline
                                              .withValues(alpha: 0.15),
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        _categoryIcon(category),
                                        color: theme.colorScheme.primary,
                                        size: 28,
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        category,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                        style: theme.textTheme.labelSmall
                                            ?.copyWith(
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),

                      

                      

                      // All products and category filters
                      SliverToBoxAdapter(
                        child: _sectionHeading(
                          context,
                          products.selectedCategory == null
                              ? 'Explore All Products'
                              : products.selectedCategory!,
                          '${filteredProducts.length} items available',
                          onViewAll: () => onNavigateTab(1),
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: SizedBox(
                          height: 42,
                          child: ListView(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            scrollDirection: Axis.horizontal,
                            children: [
                              CategoryChip(
                                label: 'All Items',
                                isSelected: products.selectedCategory == null,
                                onTap: () => products.selectCategory(null),
                              ),
                              ...products.categories.map(
                                (category) => CategoryChip(
                                  label: category,
                                  isSelected:
                                      products.selectedCategory == category,
                                  onTap: () =>
                                      products.selectCategory(category),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      if (filteredProducts.isEmpty)
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.all(32),
                            child: Column(
                              children: [
                                Icon(
                                  Icons.search_off_rounded,
                                  size: 48,
                                  color: theme.colorScheme.onSurface
                                      .withValues(alpha: 0.4),
                                ),
                                const SizedBox(height: 6),
                                const Text('No products found in this view.'),
                                TextButton(
                                  onPressed: products.clearAllFilters,
                                  child: const Text('Clear filters'),
                                ),
                              ],
                            ),
                          ),
                        )
                      else
                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
                          sliver: SliverGrid(
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.58,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 14,
                            ),
                            delegate: SliverChildBuilderDelegate(
                              (context, index) => ProductCard(
                                product: filteredProducts[index],
                              ),
                              childCount: filteredProducts.length,
                            ),
                          ),
                        ),
                      const SliverToBoxAdapter(
                        child: SizedBox(height: 30),
                      ),
                    ],
                  ),
      ),
    );
  }

  Widget _highlight(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
  ) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 13),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: theme.colorScheme.primary.withValues(alpha: 0.12),
        ),
      ),
      child: Row(
        children: [
          Icon(icon, color: theme.colorScheme.primary, size: 23),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 9,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}






