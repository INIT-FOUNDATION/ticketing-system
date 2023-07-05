const pg = require('../config/pg')
const logger = require("../config/logger");
const QUERY = require("../constants/QUERY");
const AWS = require("aws-sdk");
const User = {};

AWS.config.update({
    region: "ap-south-1"
});

s3 = new AWS.S3({ region: "ap-south-1" });


User.getUserDtls = (id) => {

    const _query = {
        text: QUERY.AUTH.selectProfileDtlsQuery,
        values: [id]
    };

    return new Promise(async (resolve, reject) => {
        const querySQL = await pg.executeQuery(_query,  (err, res) => {
            if (err) {
                logger.error("error: ", err);
                reject(err);
            } else {
                resolve(res[0]);
            }
        });
    });
};

// Service to get latest password Complexity
User.getPasswordComplexity = async () => {

    const _query = {
        text: QUERY.AUTH.getPasswordComplexityQuery,
        values: []
    };

    return new Promise(async (resolve, reject) => {
        const querySQL = await pg.executeQuery(_query,  (err, res) => {
            if (err) {
                logger.error("error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};


// Service to fetch User password history
User.getPasswordHistory = async (username) => {

    const _query = {
        text: QUERY.AUTH.getPasswordHistory,
        values: [username]
    };

    return new Promise(async (resolve, reject) => {
        const querySQL = await pg.executeQuery(_query,  (err, res) => {
            if (err) {
                logger.error("error: ", err);
                reject(err);
            } else {
                console.log(res);
                resolve(res);
            }
        });
    });
};

/* NEW QUERIES END */

User.checkIfExist = async (username, result) => {
    const _query = {
        text: QUERY.AUTH.checkIfUserExist,
        values: [username]
    };
    const querySQL = await pg.executeQuery(_query,  (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                result(null, res[0].usercount);
            }
        }
    );
};

User.getConfig = async (key, result) => {
    const _query = {
        text: QUERY.ADMIN.selectConfigQuery,
        values: [key]
    };

    const querySQL = await pg.executeQuery(_query,  (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = User;


