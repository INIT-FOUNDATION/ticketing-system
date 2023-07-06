const { MongoClient } = require('mongodb')
const user = process.env.INIT_NOSQL_USER;
const database = process.env.INIT_NOSQL_DATABASE;
const password = process.env.INIT_NOSQL_PASSWORD;
const host = process.env.INIT_NOSQL_HOST;
const port = process.env.INIT_NOSQL_PORT;
const connectionRequired = process.env.INIT_NOSQL_DB_REQUIRED

let url = ""
if (process.env.INIT_DOCDB_CA_BUNDLE && user && password) {
    url = `mongodb://${user}:${password}@${host}:${port}/${database}?tls=true&tlsCAFile=/usr/src/app/ticketing-system-micro-common/config/rds-combined-ca/rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`
} else if (user && password) {
    url = `mongodb://${user}:${password}@${host}:${port}/?readPreference=primary&directConnection=true&ssl=false&authSource=${database}`
} else {
    url = `mongodb://${host}:${port}/?readPreference=primary&directConnection=true&ssl=false`
}

let dbo;
let client;
async function main() {
    await client.connect()
    console.log('Connected successfully to MongoDB Read server')
    dbo = client.db(database)
    return 'done.'
}

if (connectionRequired == "true") {
    client = new MongoClient(url)
    main().then(console.log).catch(console.error);
}

const findAll = async (collectionName) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find({}).toArray()
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findOne = async (collectionName, doc) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.findOne(doc)
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const isExist = async (collectionName, filterData) => {
    try {
        const collection = dbo.collection(collectionName)
        const result = await collection.find(filterData, { projection: { _id: 1 } }).limit(1).toArray()
        return result.length == 0 ? false : true;
    } catch (error) {
        throw new Error(error.message)
    }
}

const filteredDocs = async (collectionName, filterData) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find(filterData).toArray()
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const filteredDocsWithSort = async (collectionName, filterData, sortParams) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find(filterData).sort(sortParams).toArray()
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const count = async (collectionName, doc = {}) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.count(doc)
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findWithLimit = async (collectionName, doc = {}, projection = { _id: 0 }, limit, sortParam, offset = 0) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find(doc, { projection: projection }).sort(sortParam).limit(limit).skip(offset).toArray();
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findWithProjectionSort = async (collectionName, doc = {}, projection = { _id: 0 }, sortParam) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find(doc, { projection: projection }).sort(sortParam).toArray();
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findWithAggregation = async (collectionName, aggregation) => {
    try {
        let findResult = []
        const collection = dbo.collection(collectionName)
        const aggCursor = collection.aggregate(aggregation);
        for await (const doc of aggCursor) {
            findResult.push(doc)
        }
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findAllWithProjection = async (collectionName, doc, projection = { _id: 0 }) => {
    try {
        const collection = dbo.collection(collectionName)
        const findResult = await collection.find(doc, { projection: projection }).toArray();
        return findResult;
    } catch (error) {
        throw new Error(error.message)
    }
}


module.exports = { findAll, findOne, isExist, filteredDocs, count, findWithLimit, filteredDocsWithSort, findWithProjectionSort, findWithAggregation, findAllWithProjection }


