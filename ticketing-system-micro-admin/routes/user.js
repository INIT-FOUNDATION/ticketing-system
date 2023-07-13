const express = require("express");
const router = express.Router();
const ERRORCODE = require('../constants/ERRORCODE');

const {
    STATUS,
    logger,
    CONST,
    s3Util,
    JSONUTIL,
    redis,
    getModulesbyLocation
} = require("ticketing-system-micro-common");
const AWS = require("aws-sdk");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const userService = require('../services/userService');
const users = require('../models/users');
let _ = require('underscore');
let bcrypt = require('bcryptjs');
const moment = require('moment');
let SMS = require('../utility/SMS');
const dateformat = require("dateformat");
const RandExp = require('randexp');
let async = require('async');
const PAGESIZE = require('../constants/CONST');
const userListService = require('../services/userListService');
// Set region
AWS.config.update({
    region: process.env.REGION_NAME
});

let s3 = new AWS.S3({});

router.use(fileUpload());

router.use(
    bodyParser.json({
        limit: "5mb"
    })
);

router.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "5mb"
    })
);


//INSERT USERS
router.post("/createUser", async (req, res) => {

    try {

        let reqUser = req.plainToken;
        let userId = reqUser.user_id;
        let newUser = new users(req.body);
        const { error } = users.validate(newUser);

        if (error) {
            if (
                error.details != null &&
                error.details != "" &&
                error.details != "undefined"
            )
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        if (!newUser.mobile_number.toString().match(/^[0-9]{10}$/)) {
            return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.ERROR.ADMROL0014);
        }

        newUser.role_id = parseInt(newUser.role_id);
        newUser.display_name = JSONUTIL.capitalize(newUser.display_name.trim());

        let str = '';
        const alpha = /[A-Z][a-z]/;
        const numeric = /[0-9]/;
        const special = /[!@#$&*]/;
        const pwdComplexityData = await userService.getPasswordComplexity();
        const pwdComplexity = pwdComplexityData[0]
        const length = pwdComplexity.min_password_length;

        str += (pwdComplexity.complexity && pwdComplexity.alphabetical) ? alpha.source : '';
        str += numeric.source;

        if (pwdComplexity.complexity && pwdComplexity.numeric) {
            str += numeric.source;
        }

        if (pwdComplexity.complexity && pwdComplexity.special_chars) {
            str += special.source;
        }

        let pattern = "";

        if (str) {
            str += `{${length}}`;
            pattern = str;
        } else {
            pattern = '[1-9]{' + length + '}';
        }

        const testRegex = new RegExp(pattern);
        const randExp = new RandExp(testRegex).gen();
        const validateRole = await userService.checkIfRoleIsValid(newUser.role_id);

        if (validateRole <= 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0012", "error":"${ERRORCODE.ERROR.ADMROL0012}"}`);
        }

        const userCount = await userService.checkIfExist(newUser.mobile_number);

        if (userCount > 0) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0005", "error":"${ERRORCODE.ERROR.ADMROL0005}"}`);
        }

        newUser.password = randExp;
        logger.debug(`PASSWORD FOR  ${newUser.display_name}  :  ${newUser.password}`);

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        newUser.rand_password = randExp;
        newUser.user_name = newUser.mobile_number;
        newUser.account_locked = 0;
        newUser.country_id = 1;
        newUser.created_by = userId;

        try {

            const userData = await userService.createUsers(newUser);
            newUser.user_id = userData[0].user_id;

            if (newUser.user_module_json && newUser.user_module_json.length > 0) {
                async.forEachOfSeries(newUser.user_module_json, async function (per, cb2) {
                    let access = {
                        "user_id": newUser.user_id,
                        "menu_id": per.menu_id,
                        "per_id": per.per_id,
                        "created_by": newUser.created_by
                    }
                    await userService.addPermissions(access);

                }, async function () {
                });
            }
            res.status(STATUS.CREATED).json(userData);

        } catch (err) {
            console.log(err);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        }

    } catch (e) {
        console.log(e);
        return res.status(STATUS.BAD_REQUEST).send(e);
    }

});

