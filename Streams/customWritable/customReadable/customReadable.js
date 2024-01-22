const { Readable } = require("node:stream");
const fs = require("node:fs");
const FileWriteStream = require("../customWritable/customWritable");

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.readCount = 0;
    this.bufferSize = highWaterMark;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (error, fd) => {
      if (error) {
        callback(error);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);

    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      // console.log(bytesRead);
      if (err) return this.destroy(err);

      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      console.log("Reading File Closed");
      fs.close(this.fd, (err) => {
        return callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

console.time("writeMany");
const readstream = new FileReadStream({
  fileName: "text.txt",
  highWaterMark: 65536 * 100,
});

const writeStream = new FileWriteStream({
  fileName: "copy.txt",
  highWaterMark: 65536 * 100,
});

readstream.on("data", (chunk) => {
  if (!writeStream.write(chunk)) {
    readstream.pause();
  }
  if (chunk.length < readstream.bufferSize) {
    console.log("end");
    writeStream.end(chunk);
  }
});

writeStream.on("drain", () => {
  console.log("drain");
  readstream.resume();
});

readstream.on("end", () => {
  console.log(readstream.bufferSize);
  console.log("Done Reading");
});

writeStream.on("finish", () => {
  console.log("Completing Writing to file");
});
