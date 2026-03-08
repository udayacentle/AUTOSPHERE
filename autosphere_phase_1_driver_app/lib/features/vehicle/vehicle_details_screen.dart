
import 'package:flutter/material.dart';

class VehicleDetailsScreen extends StatelessWidget {
  const VehicleDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Vehicle Digital Twin")),
      body: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text("Engine Health: 92%"),
            Text("Battery Health: 88%"),
            Text("Brake Pads: 76%"),
          ],
        ),
      ),
    );
  }
}
