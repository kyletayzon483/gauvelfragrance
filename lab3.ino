#define RESET_BUTTON 10  // Button to reset countdown
#define BUZZER 11        // Buzzer on pin 11

// Pins for 7-segment display
int segmentPins[] = {2, 3, 4, 5, 6, 7, 8};

// 7-segment encoding for digits 0-9 (Common Cathode)
byte digits[10][7] = {
    {1, 1, 1, 1, 1, 1, 0}, // 0
    {0, 1, 1, 0, 0, 0, 0}, // 1
    {1, 1, 0, 1, 1, 0, 1}, // 2
    {1, 1, 1, 1, 0, 0, 1}, // 3
    {0, 1, 1, 0, 0, 1, 1}, // 4
    {1, 0, 1, 1, 0, 1, 1}, // 5
    {1, 0, 1, 1, 1, 1, 1}, // 6
    {1, 1, 1, 0, 0, 0, 0}, // 7
    {1, 1, 1, 1, 1, 1, 1}, // 8
    {1, 1, 1, 1, 0, 1, 1}  // 9
};

int countdown = 9; // Initialize countdown variable

void setup() {
    // Set segment pins as output
    for (int i = 0; i < 7; i++) {
        pinMode(segmentPins[i], OUTPUT);
    }

    // Set buzzer and button
    pinMode(BUZZER, OUTPUT);
    pinMode(RESET_BUTTON, INPUT_PULLUP);

    showDigit(countdown); // Display initial countdown value
}

void loop() {
    if (digitalRead(RESET_BUTTON) == LOW) {
        delay(50);  // Debounce delay
        if (digitalRead(RESET_BUTTON) == LOW) { // Confirm button press
            countdown = 9;  // Reset countdown to 9
            showDigit(countdown);
            while (digitalRead(RESET_BUTTON) == LOW); // Wait for button release
        }
    }

    if (countdown >= 0) {
        showDigit(countdown);

        if (countdown <= 3 && countdown > 0) {
            beepBuzzer();  // Beep once per second at 3, 2, 1
        }

        if (countdown == 0) {
            digitalWrite(BUZZER, LOW); // Ensure buzzer is off at 0
            while (true) {
                if (digitalRead(RESET_BUTTON) == LOW) {
                    delay(50);
                    if (digitalRead(RESET_BUTTON) == LOW) { // Confirm reset button press
                        countdown = 9;  // Reset countdown
                        showDigit(countdown);
                        while (digitalRead(RESET_BUTTON) == LOW); // Wait for button release
                        break;
                    }
                }
            }
        }

        delay(1000);  // Wait 1 second
        countdown--;
    }
}

// Function to display a digit on the 7-segment display
void showDigit(int num) {
    for (int i = 0; i < 7; i++) {
        digitalWrite(segmentPins[i], digits[num][i]);
    }
}

// Function to beep the buzzer once
void beepBuzzer() {
    digitalWrite(BUZZER, HIGH);
    delay(200);  // Beep duration (200ms)
    digitalWrite(BUZZER, LOW);
}
