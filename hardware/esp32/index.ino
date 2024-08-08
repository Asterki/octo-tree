#include <WiFi.h>
#include <NetworkClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>

const char *host = "192.168.0.15"; // This should not be changed
const int httpPort = 5000;		   // This should not be changed
bool connectedToWifi = false;

NetworkServer server(80); // Server used to set the credentials for a WiFi network

void setup()
{
	pinMode(LED_BUILTIN, OUTPUT);
	Serial.begin(115200);
	while (!Serial)
	{
		delay(100);
	}

	if (MDNS.begin("esp32"))
	{
		Serial.println("MDNS responder started");
	}

	Serial.println();
	Serial.println("Configuring access point...");
	if (!WiFi.softAP("Octo-Tree Board", "12345678"))
	{
		log_e("Soft AP creation failed.");
		while (1)
			;
	}
	IPAddress myIP = WiFi.softAPIP();
	Serial.print("AP IP address: ");
	Serial.println(myIP);
	server.begin();

	Serial.println("Server started");
}

void readResponse(WiFiClient &client)
{
	unsigned long timeout = millis();
	while (client.available() == 0)
	{
		if (millis() - timeout > 5000)
		{
			Serial.println(">>> Client Timeout !");
			client.stop();
			return;
		}
	}

	// Read all the lines of the reply from server and print them to Serial
	while (client.available())
	{
		String line = client.readStringUntil('\r');
		Serial.print(line);
	}

	Serial.printf("\nClosing connection\n\n");
}

void connectToWiFi(String ssid, String password)
{
	WiFi.begin(ssid, password); // Connect to the WiFi network
	while (WiFi.status() != WL_CONNECTED)
	{
		delay(1000);
		Serial.println("Connecting to WiFi...");
	}
	Serial.println("Connected to the WiFi network");
	digitalWrite(LED_BUILTIN, HIGH); // Turn on the LED
	connectedToWifi = true;
}

void loopWithWifiOn()
{
	// TODO: Read and write values to the arduino, while also sending the values to the server
	WiFiClient client;
	String footer = String(" HTTP/1.1\r\n") + "Host: " + String(host) + "\r\n" + "Connection: close\r\n\r\n";

	// WRITE --------------------------------------------------------------------------------------------
	if (!client.connect(host, httpPort))
	{
		return;
	}

	client.print("GET /" + footer);
	readResponse(client);

	delay(10000);
}

void loop()
{
	NetworkClient client = server.accept(); // listen for incoming clients

	if (client)
	{								   // if you get a client,
		Serial.println("New Client."); // print a message out the serial port
		String currentLine = "";	   // make a String to hold incoming data from the client
		String ref = "empty";
		while (client.connected())
		{ // loop while the client's connected
			if (client.available())
			{							// if there's bytes to read from the client,
				char c = client.read(); // read a byte, then
				if (c == '\n')
				{
					if (currentLine.length() == 0)
					{
						// Index page
						client.println("HTTP/1.1 200 OK");
						client.println("Content-type:text/html");
						client.println();

						// TODO: Show a list of available WiFi networks

						// 2 dialog boxes to enter the SSID and password
						client.println("<!DOCTYPE html><html><head><title>Octo-Tree Board</title></head><body>");
						client.println("<h1>Octo-Tree Board</h1>");
						client.println("<form action='/' method='GET'>");
						client.println("<label for='ssid'>SSID:</label><br>");
						client.println("<input type='text' id='ssid' name='ssid'><br>");
						client.println("<label for='password'>Password:</label><br>");
						client.println("<input type='password' id='password' name='password'><br><br>");
						client.println("<input type='submit' value='Submit'>");
						client.println("</form>");
						client.println("</body></html>");

						// The HTTP response ends with another blank line:
						client.println();
						// break out of the while loop:
						break;
					}
					else
					{
						// Start looking for the Referer header
						if (currentLine.startsWith("Referer: "))
						{
							ref = currentLine.substring(9);
						}

						// if you got a newline, then you know that the currentLine is complete
						currentLine = "";
					}
				}
				else if (c != '\r')
				{					  // if you got anything else but a carriage return character,
					currentLine += c; // add it to the end of the currentLine
				}

				if (ref != "empty" && !connectedToWifi)
				{
					int ssidIndex = ref.indexOf("ssid=");
					int passwordIndex = ref.indexOf("password=");

					if (ssidIndex != -1 && passwordIndex != -1 && passwordIndex > ssidIndex)
					{
						String ssid = ref.substring(ssidIndex + 5, passwordIndex - 1); // Extract the SSID
						String password = ref.substring(passwordIndex + 9);			   // Extract the password

						connectToWiFi(ssid, password); // Connect to the WiFi network
					}
					else
					{
						Serial.println("Error: Unable to extract SSID and/or password.");
					}
				}
			}
		}
		// close the connection:
		client.stop();
		Serial.println("Client Disconnected.");
	}

	if (WiFi.status() == WL_CONNECTED)
	{
		loopWithWifiOn();
	}
}