// To Edit the user data
router.post("/editUser", async (req, res) => {
    let userData = new users.EditUser(req.body);

    console.log(userData);
    let reqUser = req.plainToken;
    let reuserId = reqUser.user_id;
    userData.user_id = parseInt(CONST.decryptPayload(userData.user_id));
    const { error } = users.validateEditUsers(userData);

    if (error) {
        if (
            error.details != null &&
            error.details != "" &&
            error.details != "undefined"
        )
            return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
        else return res.status(STATUS.BAD_REQUEST).send(error.message);
    } else {


        let userId = userData.user_id;
        userService.checkRoleStatus(userId, (err, isRoleInActive) => {
            if (err) return res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
            if (isRoleInActive)
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0006", "error":"${ERRORCODE.ERROR.ADMROL0006}"}`);
            else {
                userData.updated_by = reuserId;
                userService.updateUser(userData, userId, async (err, results) => {
                    if (err) {
                        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                        return;
                    }
                    if (userData.reporting_to) {
                        await userService.updateUserMapping(userData);
                    }
                    if (req.body.user_module_access) {
                        await userService.deletePermissions(userData);
                        if (req.body.user_module_json) {
                            async.forEachOfSeries(req.body.user_module_json, async function (per, cb2) {
                                let access = {
                                    "user_id": userData.user_id,
                                    "menu_id": per.menu_id,
                                    "per_id": per.per_id,
                                    "created_by": reuserId
                                }
                                await userService.addPermissions(access);

                            }, async function () {
                            });
                        }
                    }
                    res.status(STATUS.OK).send({
                        error: false,
                        data: results,
                        message: "User has been updated successfully."
                    });
                });
            }
        });
    }

});


// To change User status
router.post("/updateUserStatus", async (req, res) => {
    let userId = req.body.user_id;
    let isActive = req.body.isActive;

    userId = parseInt(CONST.decryptPayload(userId))

    if (userId) {

        if (
            isActive != null &&
            isActive != "" &&
            isActive != "undefined"
        ) {
            userService.checkRoleStatus(userId, (err, isRoleInActive) => {
                if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                if (isRoleInActive) {
                    res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0003", "error":"${ERRORCODE.ERROR.ADMROL0003}"}`);
                } else {
                    userService.updateUserStatus(isActive, userId, (err, results) => {
                        if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                        res.status(STATUS.OK).send({
                            error: false,
                            data: results,
                            message: "User Status has been changed successfully."
                        });
                    });
                }
            });
        } else {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0004", "error":"${ERRORCODE.ERROR.ADMROL0004}"}`);
        }
    } else {
        res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ADMROL0011", "error":"${ERRORCODE.ERROR.ADMROL0011}"}`);
    }
});



// @route    GET api/v2/admin/users/password_policy
// @desc     Get latest password policy
// @access   Private / Admin role only  
router.get('/password_policy', async (req, res) => {
    try {
        let complexity = await userService.getPasswordComplexity();

        res.status(STATUS.OK).send({
            error: false,
            data: complexity

        });
    } catch (e) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

// @route    POST api/v2/admin/users/password_policy
// @desc     Creates a new password policy
// @access   Private / Admin role only
router.post('/password_policy', async (req, res) => {
    try {
        var policy = new users.createPasswordPolicySchema(req.body);
        let data = await userService.createPasswordComplexity(policy);
        res.status(STATUS.OK).send({
            error: false,
            data: data.insertId,
            message: "Password complexity set successfully."
        });
    } catch (e) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(e);
    }
});

// @route    POST api/v2/admin/users/validate_password/:id/:password
// @desc     Validates user password based on password policy
// @access   Private / Admin role only



// @route    PUT api/v2/admin/users/password_policy/:id
// @desc     Update Password Policy based on ID
// @access   Private / Admin role only

router.post("/password_policy/:id", async (req, res) => {
    const policyId = req.params.id;
    const policy = new users.UpdatePasswordPolicySchema(req.body);

    const { error } = users.validatePasswordPolicy(policy);
    if (error) {

        if (
            error.details != null &&
            error.details != "" &&
            error.details != "undefined"
        ) {
            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"PASSPOL002", "error": "${ERRORCODE.ERROR.PASSPOL002}", "body": ${error.message}}`);
        } else return res.status(STATUS.BAD_REQUEST).send(error.message);
    } else {
        let results = userService.UpdatePasswordPolicy(policy, policyId);
        res.status(STATUS.OK).send({
            error: false,
            data: results,
            message: "Policy has been updated successfully."
        });
    }
});



router.post("/resetPasswordByAdmin", async (req, res) => {
    const userId = req.body.userId;
    const defaultPassword = CONST.SERVICES.default_pass;
    let passwordType = req.body.passwordType;
    let mobileNumber = '';
    let displayName = '';
    let password = '';
    const userData = req.plainToken;

    try {
        const userMobileObj = await userService.getUserMobile(userId);
        if (userMobileObj.length > 0) {
            mobileNumber = userMobileObj[0].mobile_number;
            displayName = userMobileObj[0].display_name;

            var str = '';
            let alpha = /[A-Z][a-z]/;
            let numeric = /[0-9]/;
            let special = /[!@#$&*]/;
            let pwdComplexityData = await userService.getPasswordComplexity();
            let pwdComplexity = pwdComplexityData[0]
            let length = pwdComplexity.min_password_length;
            if (pwdComplexity.complexity && pwdComplexity.alphabetical) {
                str += alpha.source;
            }
            if (pwdComplexity.complexity && pwdComplexity.numeric) {
                str += numeric.source;
            }
            if (pwdComplexity.complexity && pwdComplexity.special_chars) {
                str += special.source;
            }

            let pattern = "";

            if (str) {
                str += '{'
                str += `${length}`
                str += '}'
                pattern = str;
            } else {
                pattern = '[1-9]{' + length + '}';

            }

            const testRegex = new RegExp(pattern);

            const randexp = new RandExp(testRegex).gen();

            password = (passwordType == "default") ? defaultPassword : randexp;

            logger.debug(`OTP PASSWORD FOR  ${displayName}  :  ${password}`);

            let mobileNo = mobileNumber;

            // let resetUser_sms = await users.getConfigValues(CONST.SERVICES.resetUser_sms);

            // let bodySub = `${resetUser_sms[0].value} ${password}`;

            let passwdNew = password;
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            let changePassword = await userService.updateUserPasswordbyAdmin(mobileNo, password, userId);

            if (changePassword) {
                if (passwordType == "default") {
                    res.status(STATUS.OK).send({
                        error: false,
                        message: "Password reset successfully."
                    });
                } else {
                    let obj = userMobileObj[0];
                    obj.password = passwdNew;
                    await userService.shareUserDetails(obj);
                    res.status(STATUS.OK).send({
                        error: false,
                        message: "Password reset successfully."
                    });
                }
            }
        } else {
            res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRRES0002", "error":"${ERRORCODE.ERROR.USRRES0002}"}`);
        }
    } catch (err) {
        console.log(err)
        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    }
});

