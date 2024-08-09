void setup()
{
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);
    while (!Serial)
    {
        delay(100);
    }
}

void loop()
{
    // Read what's coming from the serial
    if (Serial.available())
    {
        String command = Serial.readStringUntil('\n');
        command.trim();
        if (command == "on")
        {
            digitalWrite(LED_BUILTIN, HIGH);
            Serial.println("LED is on");
        }
        else if (command == "off")
        {
            digitalWrite(LED_BUILTIN, LOW);
            Serial.println("LED is off");
        }
        else
        {
            Serial.println("Unknown command");
        }
    }
}