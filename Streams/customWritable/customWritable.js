const { Writable } = require("node:stream");
const fs = require("node:fs");
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    //Bascially calls the parent constructor
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  //This will run after the contructor, and it will put off calling all the other
  //methods until cwe call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        //so if we call the callback with an argument, it means that we have an error
        //and we should not proceed
        callback(err);
      } else {
        //The reference to the file is stored in fd
        this.fd = fd;

        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    // do our write operation...
    this.chunks.push(chunk);

    this.chunksSize += chunk.length;
    // console.log(this.writableHighWaterMark);
    // console.log(this.chunksSize);

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (error) => {
        
        if (error) {
          return callback(error);
        }

        this.chunks = [];

        this.chunksSize = 0;
        this.writesCount += 1;
        callback();
      });
    } else {
      callback();
    }

    // when we're done, we should call the callback function
    // callback();
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes: ", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(error || err);
      });
    }
  }
}

async function loop() {
 

  const stream = new FileWriteStream({
    fileName: "text.txt",
  });

  //Size of our internal Buffer(Default:16384 Bytes OR 16KB)
//   console.log(stream.writableHighWaterMark);
//   console.log(stream.writableLength);

  /*
    It indicates the amount of data (in bytes) that has been written to the buffer,
    but has not yet been drained (i.e., not yet been sent to the underlying resource).
    */
  // console.log(stream.writableLength);

  let i = 0;
  let writeTimes = 10000000;
  let drainCount = 0;
  
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
    console.log(`Stream buffer ${drainCount} times`);
    console.timeEnd("writeMany");
  });

  writeMany();
}
loop();
// stream.write(Buffer.from("this is some string "));
// // stream.write(Buffer.from("this is some string"));
// stream.end(Buffer.from("Our last Write"));

// stream.on('finish', ()=>{
//     console.log('Stream was finished')
// })
// stream.on("drain", () => {console.log('Draining')});

//The above class is now equivalent of this stream object with some customizations
// const stream = fs.createWriteStream();
