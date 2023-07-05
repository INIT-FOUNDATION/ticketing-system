const { db, pg, redis, logger, queryUtility, s3Util } = require("init-micro-common");
const QUERY = require('../constants/QUERY');
const ERRORCODE = require('../constants/ERRORCODE');
const fileConfig = require('../constants/config');

let languageService = function () {
    // do nothing
};

languageService.getAllLanguages = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let _query = {
                text: QUERY.LANGUAGE.get_all_languages,
                values: []
            };

            let allLanguages = await pg.executeQueryPromise(_query);
            resolve(allLanguages);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = languageService;