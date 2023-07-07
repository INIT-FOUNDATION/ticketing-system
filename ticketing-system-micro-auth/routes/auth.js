const express = require('express');
const router = express.Router();
const { STATUS, CONST, redis, generateToken, passwordPolicy, logger, SECRET_KEY, SMS } = require("ticketing-system-micro-common");
const ERRORCODE = require('../constants/ERRORCODE.js');
const User = require("../services/authService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    v4: uuidv4
} = require('uuid');
const authModel = require('../models/authModel');
const confModel = require('../models/confModel');
const defaultPassword = CONST.SERVICES.default_pass;

router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("Auth Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get('/validateToken', async (req, res) => {
    const token = req.header("authorization");
    try {
        jwt.verify(token, SECRET_KEY.SECRET_KEY);
        res.status(STATUS.OK).send({
            message: "Success"
        });
    } catch (ex) {
        res.status(STATUS.UNAUTHORIZED).send({
            message: "Unauthenticated access!"
        });
    }
});

router.post('/login', async (req, res) => {

    try {

        const {
            error
        } = authModel.validateLoginDetails(req.body);
        logger.error("ERROR", error);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        const userResponse = await User.selectUser(req.body.user_name);
        if (!userResponse[0]) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);
        }

        const userId = userResponse[0].user_id;
        const userRoleModuleData = await User.getRoleModuleList(userResponse[0].role_id)
        const userData = userResponse[0];
        const type = 1;

        console.log('userRoleModuleData', userRoleModuleData);

        req.body.password = CONST.decryptPayload(req.body.password);
        if (req.body.password == defaultPassword) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0007", "error":"${ERRORCODE.ERROR.USRAUT0007}", "userId": "${userId}"}`);
        }
        const validPassword = await bcrypt.compare(req.body.password, userData.password);
        const policy = await passwordPolicy.validate_password(userId, req.body.password, type);

        console.log('userResponse');

        if (validPassword && policy.status == true) {
            // const getConfig = await generateToken.getApplicationConfig();

            // if (!getConfig) {
            //     if (userId == 1) {
            //         return res.status(STATUS.BAD_REQUEST).send({
            //             "errorCode": "CONFIG0001",
            //             "error": ERRORCODE.ERROR.CONFIG0001,
            //             "user_name": CONST.encryptPayload(req.body.user_name)
            //         });
            //     } else {
            //         return res.status(STATUS.BAD_REQUEST).send({
            //             "errorCode": "CONFIG0004",
            //             "error": ERRORCODE.ERROR.CONFIG0004
            //         });
            //     }
            // }
            const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, req)
            res.status(STATUS.OK).send(token.encoded);
            return;
        }

        console.log('you are here');

        const invalidAttemptsData = await User.getInvalidLoginAttempts(req.body.user_name);
        const invalidAttempts = invalidAttemptsData.invalid_attempts;
        const maxInvalidAttemptsData = await User.getMaxInvalidLoginAttempts();
        const maxInvalidAttempts = maxInvalidAttemptsData.max_invalid_attempts;

        if (maxInvalidAttempts > invalidAttempts) {
            await User.incrementInvalidLoginAttempts(req.body.user_name);
        } else {
            await User.setUserInactive(req.body.user_name);
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0005", "error":"${ERRORCODE.ERROR.USRAUT0005}"}`);
        }

        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);

    } catch (e) {
        logger.error(e)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.ERROR.USRAUT0001}"}`);
    }
});

router.post('/postLoginUserUpdate', async (req, res) => {
    try {
        await User.updateUserLoggedInOut(1, req.body.user_name);
        res.status(STATUS.OK).send('User login details successfully updated!');
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
    }
});

router.post('/logout', async (req, res) => {
    try {
        await User.updateUserLoggedInOut(0, req.plainToken.user_name);
        redis.del(req.plainToken.user_name);
        redis.del(`USER_PERMISSIONS_${req.plainToken.user_name}`);
        redis.del(`LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`);
        redis.del(`User|Username:${req.plainToken.user_name}`);
        res.status(STATUS.OK).send(`Username | ${req.plainToken.user_name} | Successfully Logged Out!!`);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
    }
});

