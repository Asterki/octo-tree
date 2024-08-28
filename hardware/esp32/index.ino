#include <WiFiManager.h> // Include the WiFiManager library
#include <HTTPClient.h>
#include <ArduinoJson.h>

const int temperaturePin = 34;
const int humidityPin = 35;

const String serverURL = "http://192.168.0.15:3000";
const String boardID = "123123123";
const String boardKey = "123123123";

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
  // #region Fetch and perform actions
  // Get the information from the server, to check if there are any pending actions
  String actionsEndpoint = serverURL + "/api/hardware/get";
  String actionsResponse = makeHttpRequest(actionsEndpoint.c_str(), "POST", "{\"boardID\":\"" + boardID + "\",\"boardKey\":\"" + boardKey + "\"}");
  StaticJsonDocument<200> actions;
  deserializeJson(actions, actionsResponse);

  Serial.println(actionsResponse);

  // Check if there are any actions to perform
  if (actions.containsKey("actions"))
  {
    JsonArray actionsArray = actions["actions"].as<JsonArray>();
    for (JsonObject action : actionsArray)
    {
      String actionType = action["actionType"];
      String actionData = action["actionData"];

      // Perform the action based on the action type
      if (actionType == "reboot")
      {
        ESP.restart();
      }
      else if (actionType == "update") // TODO: Servomotor, LED, etc.
      {
        // Perform the update action
      }
    }
  }
  // #endregion


  // #region Send sensor data
  // Read the sensor values
  int temperatureValue = analogRead(temperaturePin);
  int humidityValue = analogRead(humidityPin);

  // Create a JSON object with the sensor data, the board ID and key
  String sensorData = "{\"temperature\":" + String(temperatureValue) + ",\"humidity\":" + String(humidityValue) + ",\"boardID\":\"" + boardID + "\",\"boardKey\":\"" + boardKey + "\"}";
  String sensorEndpoint = serverURL + "/api/hardware/update";
  String sensorResponse = makeHttpRequest(sensorEndpoint.c_str(), "POST", sensorData);

  // Print the response from the server
  Serial.println(sensorResponse);
  // #endregion

  // Delay between data sends to reduce power/network load
  delay(5000); // Send data every 10 seconds (adjust as needed)
}
