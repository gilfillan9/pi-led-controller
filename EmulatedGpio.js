class Gpio {

    constructor(pin, settings) {
        this.pin = pin;
        this.settings = settings;
        console.log("Initialised GPIO pin " + pin, this.settings);
    }

    pwmWrite(dutyCycle) {
        console.log("Pin " + this.pin + " at duty cycle " + dutyCycle);
    }

    digitalWrite(level) {
        console.log("Pin " + this.pin + " digital at " + level);
    }
}

Gpio.OUTPUT = 'output';
Gpio.INPUT = 'input';

Gpio.PI_ALT0 = 'PI_ALT0';
Gpio.PI_ALT1 = 'PI_ALT1';
Gpio.PI_ALT2 = 'PI_ALT2';
Gpio.PI_ALT3 = 'PI_ALT3';
Gpio.PI_ALT4 = 'PI_ALT4';
Gpio.PI_ALT5 = 'PI_ALT5';
Gpio.PI_PUD_OFF = 'PI_PUD_OFF';
Gpio.PI_PUD_DOWN = 'PI_PUD_DOWN';
Gpio.PI_PUD_UP = 'PI_PUD_UP';
Gpio.RISING_EDGE = 'RISING_EDGE';
Gpio.FALLING_EDGE = 'FALLING_EDGE';
Gpio.EITHER_EDGE = 'EITHER_EDGE';
Gpio.PI_TIMEOUT = 'PI_TIMEOUT';
Gpio.PI_MIN_GPIO = 'PI_MIN_GPIO';
Gpio.PI_MAX_GPIO = 'PI_MAX_GPIO';
Gpio.PI_MAX_USER_GPIO = 'PI_MAX_USER_GPIO';
Gpio.PI_INIT_FAILED = 'PI_INIT_FAILED';
Gpio.PI_CLOCK_PWM = 'PI_CLOCK_PWM';
Gpio.PI_CLOCK_PCM = 'PI_CLOCK_PCM';

module.exports = Gpio;