router.post('/setConfig', async (req, res) => {
    try {

        const getConfig = await generateToken.getApplicationConfig();
        if (getConfig) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CONFIG0002", "error":"${ERRORCODE.ERROR.CONFIG0002}"}`);
        }
        const { error } = confModel.validateConf(req.body);

        if (error) {
            if (error.details)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        let user_name = JSON.parse(CONST.decryptPayload(req.body.user_name));

        const userResponse = await User.selectUser(user_name);
        if (!userResponse[0]) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"CONFIG0003", "error":"${ERRORCODE.ERROR.CONFIG0003}"}`);
        }

        await User.setApplicationConfig(req.body);

        // Token Creation
        const userRoleModuleData = await User.getRoleModuleList(userResponse[0].role_id)
        const userData = userResponse[0];

        const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, req)
        res.status(STATUS.OK).send(token.encoded);
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send('Something went wrong!');
    }
});

router.post('/generateOTP', async (req, res) => {
    const mobileNumber = req.body.mobile;

    if (!mobileNumber || mobileNumber.toString().length != 10) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0010", "error":"${ERRORCODE.ERROR.USRAUT0010}"}`);
    }

    try {

        const key = `Reg_Mob_${mobileNumber}`
        const redisResult = await redis.GetKeys(key);

        if (redisResult && redisResult.length > 0) {
            const result = await redis.GetRedis(redisResult);
            const otpRes = JSON.parse(result);
            return res.status(STATUS.OK).send({ txnId: otpRes.txnId, otp: otpRes.otp })
        }

        const new_txn_id = uuidv4();
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpData = {
            mobile_no: mobileNumber,
            otp: otp,
            reason: CONST.OTPREASONS.VERIFYMOBNO,
            is_active: 1,
            date_created: new Date(),
            date_modified: new Date()
        };

        const userData = mobileNumber;
        userData.otp = otpData.otp;
        userData.txnId = new_txn_id;

        User.setUserInRedisByTxnId(userData);

        User.setUserInRedisForReg(mobileNumber, userData, function (err, result) {
            console.log(err);
            if (err) {
                return res.status(STATUS.BAD_REQUEST).send("OTP Already Sent");
            } else {
                console.log("result", result);
                res.status(STATUS.OK).send({ "txnId": new_txn_id, "otp": otp });
            }
        });

    } catch (error) {
        console.log("error", error);
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0018", "error":"${ERRORCODE.ERROR.USRAUT0018}"}`);
    }
});

router.post('/validateOTP', async (req, res) => {
    const otp = req.body.otp;
    const txnId = req.body.txnId;

    if (!otp) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.ERROR.USRAUT0012}"}`);
    }

    if (!txnId) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0013", "error":"${ERRORCODE.ERROR.USRAUT0013}"}`);
    }

    try {

        const key = `User|txnId:${txnId}`;
        const redisResult = await redis.GetKeys(key);

        if (!redisResult || redisResult.length == 0) {
            return res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
        }

        const result = await redis.GetRedis(redisResult);
        const UserData = JSON.parse(result);
        const mobileKey = `Reg_Mob_${UserData.ben_mobile_number}`

        if (UserData.otp != otp) {
            return res.status(STATUS.BAD_REQUEST).send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
        } else {
            let userObj = {};

            if (UserData._id) {
                userObj = {
                    user_name: UserData._id,
                    user_id: UserData._id,
                    mobile_number: UserData.mobile_number,
                    txnId: txnId,
                    isNewAccount: "N"
                }

            } else {
                userObj = {
                    user_name: "Login|" + UserData.mobile_number,
                    mobile_number: UserData.mobile_number,
                    txnId: txnId,
                    source: source,
                    isNewAccount: "Y"
                }
            }

            const tokenData = await generateToken.generateTokenWithRefId(userObj, req)

            redis.del(key);
            redis.del(mobileKey);

            return res.status(STATUS.OK).send({ token: tokenData.encoded, isNewAccount: userObj.isNewAccount });
        }
    } catch (error) {
        logger.error(error)
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.ERROR.USRAUT0019}"}`);
    }
});

