import net from "net";
import { getDate, host, port } from "./config.js";

console.log(process.platform);
// process.emitWarning(
//   "Using fs.truncate with a file descriptor is deprecated. Please use " +
//     "fs.ftruncate with a file descriptor instead.",
//   "DeprecationWarning",
//   "DEP0081"
// );

// console.log(internalBinding('constants'))
var server = net
  .createServer(function (socket) {
    // confirm socket connection from client
    console.log(new Date() + "A client connected to server...");
    socket.on("lookup", function (data) {
      console.log(`LOOKUP : ${getDate()}`);
    });

    socket.on("drain", function (data) {
      console.log(`DRAIN : ${getDate()}`);
    });

    socket.on("close", function (data) {
      console.log(`CLOSE : ${getDate()}`);
    });

    socket.on("data", function (data) {
      console.log(`DATA : ${getDate()}`);
      var json = JSON.parse(data.toString());
      console.log(json);
    });

    // send info to client
    socket.write("Echo from server: NODE.JS Server \r\n");
    console.log({
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
        remoteFamily: socket.remoteFamily,
        localAddress: socket.localAddress,
        localPort: socket.localPort,
      });
    // socket.pipe(socket);
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
