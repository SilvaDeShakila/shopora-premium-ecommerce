class Rating {
  final double rate;
  final int count;

  const Rating({
    required this.rate,
    required this.count,
  });

  factory Rating.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return const Rating(rate: 0.0, count: 0);
    }
    return Rating(
      rate: (json['rate'] is num) ? (json['rate'] as num).toDouble() : 0.0,
      count: (json['count'] is num) ? (json['count'] as num).toInt() : 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'rate': rate,
    'count': count,
  };
}

class Product {
  final int id;
  final String title;
  final double price;
  final String description;
  final String category;
  final String image;
  final Rating rating;

  const Product({
    required this.id,
    required this.title,
    required this.price,
    required this.description,
    required this.category,
    required this.image,
    required this.rating,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: (json['id'] is num) ? (json['id'] as num).toInt() : 0,
      title: json['title'] as String? ?? 'Untitled Product',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0.0,
      description: json['description'] as String? ?? '',
      category: json['category'] as String? ?? 'general',
      image: json['image'] as String? ?? '',
      rating: Rating.fromJson(json['rating'] as Map<String, dynamic>?),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'price': price,
    'description': description,
    'category': category,
    'image': image,
    'rating': rating.toJson(),
  };

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Product && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}
