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
    database.collection('users').insertOne(user)
        .then(res.send(user))
        .catch(err => handleError(err, res));
}

function getActiveUsers(res) {
    database.collection('users').find({isActive: true}).toArray()
        .then(docs => res.send(docs))
        .catch(err => handleError(err, res));
}

function getUser(user, res) {
    let query;
    if (user.name !== undefined) {
        query = {name: user.name};
    } else if (user._id !== undefined) {
        query = {_id: ObjectID(user._id)}
    }
    database.collection('users').find(query).toArray()
        .then(docs => res.send(docs))
        .catch(err => handleError(err, res));
}

function setStatus(user, res) {
    database.collection('users').updateOne(
        {_id: ObjectID(user._id)},
        {$set: {isActive: user.isActive}})
        .then(res.send(user))
        .catch(
            err => {
                handleError(err, res)
            }
        );
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

module.exports.getActiveUsers = getActiveUsers

module.exports.getUser = getUser

module.exports.setStatus = setStatus

module.exports.remove = remove
