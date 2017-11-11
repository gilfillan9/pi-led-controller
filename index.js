const express = require('express')
const app = express();

const LightController = require('./LightController');

app.use(require("cors")());
app.use(require("body-parser").json());

app.get('/', (req, res) => res.json(LightController.get_state()));
app.post('/', (req, res) => {
    LightController.set_state(req.body, "number" === typeof req.body.duration ? req.body.duration : 1000);
    res.json(LightController.get_state());
});
app.post('/animate', (req, res) => {
    let steps = req.body;

    if (steps.length > 0) {
        let nextStep = () => {
            let step = steps.shift();
            if ("undefined" === typeof step) {
                console.log("Animation finished");
                return;
            }
            console.log("Next animation step ", step);
            LightController.set_state(step, "number" === typeof step.duration ? step.duration : 1000).then(nextStep)
        };

        nextStep();
    }
    res.json(true);
})
const port = process.env.PORT || 8080;

console.log("Listening on 127.0.0.1:" + port);
app.listen(port);