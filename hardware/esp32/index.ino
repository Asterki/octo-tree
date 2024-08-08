#include <WiFi.h>

const char* ssid = "";             // Change this to your WiFi SSID
const char* password = "";   // Change this to your WiFi password

const char* host = "192.168.0.15";         // This should not be changed
const int httpPort = 5000;                 // This should not be changed

void setup() {
    Serial.begin(115200);
    while (!Serial) {
        delay(100);
    }

    // Connect to WiFi network
    Serial.println();
    Serial.println("******************************************************");
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void readResponse(WiFiClient& client) {
    unsigned long timeout = millis();
    while (client.available() == 0) {
        if (millis() - timeout > 5000) {
            Serial.println(">>> Client Timeout !");
            client.stop();
            return;
        }
    }

    // Read all the lines of the reply from server and print them to Serial
    while (client.available()) {
        String line = client.readStringUntil('\r');
        Serial.print(line);
    }

    Serial.printf("\nClosing connection\n\n");
}

void loop() {
    WiFiClient client;
    String footer = String(" HTTP/1.1\r\n") + "Host: " + String(host) + "\r\n" + "Connection: close\r\n\r\n";

    // WRITE --------------------------------------------------------------------------------------------
    if (!client.connect(host, httpPort)) {
        return;
    }

    client.print("GET /" + footer);
    readResponse(client);

    delay(10000);
}
