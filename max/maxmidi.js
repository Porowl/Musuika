
const maxApi = require('max-api');

const Websocket = require('ws');
let ws;
maxApi.addHandler('connect', (url) => {

    ws = new Websocket(url);
    //console.log('attempt');
    ws.onopen = () => {
        ws.send("Hello, world!");
        //console.log("heloo")
    };
    ws.onmessage = (event) => {
        console.log(`receive message: ${event.data}`)
        maxApi.outlet('talkback', event.data);
        let temp = JSON.parse(event.data);

        maxApi.outlet('note',MIDI_NUM[temp.s]);
        maxApi.outlet('velocity',temp.x);
        maxApi.outlet('duration',temp.y);

        // control(temp.score, temp.s)



        //console.log(temp.s)
        //maxApi.post(temp.s);
    };
});

MIDI_NUM = {
    2:0,
    3:12,
    4:19,
    5:24,
    6:28,
    7:31,
    8:34,
    9:36,
    10:38,
    11:40,
    12:41,
}