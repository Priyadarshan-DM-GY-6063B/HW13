int pot1Pin = A0; // Potentiometer 1 connected to A0
int pot2Pin = A1; // Potentiometer 2 connected to A1
int buttonPin = 2; // Button connected to digital pin 2
int pot1Value = 0;
int pot2Value = 0;
int buttonState = 0;

void setup() {
  Serial.begin(9600); // Start serial communication
  pinMode(buttonPin, INPUT);
}

void loop() {
  pot1Value = analogRead(pot1Pin); // Read potentiometer 1 value
  pot2Value = analogRead(pot2Pin); // Read potentiometer 2 value
  buttonState = digitalRead(buttonPin); // Read button state
  Serial.print(pot1Value); // Send potentiometer 1 value
  Serial.print(",");
  Serial.print(pot2Value); // Send potentiometer 2 value
  Serial.print(",");
  Serial.println(buttonState); // Send button state
  delay(100); // Small delay for stability
}
