const Database = new (require('../database'));
console.log("[.abot8] Clearing data in 'users' collection of 'abot' database.");

function clear(){
  return new Promise((resolve) => {
    Database.connect().then((db) => {
      db.collection('users').deleteMany({});
      db.collection('guilds').deleteMany({});
      db.close();
    })
    resolve();
  })
}

/*
  In order to prevent accidental erasure of database,
    this process will not execute clear function unless
    deliberate action is taken.
*/
process.exit(1);

clear().then(() => {
  console.log("[.abot8] Cleared successfully.");
})
