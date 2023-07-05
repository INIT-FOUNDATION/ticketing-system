const logger = require("../config/logger");
const AUTH = require("../constants/AUTH");
const CONST = require("../constants/CONST");
const STATUS = require("../constants/STATUS");
const QUERY = require("../constants/QUERY");
const pg = require("../config/pg");
const { match, parse } = require("matchit");

module.exports = async (req, res, next) => {

    const url = req._parsedUrl.pathname;
    const urlExist = Object.keys(match(url, AUTH.API.PUBLIC.map(parse))).length;
    const isAuthApi = urlExist == 0 ? false : true;

    const urlPatientExist = Object.keys(match(url, AUTH.API.PATIENT.map(parse))).length;
    const isPatientApi = urlPatientExist == 0 ? false : true;

    const urlPatientV1Exist = Object.keys(match(url, AUTH.API.PATIENT_V1.map(parse))).length;
    const isPatientV1Api = urlPatientV1Exist == 0 ? false : true;

    if (isAuthApi) return next();
    if (isPatientApi) return next();
    if (isPatientV1Api) return next();
    let found = false;

    if (isPatientV1Api) {
        return res.status(STATUS.FORBIDDEN).send("Unauthorized request!");
    }

    if (req.plainToken) {

        const token = req.plainToken;
        const userName = JSON.stringify(token.user_name);
        let userRole = JSON.stringify(token.role);
        found = true;

        try {

            const userStatus = await getUserStatus(userName.replace(/"/g, ''));
            if (userStatus.count = 0) {
                return res.status(STATUS.UNAUTHORIZED).send("Unauthorized request!");
            }

            const roleModifiedDate = JSON.stringify(token.roleModifiedDate).replace(/"/g, '');;
            const roleModuleDetails = await getRoleModuleList(userRole.replace(/"/g, ''));

            if (JSON.stringify(roleModuleDetails.date_modified) != JSON.stringify(roleModifiedDate)) {
                return res.status(STATUS.UNAUTHORIZED).send("Unauthorized request!");
            }

        } catch (error) {
            logger.error('error', error);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    }

    if (found) {
        return next();
    } else {
        return res.status(STATUS.FORBIDDEN).send("Unauthorized request!");
    }
};

async function getUserStatus(username) {

    try {

        const _query = {
            text: QUERY.ADMIN.getUserStatus,
            values: [username]
        };

        const queryRes = await pg.executeQueryPromise(_query)
        return queryRes[0];

    } catch (error) {
        throw new Error(error.message)
    }
};

const getRoleModuleList = async (role_id) => {
    try {

        const _query = {
            text: QUERY.ADMIN.selectRoleDetailsQueryByRoleId,
            values: [role_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports.getUserStatus = getUserStatus;
module.exports.getRoleModuleList = getRoleModuleList;