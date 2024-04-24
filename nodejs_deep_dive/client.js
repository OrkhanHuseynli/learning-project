import { getDate, host, port } from "./config.js";
import net from "net";

var client = new net.Socket();
const tcpOptions = {
  port: port,
  host: host,
  // localAddress?: string | undefined,
  localPort: 3033,
};
client.connect(tcpOptions, function () {
  console.log(`CONNECT : ${getDate()}`);
  console.log("Connected"); // acknowledge socket connection
  client.write('{"name":"RICH"}'); // send info to Server
  console.log({
    remoteAddress: client.remoteAddress,
    remotePort: client.remotePort,
    remoteFamily: client.remoteFamily,
    localAddress: client.localAddress,
    localPort: client.localPort,
  });
});

client.on("lookup", function (data) {
  console.log(`LOOKUP : ${getDate()}`);
});

client.on("drain", function (data) {
  console.log(`DRAIN : ${getDate()}`);
});

client.on("data", function (data) {
  console.log("Received: " + data); // display info received from server
  client.destroy(); // kill client after server's response
});

client.on("close", function () {
  console.log(`CLOSE : ${getDate()}`);
  console.log("Connection closed");
});
