#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>

SocketIOclient socketIO;

#define _WEBSOCKETS_LOGLEVEL_ 4

IPAddress clientIP(192, 168, 0, 15);
IPAddress serverIP(192, 168, 0, 15);

const int serverPort = 3000;

const String serverURL = "http://192.168.0.15:3000";
const String boardID = "123123123";
const String boardKey = "123123123";

// Define the pins for the sensors
const int temperaturePin = 34;
const int humidityPin = 35;
const int pressurePin = 36;
const int lightPin1 = 39;
const int lightPin2 = 38;
const int servoPin = 33;

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

    // join default namespace (no auto join in Socket.IO V3)
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

    // hexdump(payload, length);

    break;

  case sIOtype_ERROR:
    Serial.print("[IOc] Get error: ");
    Serial.println(length);

    // hexdump(payload, length);

    break;

  case sIOtype_BINARY_EVENT:
    Serial.print("[IOc] Get binary: ");
    Serial.println(length);

    // hexdump(payload, length);

    break;

  case sIOtype_BINARY_ACK:
    Serial.print("[IOc] Get binary ack: ");
    Serial.println(length);

    // hexdump(payload, length);

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

  // Create a WiFiManager object
  WiFiManager wifiManager;

  // Automatically connect using saved credentials, or begin config portal if none exist
  if (!wifiManager.autoConnect("Octo-Tree"))
  {
    Serial.println("Failed to connect, resetting...");

    // Blink the LED 3 times to indicate WiFi needs to be configured
    for (int i = 0; i < 3; i++) {
      digitalWrite(LED_BUILTIN, HIGH);  // Turn the LED on
      delay(500);                       // Wait for 500 milliseconds
      digitalWrite(LED_BUILTIN, LOW);   // Turn the LED off
      delay(500);                       // Wait for 500 milliseconds
    }

    // Start the configuration portal
    wifiManager.startConfigPortal("Octo-Tree");

    ESP.restart();
  }

  // If you reach here, you are connected to WiFi
  Serial.println("Connected to WiFi!");

  // Turn on the LED to indicate that we are connected
  digitalWrite(LED_BUILTIN, HIGH);

  // SocketIO setup
  int status = WL_IDLE_STATUS;

  socketIO.setReconnectInterval(10000);
  socketIO.begin(serverIP, serverPort);
  socketIO.onEvent(socketIOEvent);

  // Configure the pins
  pinMode(temperaturePin, INPUT);
  pinMode(humidityPin, INPUT);
  pinMode(pressurePin, INPUT);
  pinMode(lightPin1, INPUT);
  pinMode(lightPin2, INPUT);
  pinMode(servoPin, OUTPUT);
  pinMode(33, OUTPUT);
}

unsigned long messageTimestamp = 0;
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
    param1["temperature"] = analogRead(temperaturePin);
    param1["humidity"] = analogRead(humidityPin);
    param1["pressure"] = analogRead(pressurePin);
    param1["light1"] = analogRead(lightPin1);
    param1["light2"] = analogRead(lightPin2);
    param1["board_id"] = boardID;
    param1["board_key"] = boardKey;

    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);
    Serial.println(output);
  }
}
