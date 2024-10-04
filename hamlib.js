import net from 'net';

export default class TCPRotator {
    constructor(listen, port, pelco) {
	this.listen = listen;
	this.port = port;
	this.pelco = pelco;
    }

    start() {
	this.server = net.createServer();
	this.server.listen(this.port, this.listen, () => {
	    console.log(`TCP Server listening on port ${this.port}`);
	});

	this.server.on('connection', sock => {
	    console.log(`Connection from ${sock.remoteAddress}`);

	    sock.on('data', data => {
		const str = data.toString();
		console.log(str);
		switch (str[0]) {
		case 'p': // get_pos
		    sock.write(`${this.pelco.pan}\n`);
		    sock.write(`${this.pelco.tilt}\n`);
		    break;
		case 'P': // set_pos
		    const parts = str.split(" ");
		    this.moveTo(
			Number(parts[1]),
			Number(parts[2]));
		    sock.write("RPRT 0\n");
		    break;
		case 'S':

		    return;
		}
	    });
	});
    }

};
