const ENCODE = require('../auth/jwt.encoder');
const redis = require("../config/redis");
const pg = require("../config/pg");
const crypto = require('crypto');

const generateTokenPatient = async (patientData, req) => {

    if (!patientData) throw new Error('No Username');

    const tokenData = {
        patient_name: patientData.patient_name,
        gender_id: patientData.gender_id,
        gender_name: patientData.gender_name,
        mobile_number: patientData.mobile_number,
        email_id: patientData.email_id,
        patient_ref_id: patientData.patient_ref_id,
        patient_id: patientData.patient_id,
        ua: req.headers["user-agent"],
        date_modified: new Date(),
        isPatAppToken: true
    };

    const token = ENCODE.encodeGuestToken(tokenData);
    const build = {
        encoded: token,
        plain: tokenData
    };

    const tokenCacheKey = `PAT_TOKEN|${patientData.mobile_number}`
    await redis.SetRedis(tokenCacheKey, token, 60 * 60 * 24 * 8).catch(err => { })
    return build;
};

const generate = async (userName, userData, roleDetails, req) => {

    if (!userName) {
        throw new Error('UserName is Missing!')
    }

   // const _appConf = await getApplicationConfig();

    const userArray = {
        user_id: userData.user_id,
        user_name: userData.user_name,
        display_name: userData.display_name,
        email_id: userData.email_id,
        role: userData.role_id,
        user_role_description: roleDetails.role_description,
        roleModifiedDate: roleDetails.date_modified,
        role_name: roleDetails.role_name,
        user_level: roleDetails.level,
        ua: req.headers["user-agent"],
        date_modified: new Date()
    };

    const token = ENCODE.encodeToken30Days(userArray);
    const build = {
        encoded: token,
        plain: userArray
    };

    redis.SetRedis(userData.user_name, token, 60 * 60 * 24 * 8).catch(err => { console.error(err) })
    return build;
};

const generateTokenWithRefId = async (userdata, req) => {

    if (!userdata) {
        throw new Error('No Username')
    }

    const userArray = {
        full_name: userdata.full_name,
        _id: userdata._id,
        mobile_number: userdata.mobile_number,
        secret_key: userdata.secret_key,
        source: userdata.source,
        txnId: userdata.txnId,
        user_name: userdata.user_name,
        ua: req.headers["user-agent"],
        date_modified: new Date(),
    };

    const token = ENCODE.encodeGuestToken(userArray);
    const build = {
        encoded: token,
        plain: userArray
    };

    await redis.SetRedis(userdata.user_name, token, 60 * 60 * 8).catch(err => { })
    return build;
};

const generateGuestToken = (guestData, done) => {
    const guestArray = {
        user_name: guestData.username,
        ipaddress: guestData.ipaddress,
        ua: guestData.ua,
        date_modified: new Date()
    };

    const token = ENCODE.encodeGuestToken(guestArray);
    const build = {};
    build.encoded = token;
    build.plain = guestArray;
    var hashKey = crypto.createHash('md5').update(token).digest('hex');

    redis.SetRedis(hashKey, token, process.env.INIT_REDIS_SHORT_TTL)
        .then()
        .catch(err => { })
    return done(null, build);
};

const generateDashboardGuestToken = (guestData, done) => {
    const guestArray = {
        user_name: guestData.username,
        ipaddress: guestData.ipaddress,
        ua: guestData.ua,
        date_modified: new Date()
    };


    const token = ENCODE.encodeDashboardGuestToken(guestArray);
    const build = {};
    build.encoded = token;
    build.plain = guestArray;
    return done(null, build);
};

const generateTokenWithUserData = (userdata, done) => {
    if (userdata) {
        const token = ENCODE.encodeGuestToken(userdata);
        const build = {};
        build.encoded = token;
        build.plain = userdata;
        return done(null, build);
    } else return done('No Username');
};

const getApplicationConfig = async () => {

    let key = `APPCONFIG`;
    let result = await redis.GetKeyRedis(key);

    if (result) {
        return JSON.parse(result);
    }

    const _query = {
        text: `SELECT value from m_config where key = $1`,
        values: [key]
    };

    const queryResult = await pg.executeQueryPromise(_query);
    if (queryResult && queryResult.length > 0) {
        redis.SetRedis(key, queryResult[0].value).then().catch(err => console.log(err));
        return queryResult[0].value;
    } else {
        return false;
    }
};

module.exports = {
    generate,
    generateTokenPatient,
    generateGuestToken,
    generateTokenWithRefId,
    generateDashboardGuestToken,
    generateTokenWithUserData,
    getApplicationConfig
};
