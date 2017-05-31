const Database = new (require('../database'));
console.log("[.abot8] Retrieving data in 'users' collection of 'abot' database...");

async function check(db){
  let doc = await Database.find(db, {});
  console.log(`[.abot8] Collection '${db}' length: ${doc.length}`);
  if(process.argv[2] && db == 'users'){
    for(user of doc){
      if(user.data.username == process.argv[2] || user.id == process.argv[2])
        console.log(`[.abot8] Data for "${user.data.username}": ${user.games} (${user.options.tag.toUpperCase()})`);
    }
  }
}

check('users').then(() => {
  check('guilds').then(() => {
    console.log("[.abot8] Data retrieved.");
  })
})
