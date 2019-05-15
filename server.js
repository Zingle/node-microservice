const https = require("https");
const tlsopt = require("tlsopt");
const microservice = require("..");

// patch Server classes with systemd support
require("systemd");

const server = https.createServer(tlsopt.readSync());
const systemd = process.env.LISTEN_PID ? "systemd" : null;
const port = systemd || process.env.LISTEN_PORT || microservice.DEFAULT_PORT;

server.listen(port);
