console.log("A");

setTimeout(() => {
  console.log("B");
}, 1);

// process.nextTick(() => {
//     console.log("B");
//   }, 0);

// setInterval(() => {
//     console.log("B");
//   }, 100);

// console.log("C");
// console.log("D");
// console.log("E");
// console.log("F");

for(let i = 0; i< 100000000; i++)
{

}