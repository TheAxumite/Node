console.log("first")

require('fs').readFile('/Users/text.txt',(err,data) =>{
    if(err) return;
    //Do Something with data
    console.log("second");

})

console.log("third")