router.post("/uploadProfilePic", async (req, res) => {
    let userId = CONST.decryptPayload(req.body.userId);
    let newfileName = dateformat(new Date(), "ddmmyyyyHHMMss");
    let key = `LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0007", "error":"${ERRORCODE.ERROR.ADMROL0007}"}`
            );
    }

    let file_name = req.files.file.name;

    if (file_name && file_name.split(".").length > 2) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0010", "error":"${ERRORCODE.ERROR.ADMROL0010}"}`
            );
    }
    let fileExt = file_name.split(".");
    let ext = fileExt[fileExt.length - 1];
    let allowedExt = ["png", "jpeg"]
    file_name = newfileName + "." + ext;
    var fileData = {
        file_name: file_name,
        orig_file_name: file_name,
        content_type: req.files.file.mimetype
    };

    allowedFiles = ["image/png", "image/jpeg"];

    if (!allowedFiles.includes(fileData.content_type) || !allowedExt.includes(ext.toLowerCase())) {
        return res
            .status(STATUS.BAD_REQUEST)
            .send(
                `{"errorCode":"ADMROL0008", "error":"${ERRORCODE.ERROR.ADMROL0008}"}`
            );
    }

    const params = {
        Bucket: process.env.TS_S3_BUCKET,
        Key: `profile-pictures/${fileData.file_name}`,
        Body: req.files.file.data
    };

    console.log(params);
    s3.upload(params, async function (error, data) {
        if (error) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(error);
        } else {
            await userService.updateProfilePic(data.Location, userId, function (err, result) {
                if (err) {
                    res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                } else {
                    redis.del(key);
                    res.status(STATUS.OK).send({ message: "Image uploaded successfully" });
                }
            });
        }
    });
});

router.post("/download/profilePic", async (req, res) => {
    let userId = CONST.decryptPayload(req.body.userId);
    await userService.getProfilePic(userId, function (err, file_name) {
        if (err) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        } else {
            if (file_name) {
                let options = {
                    Bucket: process.env.TS_S3_BUCKET,
                    Key: `profile-pictures/${file_name}`
                };

                let fileExt = file_name.split(".");
                let ext = fileExt[fileExt.length - 1];
                try {
                    res.setHeader("Content-Type", "image/" + ext);
                    res.setHeader("Content-disposition", "filename=" + file_name);
                    s3.getObject(options)
                        .createReadStream()
                        .on("error", function (err) {
                            res.status(500).json({ error: "Error -> " + err });
                        })
                        .pipe(res);
                } catch (ex) {
                    res.status(STATUS.INTERNAL_SERVER_ERROR).send(ex);
                }
            } else {
                res.status(STATUS.OK).send("No Profile Picture Found ")
            }
        }
    });
});


