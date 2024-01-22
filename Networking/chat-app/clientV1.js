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
      client.write(`${id}-message-${message}`);
    };

    ask();

    client.on("data", async (data) => {
      //Log an empty line
      console.log()
      //Move the cursor up one line
      await moveCursor(0, -1);
      // clear that line that curor just moved into
      await clearLine(0);

      if (data.toString("utf-8").substring(0, 2) == "id") {
        // When we are getting the id...

        //Grab Everything from the third up until the end
        id = data.toString("utf-8").substring(3);
        console.log(`Your id is ${id}!\n`);
      } else {
        //When we are getting a message..
        console.log(data.toString('utf-8'))
      }

      ask();
    });
  }
);
