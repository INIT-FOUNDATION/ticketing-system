const pg = require("../config/pg");
const QUERY = require("../constants/QUERY");
const logger = require("../config/logger");

var checkAppVersion = () => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ANDROIDAPP.selectAppVersionNumber
        };
      
        await pg.executeQuery(_query, (err, rows) => {
            if (err) {
                logger.error(err);
                return reject(err);
            } else if (rows.length == 0) {
                logger.error(err);
                return reject(err);
            } else {
                return resolve(rows[0].apk_version);
            }
        }); 
    }); 
}; 

module.exports = checkAppVersion;
