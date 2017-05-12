const Games = new (require('../games.js'));

/*
  Finds games associated with User ID/Username
*/

if(!process.argv[2]) process.exit(1);
console.log("[.abot8] Game: " + Games.find(process.argv[2]));
