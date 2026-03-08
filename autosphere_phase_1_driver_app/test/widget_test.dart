// This is a basic Flutter widget test.

import 'package:flutter_test/flutter_test.dart';

import 'package:autosphere_phase_1_driver_app/main.dart';

void main() {
  testWidgets('App shows AutoSphere AI on splash', (WidgetTester tester) async {
    await tester.pumpWidget(const AutoSphereApp());
    await tester.pump();
    expect(find.text('AutoSphere AI'), findsOneWidget);
    await tester.pump(const Duration(seconds: 3)); // Let splash timer complete so no pending timers
  });
}
