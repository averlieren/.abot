require('coffeescript').register();

const GamesJS = new (require('./legacy/games'));
const GamesCoffee = new (require('../games'));

/*
  Finds games associated with User ID/Username
  Generally, CS is about 3x faster than JS in this test
*/

if(!process.argv[2]) process.exit(1);
console.time('JS Time');
console.log("[.abot8] GameJS: " + GamesJS.find(process.argv[2]));
console.timeEnd('JS Time');
console.time('CS Time');
console.log("[.abot8] GameCoffee: " + GamesCoffee.find(process.argv[2]));
console.timeEnd('CS Time');
