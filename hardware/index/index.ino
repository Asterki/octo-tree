#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebSocketsClient_Generic.h>
#include <SocketIOclient_Generic.h>

SocketIOclient  socketIO;

#define _WEBSOCKETS_LOGLEVEL_     4

const int temperaturePin = 34;
const int humidityPin = 35;

IPAddress clientIP(192, 168, 0, 15);
IPAddress serverIP(192, 168, 0, 15);

const int serverPort = 3000;

const String serverURL = "http://192.168.0.15:3000";
const String boardID = "123123123";
const String boardKey = "123123123";

int status = WL_IDLE_STATUS;

void socketIOEvent(const socketIOmessageType_t& type, uint8_t * payload, const size_t& length)
{
  Serial.println(type);

  switch (type)
  {
    case sIOtype_DISCONNECT:
      Serial.println("[IOc] Disconnected");

      break;

    case sIOtype_CONNECT:
      Serial.print("[IOc] Connected to url: ");
      Serial.println((char*) payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");

      break;

    case sIOtype_EVENT:
      Serial.print("[IOc] Get event: ");
      Serial.println((char*) payload);

      break;

    case sIOtype_ACK:
      Serial.print("[IOc] Get ack: ");
      Serial.println(length);

      //hexdump(payload, length);

      break;

    case sIOtype_ERROR:
      Serial.print("[IOc] Get error: ");
      Serial.println(length);

      //hexdump(payload, length);

      break;

    case sIOtype_BINARY_EVENT:
      Serial.print("[IOc] Get binary: ");
      Serial.println(length);

      //hexdump(payload, length);

      break;

    case sIOtype_BINARY_ACK:
      Serial.print("[IOc] Get binary ack: ");
      Serial.println(length);

      //hexdump(payload, length);

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

  Serial.println("Starting this thing...");

  // Automatically connect using saved credentials, or begin config portal if none exist
  if (!wifiManager.autoConnect("Octo-Tree"))
  {
    Serial.println("Failed to connect, resetting...");
    ESP.restart();
  }

  // If you reach here, you are connected to WiFi
  Serial.println("Connected to WiFi!");

  // SocketIO setup
  int status = WL_IDLE_STATUS;

  socketIO.setReconnectInterval(10000);
  socketIO.setExtraHeaders("Authorization: 1234567890");
  socketIO.begin(serverIP, serverPort);
  socketIO.onEvent(socketIOEvent);

  // Relay pins
  pinMode(LED_BUILTIN, OUTPUT);
}

unsigned long messageTimestamp = 0;
void loop()
{
  socketIO.loop();

  uint64_t now = millis();

  if (now - messageTimestamp > 30000)
  {
    messageTimestamp = now;

    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    array.add("event_name");

    JsonObject param1 = array.createNestedObject();
    param1["now"]     = (uint32_t) now;

    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);
    Serial.println(output);
  }
}
