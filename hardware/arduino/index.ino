void setup() {
  // Start the hardware serial port for the Arduino
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("Arduino ready");
}

void loop() {
  if (Serial.available()) {
    String messageFromESP32 = Serial.readStringUntil('\n'); // This will usually be a JSON string
    dataFromESP32.trim();

    // Parse the JSON string
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, messageFromESP32);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }

    // Get the values from the JSON object
    String command = doc["command"];
    int value = doc["value"];

    // Perform the action based on the command
    if (command == "led") {
      digitalWrite(LED_BUILTIN, value);
    }
  }

}