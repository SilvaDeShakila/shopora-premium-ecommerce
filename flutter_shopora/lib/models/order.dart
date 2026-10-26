import 'cart_item.dart';

class OrderModel {
  final String orderId;
  final DateTime orderDate;
  final List<CartItem> items;
  final double totalAmount;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final String deliveryAddress;

  const OrderModel({
    required this.orderId,
    required this.orderDate,
    required this.items,
    required this.totalAmount,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.deliveryAddress,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      orderId: json['orderId'] as String,
      orderDate: DateTime.parse(json['orderDate'] as String),
      items: (json['items'] as List<dynamic>)
          .map((item) => CartItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      customerName: json['customerName'] as String,
      customerEmail: json['customerEmail'] as String,
      customerPhone: json['customerPhone'] as String,
      deliveryAddress: json['deliveryAddress'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'orderId': orderId,
    'orderDate': orderDate.toIso8601String(),
    'items': items.map((i) => i.toJson()).toList(),
    'totalAmount': totalAmount,
    'customerName': customerName,
    'customerEmail': customerEmail,
    'customerPhone': customerPhone,
    'deliveryAddress': deliveryAddress,
  };
}
