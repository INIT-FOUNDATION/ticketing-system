let {
    db,
    redis,
    logger, pg
} = require("ticketing-system-micro-common");

let locations = function () {
    // do nothing
};

const { isNull } = require("underscore");

const QUERY = require('../constants/QUERY');
const ERRORCODE = require('../constants/ERRORCODE');
const PAGESIZE = require('../constants/CONST')

locations.getLocationFacilitydataGridNew = async (token, limit, locObj, cb) => {
    try {

        let state_id = locObj[0] ? locObj[0] : token.state_id;
        let district_id = locObj[1] ? locObj[1] : token.district_id;
        let block_id = locObj[2] ? locObj[2] : token.block_id;
        let facility_id = locObj[3] ? locObj[3] : token.facility_id;
        let page_size = locObj[4] ? locObj[4] : PAGESIZE.pagesize.PAGE_SIZE;
        let current_page = locObj[5] ? locObj[5] : 0;
        let search = locObj[6];
        let offset = current_page;
        if (current_page != 0 && current_page != 1) {
            current_page = ((current_page - 1) * page_size)
        } else {
            current_page = 0
        }

        let key = "Location-Facility-Data";
        let queryString = '';

        if (state_id) {
            key = `Location-Facility-Data|State:${state_id}`;
            queryString = `where state_id = ${state_id}`
        }
        if (state_id && district_id) {
            key = `Location-Facility-Data|State:${state_id}|District:${district_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id}`
        }

        if (state_id && district_id && block_id) {
            key = `Location-Facility-Data|State:${state_id}|District:${district_id}|Block:${block_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id} and block_id = ${block_id}`
        }

        if (state_id && district_id && block_id && facility_id) {
            key = `Location-Facility-Data|State:${state_id}|District:${district_id}|Block:${block_id}|Facility:${facility_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id} and block_id = ${block_id} and facility_id = ${facility_id}`
        }


        queryString += ` order by date_created desc limit ${current_page}, ${page_size}`
        key += `|Offset:${offset}`



        let redisResult = await redis.GetKeys(key);

        if (redisResult && redisResult.length > 0) {
            const result = await redis.GetRedis(redisResult);

            cb(null, JSON.parse(result[0]));
        } else {

            var queryView = await pg.executeQuery(
                QUERY.ADMIN.viewLFGrid + queryString,
                async (err, res) => {
                    if (err) {
                        logger.error(err)
                    } else {
                        if (res.length > 0) {
                            redis.SetRedis(key, res, process.env.INIT_REDIS_SHORT_TTL)
                                .then()
                                .catch(err1 => logger.error(err1));
                        }
                        cb(null, res);
                    }
                }
            );
        }
    } catch (error) {
        cb(error, null);
    }
};


locations.getLocationFacilitydataGridNewCount = async (token, limit, locObj, cb) => {
    try {

        let state_id = locObj[0] ? locObj[0] : token.state_id;
        let district_id = locObj[1] ? locObj[1] : token.district_id;
        let block_id = locObj[2] ? locObj[2] : token.block_id;
        let facility_id = locObj[3] ? locObj[3] : token.facility_id;


        let queryString;
        let key = "Location-Facility-Count";

        if (state_id) {
            key = `Location-Facility-Count|State:${state_id}`;
            queryString = `where state_id = ${state_id};`
        }
        if (state_id && district_id) {
            key = `Location-Facility-Count|State:${state_id}|District:${district_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id};`
        }

        if (state_id && district_id && block_id) {
            key = `Location-Facility-Count|State:${state_id}|District:${district_id}|Block:${block_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id} and block_id = ${block_id};`
        }

        if (state_id && district_id && block_id && facility_id) {
            key = `Location-Facility-Count|State:${state_id}|District:${district_id}|Block:${block_id}|Facility:${facility_id}`;
            queryString = `where state_id = ${state_id} and district_id = ${district_id} and block_id = ${block_id} and facility_id = ${facility_id};`
        }
        let redisResult = await redis.GetKeys(key);
        if (redisResult && redisResult.length > 0) {
            const result = await redis.GetRedis(redisResult);
            cb(null, Number(result[0]));
        } else {
            var queryView = await pg.executeQuery(
                QUERY.ADMIN.countLFGrid + queryString,
                async (err, res) => {
                    if (err) {
                        logger.error(err)
                    } else {
                        redis.SetRedis(key, res[0].count, process.env.INIT_REDIS_SHORT_TTL)
                            .then()
                            .catch(err1 => logger.error(err1));
                        cb(null, res[0].count);

                    }
                }
            );
        }
    } catch (error) {
        logger.error(error)
    }
};

locations.getQuery = async (type, id) => {
    return new Promise(async (resolve, reject) => {
        let query = " where 1=1";
        if (type == "STATE") {
            query += " AND state_id = " + id;
        } else if (type == "DIST") {
            query += " AND district_id = " + id;
        } else if (type == "BLOCK") {
            query += " AND block_id = " + id;
        }
        resolve(query);
    });
}

//Get City  By ID
locations.getCityById = async (cityId) => {
    try {
        const _query = {
            text: QUERY.ADMIN.selectCityDataQuery,
            values: [cityId]
        }
        const result = await pg.executeQueryPromise(_query)
        return result
    }
    catch (error) {
        throw new Error(error.message)
    }
}

//Get DIstrict By ID
locations.getDistrictById = async (districtId) => {
    try {
        const _query = {
            text: QUERY.ADMIN.selectDistrictDataQuery,
            values: [districtId]
        }
        const result = await pg.executeQueryPromise(_query)
        return result
    }
    catch (error) {
        throw new Error(error.message)
    }
}

//Get State By ID
locations.getStateById = async (stateId) => {
    try {
        const _query = {
            text: QUERY.ADMIN.selectStateDataQuery,
            values: [stateId]
        }

        const result = await pg.executeQueryPromise(_query)
        return result
    }
    catch (error) {
        throw new Error(error.message)
    }

}

locations.getLocalitybyPincode = async (pincode) => {
    try {
        const _query = {
            text: QUERY.ADMIN.getLocalitybyPincode,
            values: [pincode]
        }

        const result = await pg.executeQueryPromise(_query)
        return result
    }
    catch (error) {
        throw new Error(error.message)
    }
};

locations.getPincodeByDistrictId = async (districtId) => {
    try {

        const key = `PINCODES_BY_DISTRICT_ID|${districtId}`
        const cachedData = await redis.GetKeyRedis(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const _query = {
            text: QUERY.ADMIN.getPincodeByDistrictId,
            values: [districtId]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        if (queryResult && queryResult.length > 0)
            redis.SetRedis(key, queryResult, 60 * 60 * 24).then().catch(err => console.log(err));

        return queryResult;

    } catch (error) {
        throw error;
    }
}
module.exports = locations;