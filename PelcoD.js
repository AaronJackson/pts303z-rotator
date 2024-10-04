export default class PelcoD {
    constructor(address, port) {
	this.address = address;
	this.tilt = 0;
	this.pan = 0;
	this.port = port;

	this.FULL_RIGHT = 35000;
	this.FULL_UP = 4950;
    };

    prepareCommand(cmd1, cmd2, data1, data2) {
	const cmd = [
	    this.address,
	    cmd1, cmd2,
	    data1, data2
	];
	const checksum = cmd.reduce((a,b) => a+b, 0) % 100;
	return [
	    0xFF, ...cmd, checksum
	];
    }

    parseInput(bytes) {
	const cmd2 = bytes[3];
	const value = (bytes[4] << 8) | bytes[5];
	let name;
	switch (cmd2) {
	case 0x59:
	    name = 'pan';
	    this.pan = (value / this.FULL_RIGHT) * (360-4) + 4;
	    break;

	case 0x5b:
	    // half way would be 0 - looking straight ahead
	    // it was 35 degree swing each way
	    // up max 23 ,  down max 29
	    name = 'tilt';
	    this.tilt = (value / this.FULL_UP) * (29+23) - 29;
	    break;

	default:
	    return null;
	};

	return [name, value];
    }

    left(speed) {
	return this.prepareCommand(0x00, 0x04, speed, 0x00);
    }

    right(speed) {
	return this.prepareCommand(0x00, 0x02, speed, 0x00);
    }

    up(speed) {
	return this.prepareCommand(0x00, 0x08, 0x00, speed);
    }

    down(speed) {
	return this.prepareCommand(0x00, 0x10, 0x00, speed);
    }

    stop() {
	return this.prepareCommand(0x00, 0x00, 0x00, 0x00);
    }

    queryPan() {
	return this.prepareCommand(0x00, 0x51, 0x00, 0x00);
    }

    queryTilt() {
	return this.prepareCommand(0x00, 0x053, 0x00, 0x00);
    }
};
