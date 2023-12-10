const { Buffer } = require('buffer');

//Allocate 4 bytes(32bits)

const memoryContainer = Buffer.alloc(4)

memoryContainer[3]


memoryContainer[0] = 0x0f4;
memoryContainer[1] = 0x34;
memoryContainer.writeInt8(-34, 2);
memoryContainer[3] = 0xff;


console.log(memoryContainer)
console.log(memoryContainer[0])
console.log(memoryContainer[1])
console.log(memoryContainer[2])
// console.log(memoryContainer.readInt8(2))
console.log(memoryContainer[3])


console.log(memoryContainer.toString('hex'))



//The Buffer.from() method in Node.js is used to create a new Buffer instance from a variety of inputs. 
//It's a flexible method for generating buffers from strings, arrays, or other buffers. 
//Node.js will allocate memory automatically when using this method
// const from  = Buffer.from([0x48, 0x69, 0x21])
// console.log(from.toString("utf-8"))


const buff = Buffer.from('486921', 'hex') 
const buff2 = Buffer.from('Hi!', 'utf-8') 
const buffThree = Buffer.from('E0A49B', 'utf-8') 

console.log(buff.toString('utf-8'))
console.log(buff2)

console.log(buffThree)