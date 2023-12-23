const { write } = require("fs");
const FileSystemCommand = require("/Users/leuld/OneDrive/Documents/Node/FileSystems/FileSystemCommands");
const fs = require("fs/promises");
// const fs = require("node:fs");

const fileCommand = new FileSystemCommand();

//Execution Time: 32.488s
//CPU Usage: 55%
//Memory Usage: 40MB
// async function loop() {
//     const fileHandle = await fs.open("test.txt", "w");
//     console.time("writeMany");
//     for (let i = 0; i < 1000000; i++) {
//       await fileHandle.write(`${i}`);
//     }
//     fileHandle.close();
//     console.timeEnd("writeMany");
//   }

// Execution Time: 4.827s
//CPU Usage: 56%(one core)
//Memory Usage: 50MB
// async function loop() {

//     console.time("writeMany");
//     fs.open("writeMany.txt", "w", (err,fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             fs.writeSync(fd, ` ${i} `);
//           }

//           console.timeEnd("writeMany");
//     });

//   }

//DON'T DO IT THIS WAY!
//Execution Time: 258.795ms
//CPU Usage: 56%
//Memory Usage: 198.8MB
// async function loop() {

//   console.time("writeMany");
//   const fileHandle = await fs.open("writeMany.txt", "w");

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     stream.write(buff);
//   }

//   console.timeEnd("writeMany");
//   fileHandle.close();
// }

async function loop() {
  const fileHandle = await fs.open("write-small.txt", "w");

  const stream = fileHandle.createWriteStream();

  // 100MB buffer;
  // the value 10 is saved as a hexadecimal 0xa, if this is saved into a text file its ASCII corresponds to \n of a newline character, so you just create a bunch of new lines in a text document
  // const buff = Buffer.alloc(16383, 10);
  // // Should return True since

  // console.log(stream.write(buff));

  // // Should return False because it exceeds the default memory size of stream(16kb) by 1byte
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));
  // console.log(stream.write(Buffer.alloc(1, "a")));

  // console.log("Number of Bytes written to stream Buffer: " + stream.writableLength);
  // //The drain event will activate once the stream memory size is exceeded
  // stream.on("drain", () => {
  //   console.log(stream.write(Buffer.alloc(16384, "a")));
  //   console.log("Number of Bytes written to stream Buffer: " + stream.writableLength)
  //   console.log("we are now safe to write more");

  // });

  // stream.write(buff);

  //Size of our internal Buffer(Default:16384 Bytes OR 16KB)
  console.log(stream.writableHighWaterMark);
  console.log(stream.writableLength);

  /*
  It indicates the amount of data (in bytes) that has been written to the buffer,
  but has not yet been drained (i.e., not yet been sent to the underlying resource).
  */
  // console.log(stream.writableLength);

  
  let i = 0;
  let writeTimes = 1000000
  let drainCount = 0
  console.time("writeMany");
  const writeMany = () => {
    while (i < writeTimes) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      if (i === writeTimes - 1) {
        //means you are done and it emits a finished event.
        return stream.end(buff);
      }

      if (!stream.write(buff)) {
        break;
      }

      i++;
    }
  };

  stream.on("drain", () => {
    drainCount += 1;
    writeMany();
  });

  stream.on("finish", () => {
    // console.log('You are done writing to file')
    // fileHandle.close();
    console.log(`Stream buffer ${drainCount} times`)
    console.timeEnd("writeMany");
  });

  writeMany();
  
}

loop();
// fileCommand.loadCommandFileHandler("./command.txt").then(() => {
//   fileCommand.watcher();

//   loop();
// });
