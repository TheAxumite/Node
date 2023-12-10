const { Buffer, constants } = require("buffer");

/*In Node.js, constants.MAX_LENGTH refers to the maximum length of a TypedArray or Buffer that can be created. 
This limit is derived from the maximum size of a heap allocation in the V8 JavaScript engine, which Node.js is built on.
This is a per-object-limit for individual buffers. You can create multiple buffers that are 4GB*/
console.log(constants.MAX_LENGTH)

const buffer = Buffer.alloc(1024  * 1024  * 1024 ); //1,000,000,000 (1GiB)

setInterval(() =>{ 

    // for (let i = 0; i < buffer.length; i++) {
    //     buffer[i] = 0x22;
    //   }

      //Faster method to fill a buffer vs a loop. More optimized for
      buffer.fill(0x22);
}, 5000)
