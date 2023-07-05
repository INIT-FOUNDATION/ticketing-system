const { pg, redis, logger, queryUtility } = require("init-micro-common");
const User = {};
let QUERY = require('../constants/QUERY')
const config = require("../config/config");


User.getProfileDtlsbyMob = async (id, result) => {
    const _query = {
        text: QUERY.USER.selectProfileDtlsbyMobQuery,
        values: [id]
    };
    await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: ", err);
            result(err, null);
        } else {
            logger.error("res: ", res);
            console.log(res)
            result(null, res);
        }
    }
    );
};

User.updatePassword = async (pwd, userId, username, result) => {
    const _query = {
        text: QUERY.USER.updateUserPwdQuery,
        values: [pwd, userId]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            User.setUserInRedisByUserName(username, pwd);
            result(null, res);
        }
    }
    );
};

User.selectUser = async (username, result) => {
    const _query = {
        text: QUERY.USER.selectUser,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            logger.error("error: " + err);
            result(err, null);
        } else {
            result(null, res);
        }
    }
    );
};


User.getUserDtlsPromise = async (id) => {
    const _query = {
        text: QUERY.USER.selectProfileDtlsQuery,
        values: [id]
    };
    var result = await pg.executeQueryPromise(_query);
    return result[0];
};

User.setPasswordHistory = async (userDetails, cb) => {
    let selectQuery = queryUtility.convertObjectIntoSelectQuery(userDetails);
    const _query = `${QUERY.USER.setPasswordHistory} ${selectQuery}`;
    var querySQL = await pg.executeQuery(_query, (err, res) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, res);
        }
    });
};

User.setUserInRedisByUserName = async (username, password) => {
    const _query = {
        text: QUERY.USER.selectUser,
        values: [username]
    };
    var querySQL = await pg.executeQuery(_query, (err, userObj) => {
        if (err) {
            logger.error("error: " + err);
        } else {
            if (userObj && userObj[0]) {
                redis.SetRedis(`User|Username:${username}`, userObj, config.user.REDIS_EXPIRE_TIME_PWD)
                    .then()
                    .catch(err => {
                        logger.error("error: " + err);
                    })
            }
        }
    });
};

User.updatePreferredLocationOfUser = async (userId, state_id, district_id, zipcode) => {
    try {
        let _query = {
            text: QUERY.USER.updatePreferredLocation,
            values: [state_id, district_id, zipcode, userId]
        };

        const queryResult = await pg.executeQueryPromise(_query);

        return queryResult;
    } catch (error) {
        throw error;
    }
};


User.getReportingTO = async (userData) => {
    try {
        if (userData.reporting_to) {
            const _query = {
                text: QUERY.USER.getReportingTO,
                values: [userData.user_id]
            };

            const queryResult = await pg.executeQueryPromise(_query);

            return queryResult[0];
        } else {
            return { reporting_to: null, reporting_to_name: null, reporting_to_designation: null }
        }


    } catch (error) {
        throw error;
    }
};


User.getHospitalAdministratorRoleID = async () => {
    try {
        const key = `HospitalAdministrator`
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        let _query = {
            text: QUERY.USER.getHospitalAdministratorRoleID
        };

        const queryResult = await pg.executeQueryPromise(_query)
        if (queryResult && queryResult[0].role_id) {
            redis.SetRedis(key, queryResult[0].role_id, 60 * 60 * 24).then().catch(err => console.log(err));
            return queryResult[0].role_id;
        } else {
            return 1;
        }
    } catch (error) {
        throw new Error(error.message)
    }
};


User.getHospitalDoctorRoleID = async () => {
    try {
        const key = `HospitalDoctor`
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        let _query = {
            text: QUERY.USER.getHospitalDoctorRoleID
        };

        const queryResult = await pg.executeQueryPromise(_query)
        if (queryResult && queryResult[0].role_id) {
            redis.SetRedis(key, queryResult[0].role_id, 60 * 60 * 24).then().catch(err => console.log(err));
            return queryResult[0].role_id;
        } else {
            return 1;
        }
    } catch (error) {
        throw new Error(error.message)
    }
};



module.exports = User;



