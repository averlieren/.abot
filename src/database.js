const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/abot';

class Database {
  connect(){
    /*
      Connects to database.
    */
    return new Promise((resolve) => {
      MongoClient.connect(url, (err,db) => {
        assert.equal(null, err);
        resolve(db);
      })
    })
  }

  insert(collection, doc){
    this.connect().then((db) => {
      db.collection(collection).insertOne(doc);
      db.close();
    })
  }

  async first(collection, query){
    return new Promise((resolve) => {
      this.connect().then((db) => {
        db.collection(collection).find(query).toArray((err, docs) => {
          if(docs.length > 0) resolve(docs[0]);
          resolve(null);
        })
        db.close();
      })
    })
  }

  find(collection, query){
    return new Promise((resolve) => {
      this.connect().then((db) => {
        let cursor = db.collection(collection).find(query);
        cursor.toArray((err, doc) => {
          if(err) console.log("[.abot8] Error while attempting to query database");
          resolve(doc);
        })
        db.close();
      })
    })
  }

  update(collection, filter, fields){
    this.connect().then((db) => {
      db.collection(collection).updateOne(filter, fields);
      db.close();
    })
  }

  save(collection, filter, doc){
    this.connect().then((db) => {
      db.collection(collection).replaceOne(filter, doc);
      db.close();
    })
  }
}

module.exports = Database;
