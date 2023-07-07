const { pg, CONST, redis, JSONUTIL } = require("ticketing-system-micro-common");
const QUERY = require('../constants/QUERY');


const getUserList = async (reqParams) => {
  try {

    let key = `UserList_${reqParams.user_role}`;
    let whereClause = ` WHERE U.role_id NOT IN (${reqParams.user_role}, 1)`;
    let limitClause = ''
    let offsetClause = '';
    let data, count;
    let isCached = false;

    if (reqParams.role_id) {
      key += `|Role:${reqParams.role_id}`;
      whereClause += ` AND U.role_id=${reqParams.role_id}`;
    }

    if (reqParams.search) {
      if (isNaN(reqParams.search)) {
        whereClause += ` AND U.display_name ILIKE '%${reqParams.search}%'`;
      } else {
        whereClause += ` AND U.mobile_number=${reqParams.search}`;
      }

      key += `|Search:${reqParams.search}`;
    }

    if (reqParams.pageSize) {
      key += `|Size:${reqParams.pageSize}`;
      limitClause = ` LIMIT ${reqParams.pageSize}`;
    }

    if (reqParams.currentPage) {
      key += `|Offset:${reqParams.currentPage}`;
      offsetClause += ` OFFSET ${reqParams.currentPage}`;
    }

    console.log(key);

    const cachedData = await redis.GetKeyRedis(key);
    const isUserUpdated = await userAddUpdateCheck(whereClause);
    isCached = (cachedData) && (isUserUpdated == 0) ? true : false;

    whereClause += ` AND U.is_deleted != 1`;

    if (isCached) {
      data = JSON.parse(cachedData);
      const cachedCount = await redis.GetKeyRedis(`Count|${key}`);
      count = parseInt(JSON.parse(cachedCount));
      return { data, count };
    }

    const replaceObj = {
      '#WHERE_CLAUSE#': whereClause,
      '#LIMIT_CLAUSE#': limitClause,
      '#OFFSET_CLAUSE#': offsetClause
    };

    const _query = JSONUTIL.replaceAll(QUERY.USER_QUERY.getAllUsers, replaceObj);

    console.log(_query);

    count = await getAllUserCount(whereClause);
    redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
    data = await pg.executeQueryPromise(_query);
    redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));

    return { data, count };

  } catch (error) {
    throw error;
  }
}

const userAddUpdateCheck = async (whereClause) => {

  try {

    whereClause += ` AND (U.date_created >= NOW() - INTERVAL '5 minutes' OR U.date_modified >= NOW() - INTERVAL '5 minutes')`;

    const _query = QUERY.USER_QUERY.getUserCount.replace('#WHERE_CLAUSE#', whereClause);
    console.log('Check Query');
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw error;
  }

}

const getAllUserCount = async (whereClause) => {
  try {

    const _query = QUERY.USER_QUERY.getUserCount.replace('#WHERE_CLAUSE#', whereClause);
    console.log('Check Query');
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getUserList
};
