const fs = require("fs/promises");
const EventEmitter = require("../EventEmitter/events");

module.exports = class FileSystemCommand extends EventEmitter {
  constructor() {
    super();
    this.CREATE_FILE = "create a file";
    this.DELETE_FILE = "delete the file";
    this.RENAME_FILE = "rename the file";
    this.ADD_TO_FILE = "add to the file";

    this.commandFileHandler = null;
    this.filePath = "./command.txt";
    this.boolean = true;

    this.watchPath = this.watchPathFinder(this.filePath, this.boolean);
    this.timeout = null;
  }

  //Returns an fs.watch function with the path file or simply returns
  watchPathFinder(path = "./command.txt", watch = false) {
    if (watch) {
      return fs.watch(path);
    }
    return path;
  }

  // watcher...
  async watcher() {
    for await (const event of this.watchPath) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.commandFileHandler.emit(event.eventType);
      }, 100); // Adjust timeout as needed
    }
  }
  

  async loadCommandFileHandler(path) {
    this.commandFileHandler = await fs.open(path, "r");
    // Perform additional setup if needed
    this.commandFileHandler.on("change", async () => {
      // get the size of our file
      const size = (await this.commandFileHandler.stat()).size;
      // allocate our buffer with the size of the file
      const buff = Buffer.alloc(size);
      // the location at which we want to start filling our buffer
      const offset = 0;
      // how many bytes we want to read
      const length = buff.byteLength;
      // the position that we want to start reading the file from
      const position = 0;

      // we always want to read the whole content (from beginning all the way to the end)
      await this.commandFileHandler.read(buff, offset, length, position);

      const command = buff.toString("utf-8");

      // create a file:
      // create a file <path>
      if (command.includes(this.CREATE_FILE)) {
        const filePath = command.substring(this.CREATE_FILE.length + 1);
        this.createFile(filePath);
      }

      //delete a file
      //delete the file <path>
      if (command.includes(this.DELETE_FILE)) {
        const filePath = command.substring(this.DELETE_FILE.length + 1);
        this.deleteFile(filePath);
      }

      //rename a file
      //rename the file <path> to <path>
      if (command.includes(this.RENAME_FILE)) {
        const _idx = command.indexOf(" to ");
        const oldFilePath = command.substring(
          this.RENAME_FILE.length + 1,
          _idx
        );
        const newFilePath = command.substring(_idx + 4);
        if (oldFilePath != newFilePath) {
          this.renameFile(newFilePath, oldFilePath);
        } else {
          console.log(`${oldFilePath} is already that name`);
        }
      }

      //add a file
      //add to the file <path> this content: <content>
      if (command.includes(this.ADD_TO_FILE)) {
        const _idx = command.indexOf(" this content: ");
        const filePath = command.substring(this.ADD_TO_FILE.length + 1, _idx);
        const content = command.substring(_idx + 15);
        this.addToFile(filePath, content);
      }
    });
  }

  async createFile(path) {
    try {
      // we want to check whether or not we already have that file
      const existingFileHandle = await fs.open(path, "r");
      existingFileHandle.close();

      // we already have that file...
      return console.log(`The file ${path} already exists.`);
    } catch (e) {
      // we don't have the file, now we should create it
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was successfully created.");
      newFileHandle.close();
    }
  }

  async deleteFile(path) {
    try {
      await fs.unlink(path);
      return console.log(`Deleting ${path}...`);
    } catch (e) {
      if (e.code === "ENONET") {
        console.log(`${path} does not exist`);
      } else {
        console.log("An error occured while deleting the file");
      }
    }
  }

  async renameFile(newPath, oldPath) {
    try {
      await fs.rename(oldPath, newPath);
      return console.log(`The file ${oldPath} has been renamed to ${newPath}`);
    } catch (error) {
      try {
        const checkOldFilePath = await fs.open(oldPath, "r");
        checkOldFilePath.close();
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log(
            `${oldPath} does not exist, or the destination doesn't exist`
          );
        } else {
          console.log("An error occured while removing the file \n");
          console.log(`${error}`);
        }
      }
    }
  }

  async addToFile(path, content) {
    const buffer = Buffer.from(" " + content, "utf-8");

    try {
      //Or you can use the 'a' flag which appends to the exisiting file
      const addContent = await fs.open(path, "r+");
      const size = (await addContent.stat()).size;
      const buff = Buffer.alloc(size);

      // The number of bytes from buffer to write.
      const length = buffer.byteLength;
      //The start position from within buffer where the data to write begins.
      const offSet = 0;
      //The offset from the beginning of the file where the data from buffer should be written.
      const position = buff.length;

      // console.log("Size: " + size);
      // console.log("Length: " + length);
      // console.log("Offset: " + offSet);
      // console.log("Position: " + position);

      addContent.write(buffer, offSet, length, position);
      console.log(`Adding to ${path}`);
      console.log(`Adding ${content}`);
      addContent.close();

      return console.log(`File Update Complete`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("File does not exist");
      }
    }
  }
};
