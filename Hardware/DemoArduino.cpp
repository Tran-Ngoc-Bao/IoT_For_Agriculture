#include <WiFi.h>

#include <WiFiClient.h>

#include <WebServer.h>

int trigger_pin = 5;

int echo_pin = 18;

// Replace with your network credentials

const char *ssid = "Chcken_5G";

const char *password = "0377752925";

WebServer server(80);

String page = "";

int distance_cm;

void setup()
{

    Serial.begin(115200);

    pinMode(trigger_pin, OUTPUT);

    pinMode(echo_pin, INPUT);

    delay(1000);

    WiFi.begin(ssid, password);

    Serial.println("");

    while (WiFi.status() != WL_CONNECTED)
    {

        delay(500);

        Serial.print(".");
    }

    Serial.println("");

    Serial.print("IP address: ");

    Serial.println(WiFi.localIP());

    server.on("/", []()
              {
                  page = "<head><meta http-equiv=\"refresh\" content=\"3\"></head><center><h1>Ultasonic Water Level Monitor</h1><h3>Current water level:</h3> <h4>" + String(distance_cm) + "</h4></center>";

                  server.send(200, "text/html", page);
              });

    server.begin();

    Serial.println("Web server started!");
}

void loop()
{

    digitalWrite(trigger_pin, LOW);

    delayMicroseconds(2);

    digitalWrite(trigger_pin, HIGH);

    delayMicroseconds(10);

    digitalWrite(trigger_pin, LOW);

    long duration = pulseIn(echo_pin, HIGH);

    distance_cm = (duration / 2) / 29.09;

    Serial.println(distance_cm);

    server.handleClient();

    delay(3000);
}