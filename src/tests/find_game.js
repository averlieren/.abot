require('coffeescript/register');
const Games = new (require('../games'));

if(!process.argv[2]) process.exit(1);
console.log("[.abot8] (coffee) Game: " + Games.find(process.argv[2]));
