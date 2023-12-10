const EventEmitter = require("./events");

class Emitter extends EventEmitter {}

const myE = new Emitter();

// myE.on("foo", () => {
//   console.log("Events occured 1");
// });

// myE.on("foo", () => {
//   console.log("Events occured 2");
// });

// myE.on("foo", (x) => {
//   console.log("An event with a parameter occured.");
//   console.log(x);
// });

// myE.on("bar", (x) => {
//   console.log("An Event Occured bar");

// });

myE.once("bar", (x) => {
  console.log("An Event Occured bar");
});

// myE.emit("foo");
// myE.emit("foo", "some text");

//Calling listeners Asynchronously. By defaault event listeners are synchronously called in
//the order which they are registered

myE.on("event", (a, b) => {
  setImmediate(() => {
    console.log("this happens asynchronously");
  });
});



/*
When an error occurs within an EventEmitter instance, 
the typical action is for an 'error' event to be emitted. 
These are treated as special cases within Node.js.

If an EventEmitter does not have at least one listener registered for the 'error' event, 
and an 'error' event is emitted, the error is thrown, a stack trace is printed, 
and the Node.js process exits
 */
myE.on('error', (err) => {
    console.error(`${err} \n there was an error \n \n`);
  });


// Throws and crashes Node.js
// myE.emit("error", new Error("whoops!"));
// myE.emit("event", "a", "b");
// myE.emit("event", "a", "b");
myE.emit("event");
myE.emit("event");
myE.emit("event");
myE.emit("event");
myE.emit("event");
myE.emit("bar");
myE.emit("bar");
myE.emit("bar");
myE.emit("bar");
myE.emit("bar");
console.log(myE.listeners)