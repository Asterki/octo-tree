#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>

const int sensorPin = 34; 

const char* serverURL = "http://192.168.0.15/api/sensors/update";

void setup() {
    Serial.begin(115200);

    // Create a WiFiManager object
    WiFiManager wifiManager;

    // Automatically connect using saved credentials, or begin config portal if none exist
    if (!wifiManager.autoConnect("Octo Tree")) {
        Serial.println("Failed to connect, resetting...");
        ESP.restart();
    }

    // If you reach here, you are connected to WiFi
    Serial.println("Connected to WiFi!");
}

void loop() {
    // Read sensor value
    int sensorValue = analogRead(sensorPin);
    
    // Construct the HTTP request
    HTTPClient http;
    http.begin(serverURL);

    // Add headers (if necessary)
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Prepare the data to be sent
    String httpRequestData = "sensorValue=" + String(sensorValue) + "&timestamp=" + String(millis());

    // Send the request and get the response
    int httpResponseCode = http.POST(httpRequestData);

    // Check for a successful response
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }

    // End the HTTP connection
    http.end();

    // Delay between data sends to reduce power/network load
    delay(10000); // Send data every 10 seconds (adjust as needed)
}
