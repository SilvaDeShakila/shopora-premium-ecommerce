import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/utils/formatters.dart';
import '../../models/product.dart';
import '../../providers/product_provider.dart';
import '../../widgets/category_chip.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/error_state.dart';
import '../../widgets/loading_skeleton.dart';
import '../../widgets/product_card.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final provider = context.read<ProductProvider>();
    _searchController.text = provider.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showFilterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const FilterBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalog & Search', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          if (productProvider.hasActiveFilters)
            TextButton(
              onPressed: () {
                _searchController.clear();
                productProvider.clearAllFilters();
              },
              child: const Text('Reset', style: TextStyle(fontWeight: FontWeight.w600)),
            ),
          IconButton(
            tooltip: 'Filters & Sorting',
            icon: Stack(
              children: [
                const Icon(Icons.tune_rounded),
                if (productProvider.hasActiveFilters)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => _showFilterModal(context),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Search Input Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            child: TextField(
              controller: _searchController,
              onChanged: (val) {
                productProvider.setSearchQuery(val);
              },
              decoration: InputDecoration(
                hintText: 'Search products by title or description...',
                prefixIcon: const Icon(Icons.search, size: 20),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          productProvider.setSearchQuery('');
                        },
                      )
                    : null,
              ),
            ),
          ),

          // Horizontally scrollable category chips
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: productProvider.categories.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return CategoryChip(
                    label: 'All Items',
                    isSelected: productProvider.selectedCategory == null,
                    onTap: () => productProvider.selectCategory(null),
                  );
                }
                final cat = productProvider.categories[index - 1];
                return CategoryChip(
                  label: cat,
                  isSelected: productProvider.selectedCategory == cat,
                  onTap: () => productProvider.selectCategory(cat),
                );
              },
            ),
          ),

          // Active filter banner / result summary
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${productProvider.filteredProducts.length} items found',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                  ),
                ),
                InkWell(
                  onTap: () => _showFilterModal(context),
                  child: Row(
                    children: [
                      Text(
                        _sortOptionLabel(productProvider.sortOption),
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(Icons.keyboard_arrow_down, size: 16, color: theme.colorScheme.primary),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Main Product Grid or Empty/Loading State
          Expanded(
            child: productProvider.isLoading
                ? const LoadingSkeletonGrid(count: 6)
                : productProvider.errorMessage != null
                    ? ErrorStateWidget(
                        message: productProvider.errorMessage!,
                        onRetry: () => productProvider.loadInitialData(forceRefresh: true),
                      )
                    : productProvider.filteredProducts.isEmpty
                        ? EmptyStateWidget(
                            icon: Icons.search_off_rounded,
                            title: 'No Matching Products',
                            message: 'Try adjusting your search terms, price range, or category filter.',
                            buttonText: 'Clear All Filters',
                            onAction: () {
                              _searchController.clear();
                              productProvider.clearAllFilters();
                            },
                          )
                        : RefreshIndicator(
                            onRefresh: () => productProvider.loadInitialData(forceRefresh: true),
                            child: GridView.builder(
                              padding: const EdgeInsets.all(16),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.65,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                              ),
                              itemCount: productProvider.filteredProducts.length,
                              itemBuilder: (context, index) {
                                return ProductCard(product: productProvider.filteredProducts[index]);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  String _sortOptionLabel(ProductSortOption opt) {
    switch (opt) {
      case ProductSortOption.priceLowHigh:
        return 'Price: Low to High';
      case ProductSortOption.priceHighLow:
        return 'Price: High to Low';
      case ProductSortOption.alphabetical:
        return 'Alphabetical (A-Z)';
      case ProductSortOption.rating:
        return 'Customer Rating';
      case ProductSortOption.featured:
      default:
        return 'Featured';
    }
  }
}

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late double _tempMin;
  late double _tempMax;
  late ProductSortOption _tempSort;
  String? _tempCat;

  @override
  void initState() {
    super.initState();
    final provider = context.read<ProductProvider>();
    _tempMin = provider.currentMinPrice;
    _tempMax = provider.currentMaxPrice;
    _tempSort = provider.sortOption;
    _tempCat = provider.selectedCategory;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = context.watch<ProductProvider>();

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: theme.colorScheme.onSurface.withOpacity(0.2),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Filter & Sort',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {
                  setState(() {
                    _tempMin = provider.minPrice;
                    _tempMax = provider.maxPrice;
                    _tempSort = ProductSortOption.featured;
                    _tempCat = null;
                  });
                },
                child: const Text('Reset'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Price Range
          Text(
            'Price Range: ${Formatters.formatCurrency(_tempMin)} - ${Formatters.formatCurrency(_tempMax)}',
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
          ),
          RangeSlider(
            values: RangeValues(_tempMin, _tempMax),
            min: provider.minPrice,
            max: provider.maxPrice,
            divisions: 20,
            onChanged: (vals) {
              setState(() {
                _tempMin = vals.start;
                _tempMax = vals.end;
              });
            },
          ),
          const SizedBox(height: 16),

          // Sort Options
          const Text('Sort By', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _sortChip('Featured', ProductSortOption.featured),
              _sortChip('Price: Low to High', ProductSortOption.priceLowHigh),
              _sortChip('Price: High to Low', ProductSortOption.priceHighLow),
              _sortChip('Alphabetical (A-Z)', ProductSortOption.alphabetical),
              _sortChip('Top Rated', ProductSortOption.rating),
            ],
          ),
          const SizedBox(height: 24),

          // Apply Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                provider.setPriceRange(_tempMin, _tempMax);
                provider.setSortOption(_tempSort);
                provider.selectCategory(_tempCat);
                Navigator.pop(context);
              },
              child: const Text('Apply Filters'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sortChip(String label, ProductSortOption option) {
    final theme = Theme.of(context);
    final isSelected = _tempSort == option;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (val) {
        if (val) setState(() => _tempSort = option);
      },
    );
  }
}
