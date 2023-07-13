const { pg, CONST, redis, JSONUTIL } = require("ticketing-system-micro-common");
const QUERY = require('../constants/QUERY');


const getProductList = async (reqParams) => {
  try {

    let key = `ProdList`;
    let whereClause = `WHERE 1=1`;
    let limitClause = ''
    let offsetClause = '';
    let data, count;
    let isCached = false;

    if (reqParams.block_id) {
      key += `|Block:${reqParams.block_id}`;
      whereClause += ` AND block_id=${reqParams.block_id}`;
    }

    if (reqParams.site_id) {
      key += `|Site:${reqParams.site_id}`;
      whereClause += ` AND site_id=${reqParams.site_id}`;
    }

    if (reqParams.vendor_id) {
      key += `|Vendor:${reqParams.vendor_id}`;
      whereClause += ` AND vendor_id=${reqParams.vendor_id}`;
    }

    if (reqParams.search_model) {
      key += `|SModel:${reqParams.search_model}`;
      whereClause += ` AND model_number ILIKE '%${reqParams.search_model}%'`;
    }

    if (reqParams.search_serial) {
      key += `|SSerial:${reqParams.search_serial}`;
      whereClause += ` AND serial_number::TEXT ILIKE '%${reqParams.search_serial}%'`;
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
    const isUserUpdated = await productAddUpdateCheck(whereClause);
    isCached = (cachedData) && (isUserUpdated == 0) ? true : false;


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

    const _query = JSONUTIL.replaceAll(QUERY.PRODUCT_QUERY.getProductList, replaceObj);

    console.log(_query);

    count = await getAllProductCount(whereClause);
    redis.SetRedis(`Count|${key}`, count, 10 * 60).then().catch(err => console.log(err));
    data = await pg.executeQueryPromise(_query);
    redis.SetRedis(key, data, 10 * 60).then().catch(err => console.log(err));

    return { data, count };

  } catch (error) {
    throw error;
  }
}

const productAddUpdateCheck = async (whereClause) => {

  try {

    whereClause += ` AND (date_created >= NOW() - INTERVAL '5 minutes' OR date_modified >= NOW() - INTERVAL '5 minutes')`;

    const _query = QUERY.PRODUCT_QUERY.getProductCount.replace('#WHERE_CLAUSE#', whereClause);
    console.log('Check Query');
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw error;
  }

}

const getAllProductCount = async (whereClause) => {
  try {

    const _query = QUERY.PRODUCT_QUERY.getProductCount.replace('#WHERE_CLAUSE#', whereClause);
    console.log('Check Query');
    console.log(_query);
    const queryResult = await pg.executeQueryPromise(_query);
    return parseInt(queryResult[0].count);

  } catch (error) {
    throw new Error(error.message);
  }
}

const getProduct = async (reqParams) => {
  try {

    let whereClause = `WHERE 1=1`;
    if (reqParams.product_id) whereClause += ` AND product_id=${reqParams.product_id}`;
    if (reqParams.serial_number) whereClause += ` AND serial_number='${reqParams.serial_number}'`;
    if (reqParams.model_number) whereClause += ` AND model_number='${reqParams.model_number}'`;

    const replaceObj = {
      '#WHERE_CLAUSE#': whereClause
    };
    const _query = JSONUTIL.replaceAll(QUERY.PRODUCT_QUERY.getProduct, replaceObj);

    console.log(_query);
    const data = await pg.executeQueryPromise(_query);
    return data;

  } catch (error) {
    throw error
  }
}

module.exports = {
  getProductList,
  getProduct
};
