const fs = require("node:fs/promises");

async function lookup() {
  const fileHandleRead = await fs.open("text-small.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");


  // const size = (await fileHandleRead.stat()).size;

  const streamRead = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
  });
  const streamWrite = fileHandleWrite.createWriteStream();

  
  console.time("writeMany");
  let split = "";




  //Stream does not get read until the bottom code is running
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");
    /* 
    checks if the first index of chunk Object minus 1 when compared to the next index are equal, and then checks if the split object contains anything, which in this case means it is storing from a previous split, which will always be true if the two numbers do not match
    if so, then it will concat the current first index and the previous last index which is stored in the split object,
    it will then check to see if the last indexed object -1 is equal to the one before it, if not the last indexed value will be stored in the split object
    This only works for values that are in sequence 
    */
    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) {
        numbers[0] = split.concat(numbers[0]);
      }
    }
    if (
      Number(
        numbers[numbers.length - 2] + 1 !== Number(numbers[numbers.length - 1])
      )
    ) {
      split = numbers.pop();
    }
    numbers.forEach((num) => {
      if(Number(num) % 2 === 0){
        if (!streamWrite.write(" " + (num * 10) + " ")) {
          streamRead.pause();
        }
      }
      
    
    });

    // console.log("---------");
    // console.log(number[number.length - 2]);
    // console.log(number[number.length - 1]);
    // console.log("---------");
    // let even = [];
    // for (let i = 0; i < number.length; i++) {
    //   if (number[i] % 2 === 0) {
    //     even.push(number[i])
    //   }

    // }

    
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.log('Done Reading')
    console.timeEnd("writeMany");
  });

  // const numberOfWrites = 1000000;
  // const writeMany = () => {
  //   while (i < numberOfWrites) {
  //     const buff = Buffer.from(` ${i} `, "utf-8");

  //     if (i === numberOfWrites - 1) {
  //       //means you are done and it emits a finished event.
  //       return stream.end(buff);
  //     }

  //     if (!stream.write(buff)) {
  //       break;
  //     }

  //     i++;
  //   }
  // };

  // stream.on("drain", () => {
  //   drainCount += 1;
  //   writeMany();
  // });

  // stream.on("finish", () => {
  //   // console.log('You are done writing to file')
  //   // fileHandle.close();
  //   console.log(`Stream buffer ${drainCount} times`)
  //   console.timeEnd("writeMany");
  // });

  // writeMany();
}

lookup();
