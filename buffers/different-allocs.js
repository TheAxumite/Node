const { Buffer } = require("buffer");

//Change the default poolsize
Buffer.poolSize = 16 * 1024;


const buffer = Buffer.alloc(10000, 0);


const unsafeBUffer = Buffer.allocUnsafe(10000);

//This method of allocating buffer will skip the buffer pool and allocate new, uninitialized memory directly from the system's memory.
const buff = Buffer.allocUnsafeSlow(2)

console.log(Buffer.poolSize)
console.log(Buffer.poolSize >>> 1)

/*
These methods use allocUnsafe method to allocate memory for the buffer, but they fill the buffer right away so its safer.
Buffer.from()
Buffer.concat()
*/

// for(let i = 0; i < unsafeBUffer.length; i++){
//     if(unsafeBUffer[i]!== 0){
//         console.log(`Element at position ${i} has value: ${unsafeBUffer[i].toString(16)}`)
//     }
// }


