import 'package:intl/intl.dart';

class Formatters {
  static final NumberFormat _currencyFormat = NumberFormat.currency(
    symbol: '\$',
    decimalDigits: 2,
  );

  static String formatCurrency(double amount) {
    return _currencyFormat.format(amount);
  }

  static String capitalizeCategory(String category) {
    if (category.isEmpty) return category;
    return category.split(' ').map((word) {
      if (word.isEmpty) return word;
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
  }

  static String formatDate(DateTime date) {
    return DateFormat('MMM dd, yyyy · hh:mm a').format(date);
  }
}
