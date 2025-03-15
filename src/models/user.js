
const bycrpt = require('bcryptjs')
const connectDB = require('../config/db');
const {collection} = require('../constant')

const collection2 = collection.COLLECTION2

async function getCollection1() { //use getCollection
    const db = await connectDB();
    return db.collection(collection2);
}

async function createUser(name, email, mobileNo, username, password, role) {
    const collection = await getCollection1();
    const salt = 10;
    const hashedPassword = await bycrpt.hash(password, salt)
    return await collection.insertOne({
        name, email, mobileNo, username, password: hashedPassword, role, createdAt: new Date(),
        updatedAt: new Date(),
    });
}

async function findUserByUsername(username) {
    const collection = await getCollection1();
    return await collection.findOne({ username: username }); //use userToken
}

module.exports = {
    createUser,
    findUserByUsername,
};