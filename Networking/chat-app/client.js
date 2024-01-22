const { rejects } = require("assert");
const clientnet = require("net");
const { resolve } = require("path");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [];

//dir stands for direction and we are passing a 0 as the direction parameter
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, rejects) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const client = clientnet.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    console.log("Connected to server ");

    const ask = async () => {
      const message = await rl.question("Enter a message > ");
      //Move the cursor one line up
      await moveCursor(0, -1);
      //Clears the current line that the cursor is in
      await clearLine(0);
      client.write(message);
    };
    ask();

    client.on("data", async (data) => {
      console.log();
      await moveCursor(0, -1);
      // console.clear();
      await clearLine(0);


      try {
        const object = JSON.parse(data.toString("utf-8"));
        //If data is a valid object, we recieved a message
        for (const key in object) {
          console.log("User", key, ": ", object[key]);
        }
        //If error, data is a string message from the server. Possibily a notification
      } catch (error) {
        console.log(data.toString("utf-8"));
      }
      ask();
    });
  }
);


// client.on("end", () => {
//   console.log("Connection Terminated");
// });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const moveCursor = (dx, dy) => {
//   return new Promise((resolve, rejects) => {
//     process.stdout.moveCursor(dx, dy, () => {
//       resolve();
//     });
//   });
// };

// const messages = [];

// const client = clientnet.createConnection(
//   { host: "127.0.0.1", port: 3008 },
//   async () => {
//     console.log("Connected to server ");
//     moveCursor(0, 1);
//     ask();
//   }
// );

// client.on("end", () => {
//   console.log("Connection Terminated");
// });

// client.on("data", (data) => {
//   messages.push(data);
//   console.clear();

//   messages.map((message) => {
//     console.log(message.toString("utf-8"));
//   });
//   ask();
// });
// const ask = async () => {
//   const message = await rl.question("Enter a message > ");

//   client.write(message);
// };
