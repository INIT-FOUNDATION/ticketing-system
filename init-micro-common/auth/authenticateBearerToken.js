const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const CONST = require("../constants/CONST");
const STATUS = require("../constants/STATUS");
const AUTH = require("../constants/AUTH");
const { match, parse } = require("matchit");
let redis = require("../config/redis");

module.exports = async (req, res, next) => {
    const url = req._parsedUrl.pathname;
    let urlExist = Object.keys(match(url, AUTH.API.PUBLIC.map(parse))).length;
    let isAuthApi = urlExist == 0 ? false : true;

    if (isAuthApi) return next();
    const bearerHeader = req.header("authorization");
    req.plainToken = null;
    try {
        const token = bearerHeader.split(' ')[1];
        const decoded = jwt.verify(token, AUTH.SECRET_KEY);
        req.plainToken = decoded;

        let isUserValid = await redis.GetKeyRedis(`User|txnId:${req.plainToken.txnId}`);

        if (isUserValid) {
            logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
            logger.info(
                `Read Token Successfully for User : ${req.plainToken.txnId}`
            );
            next();
        } else {
            let isUserValidForSelfReg = await redis.GetKeyRedis(req.plainToken.ua);
            if (isUserValidForSelfReg) {
                logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
                logger.info(
                    `Read Token Successfully for User : ${req.plainToken.txnId}`
                );
                next();
            } else {
                logger.debug(`Token Not Found In Redis`);
                res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
            }
        }
    } catch (ex) {

        res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
    }
};
