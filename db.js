const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
let database;

async function connect() {
  if (database) return database;
  await client.connect();
  database = client.db(process.env.MONGODB_DB || 'loop_lost_found');
  await Promise.all([
    database.collection('users').createIndex({ email: 1 }, { unique: true }),
    database.collection('items').createIndex({ type: 1, status: 1, created_at: -1 }),
    database.collection('items').createIndex({ item_id: 1 }, { unique: true }),
    database.collection('categories').createIndex({ category_name: 1 }, { unique: true }),
    database.collection('categories').createIndex({ category_id: 1 }, { unique: true }),
    database.collection('claims').createIndex({ item_id: 1, claimant_id: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } }),
    database.collection('notifications').createIndex({ user_id: 1, created_at: -1 }),
    database.collection('matches').createIndex({ item_a: 1, item_b: 1 }, { unique: true })
  ]);
  await database.collection('categories').bulkWrite(
    ['Electronics', 'ID Card', 'Books', 'Keys', 'Clothing', 'Accessories', 'Stationery', 'Personal', 'Others'].map((category_name, i) => ({
      updateOne: { filter: { category_name }, update: { $setOnInsert: { category_name, category_id: i + 1 } }, upsert: true }
    }))
  );
  return database;
}

function db() {
  if (!database) throw new Error('Database is not connected.');
  return database;
}

async function nextId(name) {
  const result = await db().collection('counters').findOneAndUpdate(
    { _id: name }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' }
  );
  return result.seq;
}

module.exports = { client, connect, db, nextId };
