const express = require("express");
const fileUpload = require("express-fileupload");

const AWS = require("aws-sdk");
const fs = require('fs');
let _ = require('underscore');
const router = express.Router();
const { redis, STATUS, pg } = require("init-micro-common");
let locations = require('../services/locationsService');
let QUERY = require('../constants/QUERY');
router.use(fileUpload());;


// Set region
AWS.config.update({
    region: process.env.REGION_NAME
});

let s3 = new AWS.S3({});


//GET STATES
router.get("/states", async (req, res) => {
    try {
        let key = 'STATES';
        let redisResult = await redis.GetKeyRedis(key)
        if (redisResult && redisResult.length > 0) {
            let usersData = JSON.parse(redisResult);

            return res.status(STATUS.OK).send(usersData);
        } else {

            const _query = {
                text: QUERY.ADMIN.selectStateQuery
            };
            const result = await pg.executeQueryPromise(_query);
            redis.SetRedis(key, result, 60 * 60 * 24)
                .then()
                .catch(err => console.log(err));
            return res.status(STATUS.OK).send(result);
        }
    }
    catch (error) {
        console.log("error", error);
        return res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//GET district list
router.get("/districts/:stateId", async (req, res) => {
    try {
        const stateId = parseInt(req.params.stateId)

        let key = `DISTRICTS_BY STATE_ID|${stateId}`;
        let redisResult = await redis.GetKeyRedis(key)
        if (redisResult && redisResult.length > 0) {
            let usersData = JSON.parse(redisResult);

            return res.status(STATUS.OK).send(usersData);
        }
        const _query = {
            text: QUERY.ADMIN.selectDistrictQuery,
            values: [stateId]
        };
        const result = await pg.executeQueryPromise(_query)
        redis.SetRedis(key, result, 60 * 60 * 24)
            .then()
            .catch(err => console.log(err));
        return res.status(STATUS.OK).send(result);
    }
    catch (error) {
        return res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//GET block list
router.get("/blocks/:districtId", async (req, res) => {
    try {
        const districtId = parseInt(req.params.districtId);
        const _query = {
            text: QUERY.ADMIN.selectBlockQuery,
            values: [districtId]
        };
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result);
    }
    catch (error) {
        return res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//GET village list
router.get("/villages/:blockId", async (req, res) => {
    try {
        const blockId = parseInt(req.params.blockId)
        const _query = {
            text: QUERY.ADMIN.selectVillageQuery,
            values: [blockId]
        };
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result);
    }
    catch (error) {
        return res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//GET city list 
router.get("/city/:districtId", async (req, res) => {
    try {
        const districtId = parseInt(req.params.districtId)
        const _query = {
            text: QUERY.ADMIN.selectCityQuery,
            values: [districtId]
        };
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result)
    }
    catch (error) {
        return res.status(STATUS.BAD_REQUEST).send(error)
    }
});

/**
 * get all districts
 */
router.get("/allDistricts", async (req, res) => {
    try {
        let key = 'Districts';
        let redisResult = await redis.GetKeyRedis(key);
        if (redisResult && redisResult.length > 0) {
            let usersData = JSON.parse(redisResult);

            return res.status(STATUS.OK).send(usersData);
        } else {
            const _query = {
                text: QUERY.ADMIN.selectAllDistrictQuery,
            }
            const result = await pg.executeQueryPromise(_query)
            redis.SetRedis(key, result, 60 * 60 * 24)
                .then()
                .catch(err => console.log(err));
            return res.status(STATUS.OK).send(result);
        }
    }
    catch (error) {
        console.log("error is", error);
        res.status(STATUS.BAD_REQUEST).send(error)
    }
});


/**
 * get all City
 */
router.get("/allCity", async (req, res) => {
    try {
        const _query = {
            text: QUERY.ADMIN.selectAllCityQuery,
        }
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result)
    }
    catch (error) {
        console.log("error is", error);
        res.status(STATUS.BAD_REQUEST).send(error)
    }

});

//get location by pincode
router.get("/getLocalitybyPincode/:pincode", async (req, res) => {
    try {
        let pincode = req.params.pincode;
        let data = await locations.getLocalitybyPincode(pincode);
        res.status(STATUS.OK).send(data);
    } catch (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

//GET City By ID
router.get("/getCityById/:cityId", async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const result = await locations.getCityById(cityId)
        res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
    }
});

//GET District By ID
router.get("/getDistrictById/:districtId", async (req, res) => {
    try {
        const districtId = req.params.districtId
        const result = await locations.getDistrictById(districtId)
        res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
    }

});

//GET State By ID
router.get("/getStateById/:stateId", async (req, res) => {
    try {
        const stateId = req.params.stateId
        const result = await locations.getStateById(stateId)
        res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
    }
});

//get districct master
router.get("/getDistrictMaster", async (req, res) => {

    try {
        const _query = {
            text: QUERY.LOCATION.getDistrictMaster
        }
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error)
    }
});

//get city master
router.get("/getCityMaster", async (req, res) => {


    try {
        const _query = {
            text: QUERY.LOCATION.getCityMaster
        }
        const result = await pg.executeQueryPromise(_query)
        return res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error)
    }
});

router.post("/getLocationFacilitydataCount", async (req, res) => {

    let token = req.plainToken;
    let limit = req.body.limit;
    let state_id = req.body.state_id;
    let district_id = req.body.district_id;
    let block_id = req.body.block_id;
    let facility_id = req.body.facility_id;
    let page_size = req.body.page_size;
    let current_page = req.body.current_page;
    let search = req.body.search;

    locations.getLocationFacilitydataGridNew(token, limit, [state_id, district_id, block_id, facility_id, page_size, current_page, search], (err, data) => {
        if (err) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        } else {
            locations.getLocationFacilitydataGridNewCount(token, limit, [state_id, district_id, block_id, facility_id, search], (err1, data1) => {
                if (err1) {
                    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
                } else {
                    res.status(STATUS.OK).send({ data: data, count: data1 });
                }
            });
        }
    });
});

//GET COUNTRY
router.get("/countries", async (req, res) => {
    try {
        let key = 'Districts';
        let redisResult = await redis.GetKeyRedis(key);
        if (redisResult && redisResult.length > 0) {
            let usersData = JSON.parse(redisResult);

            return res.status(STATUS.OK).send(usersData);
        } else {
            const _query = {
                text: QUERY.LOCATION.selectCountryQuery
            };
            const result = await pg.executeQueryPromise(_query);
            redis.SetRedis(key, result, 60 * 60 * 24)
                .then()
                .catch(err => console.log(err));
            return res.status(STATUS.OK).send(result);
        }
    }
    catch (error) {
        return res.status(STATUS.BAD_REQUEST).send(error);
    }
});

//GET PINCODE By District ID
router.get("/getPincodes/:districtId", async (req, res) => {
    try {
        const districtId = req.params.districtId;
        const result = await locations.getPincodeByDistrictId(districtId)
        res.status(STATUS.OK).send(result)
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
    }

});

module.exports = router;

