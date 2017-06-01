const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const path = require('path');
const Config = new (require(path.join(__dirname, 'config')));
const url = `mongodb://${Config.get('core/database/ip')}:${Config.get('core/database/port')}/${Config.get('core/database/name')}`;

class Database {
  async getConnection(){
    return await MongoClient.connect(url);
  }

  async find(collection, query){
    let connection = await this.getConnection();
    let cursor = connection.collection(collection).find(query);
    let doc = await cursor.toArray();
    connection.close();
    return doc;
  }

  async first(collection, query){
    let doc = await this.find(collection, query);
    return doc[0];
  }

  async insert(collection, doc){
    let connection = await this.getConnection();
    connection.collection(collection).insertOne(doc);
    connection.close();
  }

  async update(collection, filter, fields){
    let connection = await this.getConnection();
    connection.collection(collection).updateOne(filter, fields);
    connection.close();
  }

  async save(collection, filter, doc){
    let connection = await this.getConnection();
    connection.collection(collection).replaceOne(filter, doc);
    connection.close();
  }
}

module.exports = Database;
