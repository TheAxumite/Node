const net = require('net');

const socket = net.createConnection({host: "127.0.0.1", port: 3099}, function callback(){
    const buff = Buffer.alloc(2);
   
    socket.write("A simple mesesage coming from a simple sender!")
})