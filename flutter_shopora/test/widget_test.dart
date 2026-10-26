import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/app.dart';

void main() {
  testWidgets('Shopora app displays main navigation', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1200, 900);
    tester.view.devicePixelRatio = 1;

    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(const ShoporaApp());
    await tester.pump();

    expect(find.text('Home'), findsWidgets);
    expect(find.text('Explore'), findsWidgets);
    expect(find.text('Wishlist'), findsWidgets);
    expect(find.text('Cart'), findsWidgets);
    expect(find.text('Profile'), findsWidgets);
  });
}
