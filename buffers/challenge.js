const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(3);
console.log(memoryContainer.length)
const binary = ["0100", "1000", "0110", "1001", "0010", "0001"];

const memorySize = memoryContainer.length;
var counter = 0;

for (let i = 0; i < binary.length; i = i + 2) {
  if (counter < memorySize) {
    
    //convert binary to decimal
    let value = "0x" + parseInt(binary[i].concat(binary[i + 1]), 2).toString(16);

    // assign to buffer
    memoryContainer[counter] = value;

    counter = counter + 1;
  } else {
    break;
  }
}
// convert decimal to hex
console.log(memoryContainer.toString("utf-8"));
