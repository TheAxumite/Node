const { maxHeaderSize } = require("http");
const EventEmitter = require("../EventEmitter/events");
class Emitter extends EventEmitter {}
const FileSystemCommand = require("/Users/leuld/OneDrive/Documents/Node/FileSystems/FileSystemCommands");
const fs = require("fs/promises");
const { Stream } = require("stream");
const myEvents = new Emitter();
const fileCommand = new FileSystemCommand();
const { pipeline } = require("node:stream");

// fileCommand.loadCommandFileHandler("./command.txt").then(() => {
//   fileCommand.watcher();

//   copy();
// });

async function copy() {
  myEvents.on("end", () => {
    console.log("Files copied");
  });

  console.time("writeMany");
  const destFile = await fs.open("text-copy.txt", "w");
  const result = await fs.open("text-small.txt", "r");

  //Get its size
  const size = (await result.stat()).size;

  //TODO: Need to get the current size of the file that is being read after its loaded into buffer which can be assumed
  // also as the starting location for reading the result object. Initialized at 0.
  let currentLocation = 0;

  while (currentLocation < size) {
    const buffer = Buffer.alloc(getSize(Number(size - currentLocation))); //64kb
    //Get Buffer size
    const length = buffer.byteLength;

    try {
      // Only returns or holds the bytesRead value which can be used as the value to incremeant by for the current increment variable
      const { bytesRead } = await result.read(
        buffer,
        0,
        length,
        currentLocation
      );

      /*
      Get the size of the Destination File and use it to start writing from,
      this will change everytime data is written into the destination file and can be used as the starting position for the next set of write
      */
      // const destFilePosition = (await destFile.stat()).size;

      destFile.write(buffer, 0, length);
      currentLocation += bytesRead;

    } catch (error) {
       console.log(error);
    }
  }
  console.timeEnd("writeMany");

  result.close();
  destFile.close();
  myEvents.emit("end");
}

function getSize(size) {
  //   console.time("copy");
  // console.log(Math.min(16 * 1024, (size - currentLocation)))
  return Math.min(64 * 1024, size);
}

copy();

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
// (async () => {
//   console.time("copy");
//   const srcFile = await fs.open("text-gigantic.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;
//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;
// if(bytesRead !== 16384) {
//     //Returns position of a buffer with the value 0
//     const indexOfNotFilled = readResult.buffer.indexOf(0)
//     const newBuffer = Buffer.alloc(indexOfNotFilled)
//     //copies into then new buffer from the beginning all the way up to where buffer with values of 0 start
//     readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled)
//     destFile.write(newBuffer)
// }else{
//     destFile.write(readResult.buffer);
// }

//   }

//   // console.log(await srcFile.read());
//   console.timeEnd("copy");
// })();

// async function copy() {
//   console.time("copy");

//   // console.time("writeMany");
//   const destFile = await fs.open("text-copy.txt", "w");
//   const srcFile = await fs.open("text-gigantic.txt", "r");

//   const readStream = srcFile.createReadStream();
//   const writeStream = destFile.createWriteStream();

//   // console.log(readStream.readableFlowing);
//   // readStream.pipe(writeStream);

//   // console.log(readStream.readableFlowing);
//   // readStream.unpipe(writeStream);

//   // console.log(readStream.readableFlowing);
//   // readStream.pipe(writeStream);

//   // readStream.on("end", () => {
//   //   console.timeEnd("copy");
//   // });

//   //You can have 1 readstreams but s1, s2, and s3 would need to be a transform or dulex stream that modify or
//   // process the datea in some way before passing it along to the next stream.
//   // pipeline(readStream, s1, s2, s3, writeStream)

//   pipeline(readStream, writeStream, (err) => {
//     console.log(err)
//     console.timeEnd("copy");
//   });
// }

// copy();
