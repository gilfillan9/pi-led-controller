const fs = require("fs");
let Gpio;
try {
    Gpio = require('pigpio').Gpio;
} catch (e) {
    Gpio = require('./EmulatedGpio');
    console.log("Couldn't load gpio, using emulator");
}

let r = new Gpio(16, {mode: Gpio.OUTPUT});
let g = new Gpio(20, {mode: Gpio.OUTPUT});
let b = new Gpio(21, {mode: Gpio.OUTPUT});

class LightController {
    static get_state() {
        return this.state;
    }

    static set_state(data, time = 1000) {
        let newState = Object.assign({}, this.get_state());

        ['r', 'g', 'b'].forEach((key) => {
            let val = data[key];
            if ('number' === typeof val) {
                //Clamp RGB values between 0 and 255
                newState[key] = Math.min(255, Math.max(0, Math.round(val)));
            }
        });

        if ('number' === typeof data['luminance']) {
            //Clamp luminance value between 0 and 1.0
            newState['luminance'] = Math.min(1.0, Math.max(0, data['luminance']));
        }
        console.log("Updating state from ", this.get_state(), " to ", newState, " over ", time, "ms");

        this.state = newState;
        this.save_state();
        return this.do_animation(time);
    }

    static load_state() {
        let state = {
            r: 255,
            g: 255,
            b: 255,
            luminance: 1
        };
        try {
            Object.assign(state, JSON.parse(fs.readFileSync(LightController.SAVE_PATH)));
        } catch (e) {
            console.info("Couldn't load state");
        }

        LightController.state = state;
        LightController.active_state = Object.assign({}, state);
        console.log("Loaded state", state)
        this.update_lights();
    }

    static do_animation(time = 1000) {
        if (this.interval) clearInterval(this.interval);
        let i = 0;
        let interval = 10;
        let steps = Math.round(time / interval);

        if (steps <= 1) {
            this.active_state = Object.assign({}, this.state);
            this.update_lights();
            return Promise.resolve();
        }
        if (steps > 255) {
            interval = Math.round(time / 255);
            steps = 255;
        }

        let rDiff = (this.state.r - this.active_state.r) / steps;
        let gDiff = (this.state.g - this.active_state.g) / steps;
        let bDiff = (this.state.b - this.active_state.b) / steps;
        let lDiff = (this.state.luminance - this.active_state.luminance) / steps;

        return new Promise((resolve) => {
            this.interval = setInterval(() => {
                if (++i > steps) {
                    this.active_state = Object.assign({}, this.state);
                    clearInterval(this.interval);
                    this.update_lights();
                    resolve();
                    return;
                }
                this.active_state.r += rDiff;
                this.active_state.g += gDiff;
                this.active_state.b += bDiff;
                this.active_state.luminance += lDiff;
                this.update_lights();
            }, interval);
        });
    }

    static save_state() {
        fs.writeFile(LightController.SAVE_PATH, JSON.stringify(this.get_state()), (e) => e ? console.error("Couldn't save state ", e) : undefined);
    }

    static update_lights() {
        let luminance = this.active_state.luminance;
        let finalValue = Object.assign({}, this.active_state);
        ['r', 'g', 'b'].forEach((key) => {
            let val = finalValue[key];
            if ('number' === typeof val) {
                finalValue[key] = Math.min(255, Math.max(0, Math.round(val * luminance)));
            }
        });

        r.pwmWrite(255 - finalValue['r']);
        g.pwmWrite(255 - finalValue['g']);
        b.pwmWrite(255 - finalValue['b']);
    }
}
process.on('exit', exitHandler.bind(null, {cleanup: true}));
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

function exitHandler(options, err) {
    if (options.cleanup) {
        //Reset pins back to off
        r.digitalWrite(0);
        g.digitalWrite(0);
        b.digitalWrite(0);
    }
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}


LightController.SAVE_PATH = __dirname + '/state.json';

LightController.load_state();

module.exports = LightController;