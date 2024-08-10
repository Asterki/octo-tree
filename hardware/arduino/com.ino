void setup() {
  // Start the hardware serial port for the Arduino
  Serial.begin(2400);
  
  Serial.println("Arduino ready");
}

void loop() {
  if (Serial.available()) {
    String dataFromESP32 = Serial.readStringUntil('\n');
    Serial.println("From ESP32: " + dataFromESP32);
    delay(100);  // Give time for processing
  }

  String dataToSend = "Hello from Arduino";
  Serial.println(dataToSend);
  delay(1000);  // Delay to avoid flooding the ESP32
}