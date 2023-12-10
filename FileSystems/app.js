const fs = require("fs/promises");


(async () => {
  // commands
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete a file";
  const RENAME_FILE = "rename a file";
  const ADD_TO_FILE = "add a file";


  // we already have that file...
  const createFile = async (path) => {
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
  };

  const deleteFile = async (path) => {
    console.log(`Deleting ${path}...`);
  };

  const renameFile = async (newPath, oldPath) => {
    try{
      //we want to check whether or not the file name is taken
      const existingFileHandle = await fs.open(oldPath, "r");
      console.log(existingFileHandle);
      existingFileHandle.close();

      // we already have that file...
      return console.log(`The file ${path} already exists.`);
    } catch (e) {
      // we don't have the file, now we should create it
      const newFileHandle = await fs.rename(path, newPath);
      console.log(`Rename ${newPath} to ${oldPath}`);
      newFileHandle.close();
    }
   
  };

  const addToFile = async (path, content) => {
    console.log(`Adding to ${path}`);
    console.log(`Adding to ${content}}`);
  };

  const commandFileHandler = await fs.open("./command.txt", "r");

  commandFileHandler.on("change", async () => {
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0;

    // we always want to read the whole content (from beginning all the way to the end)
    await commandFileHandler.read(buff, offset, length, position);

    const command = buff.toString("utf-8");

    // create a file:
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    //delete a file
    //delete the file <path>
    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    //rename a file
    //rename the file <path> to <path>
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(' to ')
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(oldFilePath.length + 3);
      renameFile(newFilePath, oldFilePath);
    }
})
    // watcher...
    const watcher = fs.watch("./command.txt");
    for await (const event of watcher) {
      if (event.eventType === "change") {
        commandFileHandler.emit("change");
      }
    }
  
})();
