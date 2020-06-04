const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// const config = require('../config/config.json');
require('dotenv').config();
let database;

function connect() {
    return new Promise((resolve) => {
        MongoClient.connect(process.env.MONGODB_CONNECTION_URL)
            .then(db => {
                database = db;
                resolve(true);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

function insert(user, res) {
    database.collection('users', function (err, collection) {
        if (err) {
            return err;
        }
        collection.insert(user)
            .then(res.send(user))
            .catch(res.sendStatus(500));
    });
}

function getUsers(res) {
    database.collection('users').find().toArray()
        .then(docs => res.send(docs))
        .catch(err => handleError(err, res));
}

function remove(id, res) {
    database.collection('users').deleteOne({_id: toObjectId(id)})
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
}

function handleError(err, res) {
    return res.sendStatus(500);
}

function toObjectId(id) {
    return ObjectID(id);
}

module.exports.connect = connect

module.exports.insert = insert

module.exports.getUsers = getUsers

module.exports.remove = remove
