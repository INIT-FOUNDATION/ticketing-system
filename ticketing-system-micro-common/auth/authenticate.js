const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const CONST = require("../constants/CONST");
const STATUS = require("../constants/STATUS");
const AUTH = require("../constants/AUTH");
const { match, parse } = require("matchit");
let redis = require("../config/redis");
let crypto = require('crypto');

module.exports = async (req, res, next) => {

    try {

        const url = req._parsedUrl.pathname;
        const urlExist = Object.keys(match(url, AUTH.API.PUBLIC.map(parse))).length;
        const isAuthApi = urlExist == 0 ? false : true;
        const patientAppUrlExist = Object.keys(match(url, AUTH.API.PATIENT_V1.map(parse))).length;
        const isPatientAppApi = patientAppUrlExist == 0 ? false : true;

        if (isAuthApi) return next();

        const token = req.header("authorization");
        const decoded = jwt.verify(token, AUTH.SECRET_KEY);
        req.plainToken = decoded;

        const isPatAppToken = decoded.hasOwnProperty('isPatAppToken')

        if (isPatAppToken) {
            const tokenCacheKey = `PAT_TOKEN|${req.plainToken.mobile_number}`;
            const isValidPatient = await redis.GetKeyRedis(tokenCacheKey);

            if (isValidPatient) {
                logger.info(`Read Token Successfully for Patient : ${req.plainToken.mobile_number}`);
                next();
                return;
            }

            return res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
        }


        let isUserValid = await redis.GetKeyRedis(req.plainToken.user_name);
        if (isUserValid) {
            logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
            logger.info(
                `Read Token Successfully for User : ${req.plainToken.user_name}`
            );
            next();
        } else {

            var hashKey = crypto.createHash('md5').update(token).digest('hex');

            let isUserValidForSelfReg = await redis.GetKeyRedis(hashKey);

            if (isUserValidForSelfReg) {
                logger.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
                logger.info(
                    `Read Token Successfully for User : ${req.plainToken.user_name}`
                );
                next();
            } else {
                logger.debug(`Token Not Found In Redis`);
                res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
            }
        }
    } catch (ex) {
        logger.debug(`Error decrypting token ${JSON.stringify(ex)}`);
        res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
    }
};
