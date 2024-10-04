import { SerialPort } from 'serialport'
import PelcoD from './PelcoD.js'
import TCPRotator from './hamlib.js'

const delay = async (ms) => {
    return new Promise(r => setTimeout(r, ms));
};

const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })
const pelco = new PelcoD(1, port);
const tcpRotator = new TCPRotator('127.0.0.1', 4533, pelco);

port.write(pelco.stop());

port.on('readable', function () {
    const data = port.read();
    if (! data) return;

    pelco.parseInput(data);
});

setInterval(async () => {
    port.write(pelco.queryPan());
    await delay(100);
    port.write(pelco.queryTilt());
    await delay(100);

    console.log(`Tilt: ${pelco.tilt}\tPan: ${pelco.pan}`);
}, 500);

tcpRotator.start();
let lock = false;
tcpRotator.moveTo = async (pan, tilt) => {
    if (lock) return;
    lock = true;

    const delay = async (ms) => {
	return new Promise(r => setTimeout(r, ms));
    };

    console.log(`moving to ${tilt} , ${pan}`);
    const speed = 30;

    while (pan < pelco.pan && Math.abs(pan - pelco.pan) > 1.5) {
	port.write(pelco.left(speed));
	await delay(200);
    }
    port.write(pelco.stop());

    while (pan > pelco.pan && Math.abs(pan - pelco.pan) > 1.5) {
	port.write(pelco.right(speed));
	await delay(200);
    }
    port.write(pelco.stop());

    while (tilt < pelco.tilt && Math.abs(tilt - pelco.tilt) > 1.5) {
	port.write(pelco.down(speed));
	await delay(200);
    }
    port.write(pelco.stop());

    while (tilt > pelco.tilt && Math.abs(tilt - pelco.tilt) > 1.5) {
	port.write(pelco.up(speed));
	await delay(200);
    }
    port.write(pelco.stop());

    lock = false;
}


