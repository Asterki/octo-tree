void setup() {
  // Start the hardware serial port for the ESP32
  Serial.begin(2400);
  Serial2.begin(2400, SERIAL_8N1, 16, 17); // RX, TX
  
  Serial.println("ESP32 ready");
}

void loop() {
  // Send a ready signal to the Arduino
  Serial2.println("READY");

  // Wait for data from Arduino
  if (Serial2.available()) {
    String dataFromArduino = Serial2.readStringUntil('\n');
    Serial.println("From Arduino: " + dataFromArduino);

    // Send acknowledgment to Arduino
    Serial2.println("ACK");
  }

  delay(1000);  // Delay to avoid flooding the Arduino
}
