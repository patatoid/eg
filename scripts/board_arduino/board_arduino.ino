#define BUTTON_1 2
#define BUTTON_2 3
#define LED 4

void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);
  pinMode(BUTTON_1, INPUT_PULLUP);
  pinMode(BUTTON_2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(BUTTON_1), button1, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON_2), button2, FALLING);
}

volatile unsigned long time_button_1=0;
volatile unsigned long time_button_2=0;
int counter = 0;
int last_add_counter_pin = 0;

void button1() {
  time_button_1 = millis();
}

void button2() {
  time_button_2 = millis();
}

void reset() {
  counter = 0;
  last_add_counter_pin = 0;
  delay(100);
}

void loop() {
  unsigned long delta_1 = millis() - time_button_1;
  unsigned long delta_2 = millis() - time_button_2;
  if(delta_1 > 1500 || delta_2 > 1500) {
    reset();
    return;
  }

  if(delta_1 < 100) {
    if(last_add_counter_pin!=BUTTON_1) {
       counter++;
       last_add_counter_pin=BUTTON_1;
    }
  }

  if(delta_2 < 100) {
    if(last_add_counter_pin!=BUTTON_2) {
       counter++;
       last_add_counter_pin=BUTTON_2;
    }
  }

  if(counter==9) {
    reset();
    digitalWrite(LED, HIGH);
    delay(2000);
    digitalWrite(LED, LOW);
  }
  delay(100);
}
