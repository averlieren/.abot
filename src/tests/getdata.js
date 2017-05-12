const Database = new (require('../database.js'));
console.log("[.abot8] Retrieving data in 'users' collection of 'abot' database...");

async function check(){
  let doc = await Database.find('users', {});
  console.log("[.abot8] Collection 'users' length: " + doc.length);
  if(process.argv[2]){
    for(user of doc){
      if(user.data.username == process.argv[2] || user.id == process.argv[2])
        console.log(`[.abot8] Data for "${user.data.username}": ${user.games}`);
    }
  }
}

check().then(() => {
  console.log("[.abot8] Data retrieved.");
})
