//-- START: socket.io server
//-- https://github.com/andyet/signalmaster
var yetify = require('yetify'),
    socketConfig = require('getconfig'),
    sockets = require('./sockets'),
    socketPort = socketConfig.server.port,
    server_handler = function (req, res) {
        console.log("Conference Request");
        res.writeHead(404);
        res.end("OK");
    },
    socketServer = null;
// Create an http(s) server instance to that socket.io can listen to
if (socketConfig.server.secure) {
    socketServer = require('https').Server({
        key: fs.readFileSync(socketConfig.server.key),
        cert: fs.readFileSync(socketConfig.server.cert),
        passphrase: socketConfig.server.password
    }, server_handler);
} else {
    socketServer = require('http').Server(server_handler);
}
socketServer.listen(socketPort);
sockets(socketServer, socketConfig);
if (socketConfig.uid) process.setuid(socketConfig.uid);
var httpUrl;
if (socketConfig.server.secure) {
    httpUrl = "https://localhost:" + socketPort;
} else {
    httpUrl = "http://localhost:" + socketPort;
}
console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
//-- END: socket.io server