// total count user data for grid
router.post("/getUserdataGridCount", async (req, res) => {
    let token = req.plainToken;
    let page_size = req.body.page_size ? req.body.page_size : PAGESIZE.pagesize.PAGE_SIZE;
    let current_page = req.body.current_page ? req.body.current_page : 0;
    let search = req.body.search;

    console.log(req.initPayload);
    if (current_page != 0 && current_page != 1) {
        current_page = ((current_page - 1) * page_size)
    } else {
        current_page = 0
    }

    try {

        let data = await userService.getUserdataGridNew(token, [page_size, current_page, search, req.initPayload.role_access], req.body);
        data = await addCDNImages(data);
        let count = await userService.getUserdataGridCount(token, [search, req.initPayload.role_access], req.body);
        res.status(STATUS.OK).send({ data: data, count: parseInt(count) });

    } catch (error) {
        console.log("catch error", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});


const addCDNImages = async (result) => {
    return new Promise((resolve, reject) => {
        async.forEachOfSeries(result, async function (user, cb) {
            let aws_s3_prefix_url = `https://${process.env.TS_S3_BUCKET}.s3.ap-south-1.amazonaws.com/`;
            if (user.profile_picture_url) {
                let logo_path = user.profile_picture_url.replace(aws_s3_prefix_url, '');
                user.profile_pic = `${process.env.CDN_CONTEXT_PATH}/api/v1/cdn/file?file_name=${logo_path}`;
            }
        }, async function () {
            resolve(result);
        });
    })
}

router.get("/user/:user_id", async (req, res) => {
    let user_id = req.params.user_id;

    if (user_id) {
        try {
            user_id = parseInt(user_id);
        } catch (error) {
            user_id = null;
        }
    }

    if (user_id) {
        let userData = await userService.getUserById(user_id);
        let aws_s3_prefix_url = `https://${process.env.TS_S3_BUCKET}.s3.ap-south-1.amazonaws.com/`;
        if (userData.profile_picture_url) {
            let profile_pic_cdn = userData.profile_picture_url.replace(aws_s3_prefix_url, '');
            userData.profile_pic_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/file?file_name=${profile_pic_cdn}`;
        }

        res.status(STATUS.OK).send(userData)
    } else {
        res.status(STATUS.BAD_REQUEST).send({ "errorCode": "ADMROL0011", "error": ERRORCODE.ERROR.ADMROL0011 })
    }
});

router.get("/getUserAccessList/:user_id", async (req, res) => {
    try {

        let user_id = req.params.user_id;
        let data = await userService.getUserAccessList(user_id);
        res.status(STATUS.OK).send(data);
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});


router.post("/getAllUsersByHospital", async (req, res) => {
    try {

        let user_id = req.body.user_id;
        let hosp_id = req.body.hosp_id;
        let usersList = null;
        if (hosp_id) {
            usersList = await userService.getAllUsersByHospital(hosp_id, user_id);
        }
        res.status(STATUS.OK).send(usersList);
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get("/getUserHierarchy/:user_id", async (req, res) => {
    try {

        let user_id = req.params.user_id;
        let userHierarchy = null;
        if (user_id) {
            userHierarchy = await userService.getUserHierarchy(user_id);
        }
        res.status(STATUS.OK).send({ hierarchy: userHierarchy });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.get("/getUserFullHierarchy/:user_id", async (req, res) => {
    try {

        let user_id = req.params.user_id;
        let userHierarchy = null;
        let selectedNode = null;
        if (user_id) {
            userHierarchy = await userService.getUserFullHierarchy(user_id);
            selectedNode = await userService.getSelectedNode(user_id);
            delete selectedNode.reporting_to;
        }
        res.status(STATUS.OK).send({ hierarchy: userHierarchy, selected_node: selectedNode });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});



router.post('/getUserList', async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        let pageSize = req.body.pageSize ? req.body.pageSize : 50;
        pageSize = pageSize > 50 ? 50 : pageSize;
        let currentPage = req.body.currentPage ? req.body.currentPage : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);
        const search = req.body.search ? req.body.search : null;
        const role_id = req.body.role_id ? req.body.role_id : null;
        const user_role = reqUserDetails.role ? reqUserDetails.role : null

        const reqParams = {
            pageSize,
            currentPage,
            search,
            role_id,
            user_role
        };

        const userData = await userListService.getUserList(reqParams)

        res.send(userData)

    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"COMMON0000", "error":"${ERRORCODE.ERROR.COMMON0000}"}`);
    }
})

module.exports = router;
