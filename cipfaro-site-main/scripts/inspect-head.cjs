const fs = require("fs");
const b = fs.readFileSync("src/assets/logo-cip-faro-ei.jpeg");
console.log("len", b.length);
console.log(b.slice(0, 16).toString("hex"));
console.log(b.slice(0, 64).toString("base64"));
