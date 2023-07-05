
const shortid = require('shortid');
const mongoDB = require("../config/mongoDB");
const MONGO_COLLECTIONS = require("../constants/MONGO_COLLECTIONS");
const redis = require("../config/redis");

const baseUrl = process.env.SHORTURL_PATH;

const shorten = async (longUrl) => {

    try {

        const result = await mongoDB.findOne(MONGO_COLLECTIONS.URL_SHORTNER, {longUrl});
        if (result) {
            return result.shortUrl;
        }

        const urlCode = shortid.generate();
        const shortUrl = baseUrl + '/' + urlCode;

        // invoking the Url model and saving to the DB
        const urlModel = {
            longUrl,
            shortUrl,
            urlCode,
            date: new Date()
        };

        await mongoDB.insertOne(MONGO_COLLECTIONS.URL_SHORTNER, urlModel);
        redis.SetRedis(urlCode, longUrl, 60 * 60 * 24).then().catch(err => console.log(err));
        return shortUrl;
    }
    // exception handler
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    shorten
}