router.post('/getOtp', async (req, res) => {

    try {
        let mobile_number = req.body.mobile_number;
        if (mobile_number == undefined || mobile_number == null) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0010", "error":"${ERRORCODE.ERROR.USRAUT0010}"}`);
        }

        let key = `Admin_User|User:${mobile_number}`;
        let redisResult = await redis.GetRedis(key);

        if (redisResult[0]) {
            var userData = JSON.parse(redisResult);
            return res.status(STATUS.BAD_REQUEST).send({
                "errorCode": "USRAUT0011",
                "error": "OTP Already Sent!",
                "txnId": userData.txnId
            });
        } else {
            const userres = await User.selectUser(mobile_number);
            if (!userres[0]) {
                res.status(STATUS.OK).send({
                    "txnId": uuidv4()
                });
            } else {
                let new_txn_id = uuidv4();
                let otp = Math.floor(100000 + Math.random() * 900000);
                var otpData = {
                    mobile_no: mobile_number,
                    otp: otp,
                    reason: CONST.OTPREASONS.VERIFYMOBNO,
                    is_active: 1,
                    date_created: new Date(),
                    date_modified: new Date()
                };

                let userdata = {}
                userdata.user_name = userres[0].user_name;
                userdata.txnId = new_txn_id;
                userdata.otp = otpData.otp;

                User.setUserInRedis(userdata);

                let phone_no = `91${otpData.mobile_no}`;
                let time = CONST.SMS_TEMPLATES.otpLogin.time;
                let message = CONST.SMS_TEMPLATES.otpLogin.body.replace('<otp>', otp).replace('<time>', time);
                SMS.sendSMS(phone_no, message);
                res.status(STATUS.OK).send({
                    "txnId": new_txn_id
                });

            }
        }
    } catch (err) {

        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }

});


router.post('/verifyOtp', async (req, res) => {

    let otp = CONST.decryptPayload(req.body.otp);
    let txnId = req.body.txnId;

    if (otp == undefined || otp == null) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.ERROR.USRAUT0012}"}`);
    }

    if (txnId == undefined || txnId == null || txnId == '') {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0013", "error":"${ERRORCODE.ERROR.USRAUT0013}"}`);
    }

    try {
        let key = `Admin_User|txnId:${txnId}`;
        let redisResult = await redis.GetKeys(key);

        if (redisResult && redisResult.length > 0) {
            const result = await redis.GetRedis(redisResult);
            let UserData = JSON.parse(result[0]);
            if (UserData.otp != parseInt(otp)) {
                return res
                    .status(STATUS.BAD_REQUEST)
                    .send(
                        `{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`
                    );
            } else {
                let user_name = UserData.user_name;
                const checkUser = await User.checkUser(user_name);
                if (checkUser[0]) {
                    let user_data = checkUser[0];
                    var role_id = user_data.role_id;
                    const roleModuleResult = await User.getRoleModuleList(role_id)
                    const token = await generateToken.generate(UserData.user_name, user_data, roleModuleResult, req)
                    let mobile_key = `Admin_User|User:${UserData.user_name}`;
                    await redis.delRedis(mobile_key);
                    await redis.delRedis(key);
                    return res.status(STATUS.OK).send(token.encoded);
                } else {
                    return res.status(STATUS.BAD_REQUEST)
                        .send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
                }
            }
        } else {
            return res.status(STATUS.BAD_REQUEST)
                .send(`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.ERROR.USRAUT0014}" }`);
        }
    } catch (error) {
        console.log(error);
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0019", "error":"${ERRORCODE.ERROR.USRAUT0019}"}`);
    }
});

module.exports = router;