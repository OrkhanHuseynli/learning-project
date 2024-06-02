import net from "net";
import { getDate, host, port } from "./config.js";

debugger;
console.log(process.platform);

let testValue = 100
// process.emitWarning(
//   "Using fs.truncate with a file descriptor is deprecated. Please use " +
//     "fs.ftruncate with a file descriptor instead.",
//   "DeprecationWarning",
//   "DEP0081"
// );

// console.log(internalBinding('constants'))
testValue = 200

debugger;
var server = net
  .createServer(function (socket) {
    // confirm socket connection from client
    console.log(new Date() + "A client connected to server...");
    debugger;
    socket.on("lookup", function (data) {
      debugger;
      console.log(`LOOKUP : ${getDate()}`);
    });

    debugger;
    socket.on("drain", function (data) {
      debugger;
      console.log(`DRAIN : ${getDate()}`);
    });

    socket.on("close", function (data) {
      console.log(`CLOSE : ${getDate()}`);
    });

    socket.on("data", function (data) {
      debugger;
      console.log(`DATA : ${getDate()}`);
      var json = JSON.parse(data.toString());
      console.log(json);
    });

    // send info to client
    debugger;
    socket.write("Echo from server: NODE.JS Server \r\n");
    debugger;
    console.log({
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
        remoteFamily: socket.remoteFamily,
        localAddress: socket.localAddress,
        localPort: socket.localPort,
      });
    // socket.pipe(socket);
    debugger;
    socket.end();
    console.log("The client has disconnected...\n");
  })
  .listen(port, host);

// const socket = net.createConnection(port, host);
// console.log("Socket created.");
// socket
//   .on("data", function (data) {
//     // Log the response from the HTTP server.
//     console.log("RESPONSE: " + data);
//   })
//   .on("connect", function () {
//     // Manually write an HTTP request.
//     socket.write("GET / HTTP/1.0\r\n\r\n");
//   })
//   .on("end", function () {
//     console.log("DONE");
//   });
