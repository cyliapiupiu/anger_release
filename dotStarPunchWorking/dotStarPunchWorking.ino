/* Knock Sensor

   This sketch reads a piezo element to detect a knocking sound.
   It reads an analog pin and compares the result to a set threshold.
   If the result is greater than the threshold, it writes
   "knock" to the serial port, and toggles the LED on pin 13.

   The circuit:
    * + connection of the piezo attached to analog in 0
    * - connection of the piezo attached to ground
    * 1-megohm resistor attached from analog in 0 to ground

   http://www.arduino.cc/en/Tutorial/Knock

   created 25 Mar 2007
   by David Cuartielles <http://www.0j0.org>
   modified 30 Aug 2011
   by Tom Igoe

   This example code is in the public domain.

 */
#include <Adafruit_DotStar.h>
#include <SPI.h>  

#define NUMPIXELS 105 // Number of LEDs in strip
#define DATAPIN    9
#define CLOCKPIN   10
Adafruit_DotStar strip = Adafruit_DotStar(
  NUMPIXELS, DATAPIN, CLOCKPIN, DOTSTAR_BRG);

// these constants won't change:
const int madButtonPin = 2;
const int ledPin = 13;      // led connected to digital pin 13
const int knockSensor = A0; // the piezo is connected to analog pin 0
const int threshold = 100;  // threshold value to detect punch

// these variables will change:
int brightR=0, brightG=0, brightB=0, overall=0, overallChange=5;
int punchChangeR=5, punchChangeB=0, punchChangeG=0, madButtonState = 0;
int sensorReading = 0;      // variable to store the value read from the sensor pin
int ledState = LOW;         // variable used to store the last LED status, to toggle the light

void setup() {

  strip.begin(); // Initialize pins for output
  strip.setBrightness(85);
  for (int ledNumber = 0; ledNumber<NUMPIXELS; ledNumber++){
      strip.setPixelColor(ledNumber, 0, 0, 0);
    }
  strip.show();  // Turn all LEDs off ASAP
  
  pinMode(ledPin, OUTPUT); // declare the ledPin as as OUTPUT
  pinMode(madButtonPin, INPUT_PULLUP);
  Serial.begin(9600);       // use the serial port
}

void loop() {
  // read the sensor and store it in the variable sensorReading:
  sensorReading = analogRead(knockSensor);
  madButtonState = digitalRead(madButtonPin);

  // if the sensor reading is greater than the threshold:
  if (sensorReading >= threshold) {
    if(overall <= 350) {
      Serial.println("{\"punched\": \"yes\"}");
    } else {
      Serial.println("{\"punched\": \"no\"}");
    }
    overall = overall + overallChange;
    if (overall < 30) {
      punchChangeR = 5;
      punchChangeB = 0;
    }
    if ((overall >= 30) && (overall < 100)) {
      punchChangeR = 4;
      punchChangeB = 1;
    }
    if ((overall >= 100) && (overall < 150)) {
      punchChangeR = 3;
      punchChangeB = 2;
    }
    if ((overall >= 150) && (overall < 200)) {
      punchChangeR = -2;
      punchChangeB = 4;
    }
    if ((overall >= 200) && (overall < 255)) {
      punchChangeR = -5;
      punchChangeB = 5;
    }
    brightG = brightG + punchChangeG;
    if (brightG > 255) brightG = 255;
    if (brightG < 0) brightG = 0;
    brightR = brightR + punchChangeR;
    if (brightR > 255) brightR = 255;
    if (brightR < 0) brightR = 0;
    brightB = brightB + punchChangeB;
    if (brightB > 255) brightB = 255;
    if (brightB < 0) brightB = 0;
    // toggle the status of the ledPin:
    for (int ledNumber = 0; ledNumber<NUMPIXELS; ledNumber++){
      strip.setPixelColor(ledNumber, brightG, brightR, brightB);
    }
    strip.show();
    ledState = !ledState;
    // update the LED pin itself:
    digitalWrite(ledPin, ledState);
    delay(200);
  }
  if (madButtonState == 0) {
    overall = 0;
    brightG = 0;
    brightB = 0;
    brightR = 0;
    for (int ledNumber = 0; ledNumber<NUMPIXELS; ledNumber++){
      strip.setPixelColor(ledNumber, brightG, brightR, brightB);
    }
    strip.show();
  }
  delay(10);  // delay to avoid overloading the serial port buffer
}
