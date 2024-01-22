const { Duplex } = require("node:stream");
const fs = require("node:fs");

class duplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    readFileName,
    writeFileName,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark });
    this.readFileName = readFileName;
    this.writeFileName = writeFileName;
    this.fdWrite = null;
    this.fdRead = null;
    this.bufferSize = readableHighWaterMark;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  _construct(callback) {
    fs.open(this.writeFileName, "w", (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fdWrite = fd;
      }
    });

    fs.open(this.readFileName, "r", (err, fd) => {
      if (err) {
        //so if we call the callback with an argument, it means that we have an error
        //and we should not proceed
        callback(err);
      } else {
        //The reference to the file is stored in fd
        this.fdRead = fd;
        callback();
      }
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.fdRead, buff, 0, size, null, (err, bytesRead) => {
      // console.log(bytesRead);
      if (err) return this.destroy(err);

      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _write(chunk, encoding, callback) {
    // do our write operation...
    this.chunks.push(chunk);

    this.chunksSize += chunk.length;
    // console.log('Readable ', this.writableHighWaterMark);
    // console.log('Writable ', this.writableHighWaterMark);

    // console.log("Size: ", this.chunksSize);
    if (this.chunksSize >= this.writableHighWaterMark) {
      fs.write(this.fdWrite, Buffer.concat(this.chunks), (error) => {
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
    fs.write(this.fdWrite, Buffer.concat(this.chunks), (err) => {
      console.log("last one");
      if (err) return callback(err);

      this.chunks = [];
      callback();
    });
  }

  _destroy(error, callback) {
    let errors = null;
    //Close Read file name
    if (this.fdRead) {
      console.log("Reading File Closed");
      fs.close(this.fdRead, (errRead) => {
        errors = errRead || error;
      });
    } else {
      callback(error);
    }

    if (this.fdWrite) {
      console.log("Writing File Closed");
      fs.close(this.fdWrite, (errWrite) => {
        return callback((errors && errWrite) || error);
      });
    } else {
      callback(error);
    }
  }
}

const duplex = new duplexStream({
  readFileName: "write-small.txt",
  writeFileName: "copy.txt",
});

duplex.write()

duplex.on("data", (chunk) => {
  if (chunk.length < duplex.writableHighWaterMark) {
    console.log("ending");
    return duplex.end(chunk);
  }
  if (!duplex.write(chunk)) {
    console.log("Pause");
    duplex.pause();
  }
});

duplex.on("drain", () => {
  console.log("drain");
  duplex.resume();
});

duplex.on("end", () => {
  console.log("Done Reading");
});

duplex.on("finish", () => {
  console.log("Completing Writing to file");
});
