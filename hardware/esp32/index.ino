#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>

const int sensorPin = 34;

const char *serverURL = "http://192.168.0.15/api/sensors/update";

void setup()
{
  Serial.begin(115200);

  // Create a WiFiManager object
  WiFiManager wifiManager;

  // Automatically connect using saved credentials, or begin config portal if none exist
  if (!wifiManager.autoConnect("Octo Tree"))
  {
    Serial.println("Failed to connect, resetting...");
    ESP.restart();
  }

  // If you reach here, you are connected to WiFi
  Serial.println("Connected to WiFi!");
}

String makeHttpRequest(const char *url, const char *method, const String &jsonBody)
{
  // Initialize the HTTP client
  HTTPClient http;

  // Begin the request with the provided URL
  http.begin(url);

  // Set the content type to JSON
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode;
  String response;

  // Choose the HTTP method and send the request
  if (strcmp(method, "POST") == 0)
  {
    httpResponseCode = http.POST(jsonBody);
  }
  else if (strcmp(method, "PUT") == 0)
  {
    httpResponseCode = http.PUT(jsonBody);
  }
  else if (strcmp(method, "PATCH") == 0)
  {
    httpResponseCode = http.PATCH(jsonBody);
  }
  else if (strcmp(method, "DELETE") == 0)
  {
    httpResponseCode = http.sendRequest("DELETE", jsonBody);
  }
  else
  { // Default to GET
    httpResponseCode = http.GET();
  }

  // If the response code is positive, read the response
  if (httpResponseCode > 0)
  {
    response = http.getString();
  }
  else
  {
    response = "{\"error\":\"Request failed\"}";
  }

  // End the HTTP connection
  http.end();

  return response; // Return the response as a JSON encoded string
}

void loop()
{
  String thing = makeHttpRequest("http://192.168.0.15:3000/api/hardware/update", "POST", "{\"status\":\"online\"}");
  Serial.println(thing);

  // Delay between data sends to reduce power/network load
  delay(5000); // Send data every 10 seconds (adjust as needed)
}
