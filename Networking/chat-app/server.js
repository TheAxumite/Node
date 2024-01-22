const { Socket } = require("dgram");
const net = require("net");
const { json } = require("stream/consumers");

const server = net.createServer();

const clients = [];
const messages = [];
const userNames = [];

server.on("connection", (socket, response) => {
  console.log("A new connection to client");

  //Create User name object with an ip/port number as key and a randomly generated user number
  let userName = {
    [`${socket.remoteAddress}:${socket.remotePort}`]: Math.floor(
      Math.random() * 5000
    ),
  };
    //Broadcasting a message to everyone when someone enters the chat room
    clients.map((client) => {
      client.write(`User ${userName[`${socket.remoteAddress}:${socket.remotePort}`]} joined!`);
    });


  socket.write(
    `Your UserId for this session is ${
      userName[`${socket.remoteAddress}:${socket.remotePort}`]
    }`.toString("utf-8")
  );
  //add User name object to list
  userNames.push(userName);

  //Add the connected socket/client to a list
  clients.push(socket);

  socket.on("error", () => {
    clients.map((client) => {
      let key = `${socket.remoteAddress}:${socket.remotePort}`;
      let user = userNames.find((obj) => obj.hasOwnProperty(key))[key];
      client.write(`User ${user} left!`.toString("utf-8"));
    });
  });

  socket.on("data", (data) => {
    // Assuming socket.remoteAddress, socket.remotePort, and data are defined
    let key = `${socket.remoteAddress}:${socket.remotePort}`;
    let value = data.toString("utf-8");

    // Construct a message object with a key value of ip/port
    let messageObject = {
      [key]: value,
    };

    //Add messageobject to a list
    messages.push(JSON.stringify(messageObject));
    console.log(messages)
    //Iterate through connected sockets
    clients.map((client) => {
      //Retrive the stored username that for the current incoming message/data
      let userName = userNames.find((obj) => obj.hasOwnProperty(key));

      //Create a JSON object using the username as key value
      let messageJSON = JSON.stringify({
        [userName[key]]: value,
      });

      //Transmit message object
      client.write(messageJSON.toString("utf-8"));
    });
  });
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on,", server.address());
});
