#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>

SocketIOclient socketIO;

// Define the pins for the sensors (you might not need these if you're using BME280)
const int humidityPin = 35;
const int lightPin1 = 35;
const int lightPin2 = 36;
const int servoPin = 33;
const int pumpPin = 32;
const int soilHumidityPin = 34;
const int sensorSDAPin = 8;
const int sensorSCLPin = 9;

Adafruit_BME280 bme;  // Create an instance of the BME280 sensor

IPAddress clientIP(192, 168, 0, 15);
IPAddress serverIP(192, 168, 0, 15);

const int serverPort = 3000;
const String serverURL = "http://192.168.0.15:3000";
const String boardID = "123123123";
const String boardKey = "123123123";

int status = WL_IDLE_STATUS;

void handleEvent(const char *payload)
{
  // Parse the JSON message
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, payload);

  // Get the relevant information
  String eventName = doc[0];
  JsonObject params = doc[1];

  // Handle the event
  if (eventName == "led")
  {
    int state = params["state"];
    if (state == 1)
    {
      digitalWrite(LED_BUILTIN, HIGH);
    }
    else
    {
      digitalWrite(LED_BUILTIN, LOW);
    }
  }

  if (eventName == "pump")
  {
    int state = params["state"];
    if (state == 1)
    {
      digitalWrite(33, HIGH);
    }
    else
    {
      digitalWrite(33, LOW);
    }
  }

  if (eventName == "servo")
  {
    // Compare both light sensor values, and decide which way to turn the servo
    int light1 = analogRead(lightPin1);
    int light2 = analogRead(lightPin2);

    if (light1 > light2)
    {
      // Turn the servo to the left
      Serial.println("Turning servo to the left");
    }
    else
    {
      // Turn the servo to the right
      Serial.println("Turning servo to the right");
    }
  }
}

void socketIOEvent(const socketIOmessageType_t &type, uint8_t *payload, const size_t &length)
{
  Serial.println(type);

  switch (type)
  {
  case sIOtype_DISCONNECT:
    Serial.println("[IOc] Disconnected");
    break;

  case sIOtype_CONNECT:
    Serial.print("[IOc] Connected to url: ");
    Serial.println((char *)payload);
    socketIO.send(sIOtype_CONNECT, "/");
    break;

  case sIOtype_EVENT:
    Serial.print("[IOc] Get event: ");
    Serial.println((char *)payload);
    handleEvent((char *)payload);
    break;

  case sIOtype_ACK:
    Serial.print("[IOc] Get ack: ");
    Serial.println(length);
    break;

  case sIOtype_ERROR:
    Serial.print("[IOc] Get error: ");
    Serial.println(length);
    break;

  case sIOtype_BINARY_EVENT:
    Serial.print("[IOc] Get binary: ");
    Serial.println(length);
    break;

  case sIOtype_BINARY_ACK:
    Serial.print("[IOc] Get binary ack: ");
    Serial.println(length);
    break;

  case sIOtype_PING:
    Serial.println("[IOc] Get PING");
    break;

  case sIOtype_PONG:
    Serial.println("[IOc] Get PONG");
    break;

  default:
    break;
  }
}

void setup()
{
  Serial.begin(115200);

  // Initialize I2C on GPIO8 (SDA) and GPIO9 (SCL)
  Wire.begin(sensorSDAPin, sensorSCLPin);

  // Initialize BME280
  if (!bme.begin(0x76)) {  // If your BME280 uses 0x77, change it here
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }
  
  // Create a WiFiManager object
  WiFiManager wifiManager;

  // Automatically connect using saved credentials, or begin config portal if none exist
  if (!wifiManager.autoConnect("Octo-Tree"))
  {
    Serial.println("Failed to connect, resetting...");
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_BUILTIN, HIGH);  // Turn the LED on
      delay(500);                       // Wait for 500 milliseconds
      digitalWrite(LED_BUILTIN, LOW);   // Turn the LED off
      delay(500);                       // Wait for 500 milliseconds
    }
    wifiManager.startConfigPortal("Octo-Tree");
    ESP.restart();
  }

  // If you reach here, you are connected to WiFi
  Serial.println("Connected to WiFi!");
  digitalWrite(LED_BUILTIN, HIGH);

  // SocketIO setup
  socketIO.setReconnectInterval(10000);
  socketIO.begin(serverIP, serverPort);
  socketIO.onEvent(socketIOEvent);

  // Configure the pins
  pinMode(lightPin1, INPUT);
  pinMode(lightPin2, INPUT);
  pinMode(servoPin, OUTPUT);
  pinMode(33, OUTPUT);
}

unsigned long messageTimestamp = 0;

// Define the minimum and maximum values for scaling the LDR readings
const int LDR_MIN = 0;       // Minimum raw value from analogRead()
const int LDR_MAX = 1023;    // Maximum raw value from analogRead()

// Define the scaled range
const int SCALED_MIN = 1;    // Minimum value after scaling
const int SCALED_MAX = 100;  // Maximum value after scaling

void loop()
{
  socketIO.loop();

  uint64_t now = millis();

  // Non-blocking timeout to send data every 5 seconds
  if (now - messageTimestamp > 5000)
  {
    messageTimestamp = now;

    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    array.add("sensor_update");

    JsonObject param1 = array.createNestedObject();
    param1["time_online"] = (uint32_t)now;
    param1["temperature"] = bme.readTemperature();
    param1["humidity"] = bme.readHumidity();
    param1["pressure"] = bme.readPressure() / 100.0F;

    // Read LDR values and scale them
    int rawLight1 = analogRead(lightPin1);
    int rawLight2 = analogRead(lightPin2);

    // Scale the raw LDR readings to 1-100
    int scaledLight1 = map(rawLight1, LDR_MIN, LDR_MAX, SCALED_MIN, SCALED_MAX);
    int scaledLight2 = map(rawLight2, LDR_MIN, LDR_MAX, SCALED_MIN, SCALED_MAX);

    param1["light1"] = scaledLight1;
    param1["light2"] = scaledLight2;
    param1["board_id"] = boardID;
    param1["board_key"] = boardKey;

    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);
    Serial.println(output);
  }
}
