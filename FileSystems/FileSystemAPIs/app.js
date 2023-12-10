// ****** Promise API ****** //
// const fs = require("fs/promises");

// async function Copy() {
//   try {
//     await fs.copyFile("text.txt", "copied-promise.txt");
//   } catch (error) {
//     console.log(error);
//   }
// }

// Copy();

// ****** Callback API ****** //
// const fs = require("fs");

// fs.copyFile("text.txt", "copied-promise.txt", (error) => {
//   if (error) {
//     console.log(error);
//   }
// });

// ****** Synchronous API ****** //

const fs = require("fs");

fs.copyFileSync("text.txt", "copied-sync.txt");

const numbers = [1, 2, 3, 4, 5];

// The function passed to map() is a callback
const doubled = numbers.map(function(number) {
  return number * 2;
});

console.log(doubled); // Output: [2, 4, 6, 8, 10]