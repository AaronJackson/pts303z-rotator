import mqtt from "mqtt";
import { SerialPort } from 'serialport'
import PelcoD from './PelcoD.js'
import TCPRotator from './hamlib.js'

const useMqtt = false;

if (useMqtt) {
    const mqttClient = mqtt.connect("mqtt://", {
	username: "",
	password: ""
    });

    mqttClient.on("connect", () => {
	mqttClient.subscribe("rotator/compass", (err) => {
	});
    });

    mqttClient.on("message", (topic, message) => {
	const parts = message.toString().split(",");
	pelco.pan = Number(parts[0]);
	pelco.tilt = Number(parts[1]) + 27 + 30;
    });

}

const delay = async (ms) => {
    return new Promise(r => setTimeout(r, ms));
};

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })
const pelco = new PelcoD(1, port);
const tcpRotator = new TCPRotator('127.0.0.1', 4533, pelco);

port.on('readable', function () {
    const data = port.read();
    if (! data) return;

    pelco.parseInput(data);
});

let lock = false;
setInterval(async () => {
    if (!useMqtt) {
	port.write(pelco.queryPan());
	await delay(200);
	port.write(pelco.queryTilt());
	await delay(200);
    }
    console.log(`Tilt: ${pelco.tilt}\tPan: ${pelco.pan}\tLocked: ${lock}`);
}, 500);

// port.write(pelco.up(0x3F));
// await delay(30000);
port.write(pelco.stop());

tcpRotator.start();

tcpRotator.moveTo = async (pan, tilt) => {
    if (lock) return;
    lock = true;

    console.log(`moving to ${tilt} , ${pan}`);
    const speed = 0x20;

    const left_down = (a, b) => a < b && Math.abs(a - b) > 1.5;
    const right_up  = (a, b) => a > b && Math.abs(a - b) > 1.5;

    if (pan >= 5 && pan <= 355) {
	if (left_down(pan, pelco.pan)) {
	    port.write(pelco.left(speed));
	    while (left_down(pan, pelco.pan))
		await delay(200);
	    port.write(pelco.stop());
	}

	if (right_up(pan, pelco.pan)) {
	    port.write(pelco.right(speed));
	    while (right_up(pan, pelco.pan))
		await delay(200);
	    port.write(pelco.stop());
	}
    }

    if (tilt >= 0 && tilt <= 125) {
    // if (tilt >= 20 && tilt <= 90) {	
	if (right_up(tilt, pelco.tilt)) {
	    port.write(pelco.up(0x3F));
	    while (right_up(tilt, pelco.tilt))
		await delay(200);
	    port.write(pelco.stop());
	}

	if (left_down(tilt, pelco.tilt)) {
	    port.write(pelco.down(0x3F));
	    while (left_down(tilt, pelco.tilt))
		await delay(200);
	    port.write(pelco.stop());
	}
    }
    lock = false;
}
