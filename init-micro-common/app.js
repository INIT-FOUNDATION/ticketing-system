// COMMOM INIT Class 

const db = require("./db/db");
const dynamodb = require("./config/dynamodb");
const pg = require("./config/pg");
const mongoDB = require("./config/mongoDB");
const mongoDBRead = require('./config/mongoDBRead');
const MONGO_COLLECTIONS = require("./constants/MONGO_COLLECTIONS")
const STATUS = require("./constants/STATUS");
const CONST = require("./constants/CONST");
const QUERY = require("./constants/QUERY");
const SECRET_KEY = require("./constants/AUTH");
const SECRET_KEY_CERT = require("./constants/AUTH");
const generateToken = require("./auth/generateToken");
const passwordPolicy = require("./auth/passwordPolicy");
const SECURITY = require("./auth/secure");
const JSONUTIL = require("./utility/JSONUTIL");
const SMS = require("./utility/SMS")
const queryUtility = require("./utility/queryUtility");
const generateTokenV2 = require("./auth/generateToken.v2");
const logger = require("./config/logger");
const redis = require("./config/redis");
const appVersionMiddleWare = require("./middleware/appversion.middleware");
const getModulesbyLocation = require("./middleware/getModulesbyLocation.middleware");
let smsMasterList = require('./config/sms');
const s3Util = require('./utility/s3.util');
const DB_STATUS = require('./constants/DB_STATUS');
const html_to_pdf = require('./config/html-to-pdf');
const whatsapp = require('./config/whatsapp');
const velocity = require('./config/velocity');
const whatsAppUtil = require('./utility/whatsapp.util');
const urlShortner = require('./utility/urlShortner');
// const initKafkaProducer = require('./config/kafka-producer').initKafkaProducer;
// const initKafkaConsumer = require('./config/kafka-consumer').initKafkaConsumer;

module.exports = {
    db,
    mongoDB,
    mongoDBRead,
    dynamodb,
    pg,
    STATUS,
    CONST,
    QUERY,
    generateToken,
    generateTokenV2,
    passwordPolicy,
    SECURITY,
    JSONUTIL,
    queryUtility,
    logger,
    redis,
    appVersionMiddleWare,
    getModulesbyLocation,
    smsMasterList,
    SECRET_KEY,
    SECRET_KEY_CERT,
    s3Util,
    DB_STATUS,
    MONGO_COLLECTIONS,
    html_to_pdf,
    whatsapp,
    SMS,
    velocity,
    whatsAppUtil,
    urlShortner
    // initKafkaProducer,
    // initKafkaConsumer
}

