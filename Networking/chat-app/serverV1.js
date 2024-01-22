const { Socket } = require("dgram");
const net = require("net");
const { json } = require("stream/consumers");

const server = net.createServer();

const clients = [];
const messages = [];
const userNames = [];

server.on("connection", (socket, response) => {
  console.log("A new connection to client");

  const clientId = clients.length + 1;
  socket.write(`id-${clientId}`);

  //Broadcasting a message to everyone when someone enters the chat room
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  //Add the connected socket/client to a list
  clients.push({ id: Math.floor(Math.random() * 5000), socket });

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    const id = dataString
      .toString("utf-8")
      .substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    //Add messageobject to a list
    messages.push(message);

    //Broadcasting a message to all clients when a user leaves chat room
    clients.map((client) => {
      const dataString = data.toString("utf-8");
      //Transmit message object
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  //Broadcasting a message to all clients when a user leaves chat room
  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on,", server.address());
});
