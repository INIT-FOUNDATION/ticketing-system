const { db, pg, redis, logger, CONST, SMS, whatsAppUtil, STATUS } = require("ticketing-system-micro-common");
let ERRORCODE = require('../constants/ERRORCODE');
let QUERY = require('../constants/QUERY');
const email = require("../utility/mail");
const AWS = require("aws-sdk");
const async = require("async");
let util = require('util');
let _ = require('underscore');
let config = require('../constants/CONST');
const ejs = require('ejs');

AWS.config.update({
    region: process.env.REGION_NAME
});

let s3 = new AWS.S3({ region: process.env.REGION_NAME });

const User = function () {
    // do nothing
};

User.checkIfExist = async (userName) => {
    try {
        const _query = {
            text: QUERY.ADMIN.checkIfUserExist,
            values: [userName]
        };

        const queryResult = await pg.executeQueryPromise(_query)
        return queryResult[0].usercount;

    } catch (error) {
        throw new Error(error.message)
    }
};


User.checkIfRoleIsValid = async (roleid) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.checkIfRoleIsValid,
            values: [roleid]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                logger.error("error: ", err);
                reject(err);
            } else if (res && res[0]) {
                logger.info("res: ", res);
                resolve(res[0].count);
            } else {
                reject('INVALID_ROLE')
            }
        }
        );
    });
};

User.createUsers = async (userDetails) => {

    try {

        const _query = {
            text: QUERY.ADMIN.insertUserQuery,
            values: [
                userDetails.user_name,
                userDetails.first_name,
                userDetails.last_name,
                userDetails.display_name,
                userDetails.mobile_number,
                userDetails.password,
                userDetails.role_id,
                userDetails.created_by,
                userDetails.account_locked,
                userDetails.email_id
            ]
        };

        console.log(_query);
        const queryResult = await pg.executeQueryPromise(_query);

        if (queryResult && queryResult[0].user_id) {
            return queryResult;
        } else {
            throw new Error('Invalid Response');
        }

    } catch (error) {
        throw new Error(error.message);
    }

};

// Service to get latest password Complexity
User.getPasswordComplexity = async () => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.getPasswordComplexityQuery
        };

        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    reject(err);
                } else {
                    logger.info("res: ", res);
                    resolve(res);
                }
            }
        );
    });
};


//update User Status
User.checkRoleStatus = async (userId, result) => {
    let _query = {
        text: QUERY.ADMIN.checkRoleStatusQuery,
        values: [userId]
    };

    await pg.executeQuery(_query,
        (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                result(null, res[0].isRoleInActive);
            }
        }
    );
};


User.updateUser = async (req, userId, result) => {
    let keyPattern = `User-Data|Offset:0`
    let _query = {
        text: QUERY.ADMIN.updateUserQuery,
        values: [req.first_name, req.last_name, req.display_name, req.is_active, req.email_id, req.updated_by, userId]
    };
    await pg.executeQuery(_query,
        async (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
    redis.delRedis(keyPattern).then().catch(err => console.log(err));
};


//update User Status
User.updateUserStatus = async (isActive, userId, result) => {

    let _query = {
        text: QUERY.ADMIN.updateUserStatusQuery,
        values: [isActive, userId]
    };
    await pg.executeQuery(_query,
        (err, res) => {
            if (err) {
                logger.error("error: " + err);
                result(err, null);
            } else {
                result(null, res);
            }
        }
    );
};

// Service to create Password complexity
User.createPasswordComplexity = async (complexity, result) => {
    return new Promise(async (resolve, reject) => {
        try {
            let _query = {
                text: QUERY.ADMIN.createPasswordComplexityQuery,
                values: [
                    complexity.password_expiry,
                    complexity.password_history,
                    complexity.min_password_length,
                    complexity.complexity,
                    complexity.alphabetical,
                    complexity.numeric,
                    complexity.special_chars,
                    complexity.allowed_special_chars,
                    complexity.max_invalid_attempts
                ]
            };
            let data = await pg.executeQueryPromise(_query);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

// Service to save User password history
User.getPasswordHistory = async (username) => {
    logger.info('inside password history')
    return new Promise(async (resolve, reject) => {
        logger.info(username);
        let _query = {
            text: QUERY.ADMIN.getPasswordHistory,
            values: [username]
        };
        var querySQL = await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error(err);
                    reject(err);

                } else {
                    logger.info(res);
                    resolve(res);
                }
            }
        );
        logger.debug(querySQL.sql);
    });
};

User.getUserDtls = async (id) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.selectProfileDtlsQuery,
            values: [id]
        };
        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            }
        );
    });
};

User.getUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.userById,
            values: [userId]
        };
        let data = await pg.executeQueryPromise(_query);
        if (data && data.length > 0) {
            resolve(data[0]);
        } else {
            resolve(null);
        }
    });
};

// Service to update password policy
User.UpdatePasswordPolicy = async (complexity, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let _query = {
                text: QUERY.ADMIN.updatePasswordComplexity,
                values: [
                    complexity.password_expiry,
                    complexity.password_history,
                    complexity.min_password_length,
                    complexity.complexity,
                    complexity.alphabetical,
                    complexity.numeric,
                    complexity.special_chars,
                    complexity.allowed_special_chars,
                    complexity.max_invalid_attempts,
                    id
                ]
            };

            let data = await pg.executeQueryPromise(_query);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};


User.updateUserPasswordbyAdmin = (mobileNo, password, userId) => {

    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.updateUserPasswordbyAdminQuery,
            values: [password, userId]
        };

        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    reject(err);
                } else {
                    logger.info("res: ", res);
                    // User.setUserInRedisByUserName(mobileNo);
                    resolve(res);
                }
            }
        );
    }); // Promise
};

User.updateProfilePic = (profileUrl, userId, cb) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.updateUserProfilePicQuery,
            values: [profileUrl, userId]
        };

        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    cb(err, null);
                } else {
                    logger.info("res: ", res);
                    cb(null, res);
                }
            }
        );
    });
};


User.updateProfilePic = (profileUrl, userId, cb) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.updateUserProfilePicQuery,
            values: [profileUrl, userId]
        };

        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    cb(err, null);
                } else {
                    logger.info("res: ", res);
                    cb(null, res);
                }
            }
        );
    });
};

User.getProfilePic = (userId, cb) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.getUserProfilePicQuery,
            values: [userId]
        };
        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    cb(err, null)
                } else {
                    let user = JSON.parse(JSON.stringify(res[0]));
                    let url = user.profile_picture_url;
                    if (url) {
                        let len = url.split("/").length;
                        let filename = url.split("/")[len - 1];
                        cb(null, filename)
                    } else {
                        cb(null, "")
                    }
                }
            }
        );
    });
};


User.userAddUpdateCheck = async (queryString) => {
    return new Promise(async (resolve, reject) => {
        console.log("userAddUpdateCheck", QUERY.ADMIN.countUserGrid + queryString);
        let _query = {
            text: QUERY.ADMIN.countUserGrid + queryString
        };

        await pg.executeQuery(_query, (err, rows) => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve(parseInt(rows[0].count));
            }
        }); // query
    }); // Promise
}

User.getAllUsersByHospital = async (hosp_id, user_id) => {
    try {
        let query = QUERY.ADMIN.getAllUsersByHospital;
        let params = [hosp_id]
        if (user_id) {
            query = `${query} AND U.user_id != $2`;
            params = [hosp_id, user_id]
        }
        const _query = {
            text: query,
            values: params
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw error;
    }
};

User.getUserHierarchy = async (user_id) => {
    let hierarchy = {};
    return new Promise(async (resolve, reject) => {
        let hierarchy_for = user_id;
        do {
            hierarchy = await recursiveFunction(hierarchy_for, hierarchy);
            hierarchy_for = { ...hierarchy }.reporting_to;
            delete hierarchy.reporting_to;
        } while (hierarchy_for);
        resolve(hierarchy);
    });
};

User.getSelectedNode = async (user_id) => {
    let hierarchy = {};
    return new Promise(async (resolve, reject) => {
        let hierarchy_for = user_id;
        hierarchy = await recursiveFunction(hierarchy_for, hierarchy);
        hierarchy_for = { ...hierarchy }.reporting_to;
        resolve(hierarchy);
    });
};

User.getUserFullHierarchy = async (user_id) => {
    let hierarchy = {};
    return new Promise(async (resolve, reject) => {
        let parent_node = await find_parent_node(user_id);
        hierarchy = await findHierarchy(parent_node, hierarchy, user_id);
        resolve(hierarchy);
    });
};

User.shareUserDetails = async (userDetails) => {
    try {
        // let hospital_logo = await hospitalLogo.getHospitalLogo(userDetails.hosp_id);
        // if (!hospital_logo) {
        //     hospital_logo = config.default_logo
        // }
        let mobile_number = '91' + userDetails.mobile_number;
        let hospital_logo = config.default_logo;
        let message = CONST.SMS_TEMPLATES.ADMIN_RESET_PASSWORD.body;
        message = message.replace("<NAME>", userDetails.display_name).replace("<PASSWORD>", userDetails.password);

        let render_options = {
            name: userDetails.display_name,
            body: message,
            title: `AEMS, AIEZE | Reset Password`,
            logo: hospital_logo,
            password: userDetails.password
        }

        let html_template = await generateHtmlFromEjs(render_options, 'views/pages/user-reset-password.ejs');
        await email.sendMail(userDetails.email_id, userDetails.display_name, 'AEMS, AIEZE | Reset Password', html_template);

        console.log("message", message);
        SMS.sendSMS(mobile_number, message);
        // whatsAppUtil.sendMessage(userDetails.mobile_number, message).then().catch(e => console.log(e));

        // parameters = {
        //     "variable1": userDetails.patient_name,
        //     "variable2": userDetails.patient_ref_id.toString().match(/.{1,4}/g).join("-")
        // }
        // let mobile_numbers = '91' + userDetails.mobile_number
        // await whatsapp.sendMessage([mobile_numbers], CONSTANT.WHATSAPP_TEMPLATES.REGISTRATION, parameters)

    } catch (error) {
        throw error;
    }
}


User.createUserMapping = async (userDetails) => {

    try {

        const _query = {
            text: QUERY.ADMIN.insertUserMappingQuery,
            values: [
                userDetails.user_id,
                userDetails.country_id,
                userDetails.state_id,
                userDetails.district_id,
                userDetails.sub_district_id,
                userDetails.block_id,
                userDetails.village_id
            ]
        };

        const queryResult = await pg.executeQueryPromise(_query);

        if (queryResult && queryResult[0].user_id) {
            return queryResult;
        } else {
            throw new Error('Invalid Response');
        }

    } catch (error) {
        throw new Error(error.message);
    }

};


User.addPermissions = async (access) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.addPermissions,
            values: [access.user_id, access.menu_id, access.per_id, access.created_by]
        };

        await pg.executeQuery(_query, async (err, rows) => {
            if (err) {
                logger.error(err);
                reject(err);
            } else {
                resolve(rows);
            }
        }); // query
    }); // Promise
};

User.shareNewUserDetails = async (userDetails) => {
    try {

        let mobile_number = '91' + userDetails.mobile_number;
        let hospital_logo = config.default_logo;
        let link = process.env.INIT_ADMIN_URL;
        let message = CONST.SMS_TEMPLATES.ADMIN_USER_CREATION.body;
        message = message.replace("<NAME>", userDetails.display_name).replace("<PASSWORD>", userDetails.rand_password).replace("<URL>", link);

        let render_options = {
            name: userDetails.display_name,
            body: message,
            title: `AIEZE, AEMS | User Registraion`,
            logo: hospital_logo,
            password: userDetails.rand_password,
            link: link
        }

        let html_template = await generateHtmlFromEjs(render_options, 'views/pages/new-user-creation-email.ejs');
        await email.sendMail(userDetails.email_id, userDetails.display_name, 'AEMS, AIEZE | User Registraion', html_template);

        console.log("message", message);
        SMS.sendSMS(mobile_number, message);
        // whatsAppUtil.sendMessage(userDetails.mobile_number, message).then().catch(e => console.log(e));

        // parameters = {
        //     "variable1": userDetails.patient_name,
        //     "variable2": userDetails.patient_ref_id.toString().match(/.{1,4}/g).join("-")
        // }
        // let mobile_numbers = '91' + userDetails.mobile_number
        // await whatsapp.sendMessage([mobile_numbers], CONSTANT.WHATSAPP_TEMPLATES.REGISTRATION, parameters)

    } catch (error) {
        throw error;
    }
}

const generateHtmlFromEjs = async (result, ejs_path) => {
    try {
        let html;
        html = await ejs.renderFile(ejs_path, result, {
            async: true
        });
        return html;

    } catch (error) {
        throw error;
    }
}

const find_parent_node = async (user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = QUERY.ADMIN.getUserParent;
            let params = [user_id]
            const _query = {
                text: query,
                values: params
            };
            const queryResult = await pg.executeQueryPromise(_query);
            if (queryResult && queryResult.length > 0) {
                let reporting_to = queryResult[0].reporting_to;
                let user_id = queryResult[0].user_id;
                if (reporting_to) {
                    resolve(find_parent_node(reporting_to));
                } else {
                    resolve(user_id);
                }
            }
        } catch (error) {
            return null;
        }
    })
}

const recursiveFunction = (user_id, hierarchy) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = QUERY.ADMIN.getUserHierarchy;
            let params = [user_id]
            const _query = {
                text: query,
                values: params
            };

            const queryResult = await pg.executeQueryPromise(_query);
            let childrens = hierarchy
            if (hierarchy.data) {
                hierarchy = {
                    ...queryResult[0],
                    data: { name: queryResult[0].data, user_id: queryResult[0].user_id, profile_picture_url: queryResult[0].profile_picture_url },
                    children: [childrens]
                }
                delete hierarchy.designation;
                delete hierarchy.user_id;
                delete hierarchy.profile_picture_url;
            } else {
                hierarchy = {
                    ...queryResult[0],
                    data: { name: queryResult[0].data, user_id: queryResult[0].user_id, profile_picture_url: queryResult[0].profile_picture_url },
                }
                delete hierarchy.designation;
                delete hierarchy.user_id;
                delete hierarchy.profile_picture_url;
            }
            resolve(hierarchy)
        } catch (error) {
            throw error;
        }
    })
}

const findHierarchy = (user_id, hierarchy, actual_user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = QUERY.ADMIN.getUserHierarchy;
            let queryChildNodes = QUERY.ADMIN.getUserHierarchyChild;
            let params = [user_id]
            const _query = {
                text: query,
                values: params
            };
            const _queryChildNodes = {
                text: queryChildNodes,
                values: params
            };

            const queryResult = await pg.executeQueryPromise(_query);
            const queryResultChild = await pg.executeQueryPromise(_queryChildNodes);
            let selfNode = queryResult[0];
            let tempChildNodes = queryResultChild;
            let childNodes = [];
            tempChildNodes.forEach(child => {
                childNodes.push(
                    {
                        "label": child.label,
                        "expanded": true,
                        "type": "person",
                        "styleclass": "ui-person",
                        "selectable": (actual_user_id == child.user_id),
                        data: { name: child.data, designation: child.designation, user_id: child.user_id, profile_picture_url: child.profile_picture_url }
                    }
                )
                delete child.designation;
                delete child.user_id;
                delete child.profile_picture_url;
                delete child.reporting_to;
            })
            hierarchy = {
                ...selfNode,
                selectable: (actual_user_id == selfNode.user_id),
                data: { name: selfNode.data, designation: selfNode.designation, user_id: selfNode.user_id, profile_picture_url: selfNode.profile_picture_url },
                children: childNodes
            }
            delete hierarchy.designation;
            delete hierarchy.user_id;
            delete hierarchy.profile_picture_url;
            delete hierarchy.reporting_to;

            async.forEachOfSeries(hierarchy.children, async function (child, cb2) {
                let childrens = await recursiveChildHierarchy(child, actual_user_id);
                child.children = childrens;

            }, async function () {
                resolve(hierarchy);
            });
        } catch (error) {
            throw error;
        }
    })
}

const recursiveChildHierarchy = (a_child, actual_user_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let tempChild = { ...a_child }
            let user_id = tempChild.data.user_id;
            let queryChildNodes = QUERY.ADMIN.getUserHierarchyChild;
            let params = [user_id]
            const _queryChildNodes = {
                text: queryChildNodes,
                values: params
            };
            const queryResultChild = await pg.executeQueryPromise(_queryChildNodes);
            let tempChildNodes = queryResultChild;
            let childNodes = [];
            tempChildNodes.forEach(child => {
                childNodes.push(
                    {
                        "label": child.label,
                        "expanded": true,
                        "type": "person",
                        "styleclass": "ui-person",
                        "selectable": (actual_user_id == child.user_id),
                        data: { name: child.data, designation: child.designation, user_id: child.user_id, profile_picture_url: child.profile_picture_url }
                    }
                )
                delete child.designation;
                delete child.user_id;
                delete child.profile_picture_url;
                delete child.reporting_to;
            });
            // tempChild.children = childNodes;
            async.forEachOfSeries(childNodes, async function (childsChild, cb2) {
                childsChild.children = await recursiveChildHierarchy(childsChild);
                delete childsChild.designation;
                delete childsChild.user_id;
                delete childsChild.profile_picture_url;
                delete childsChild.reporting_to;
            }, async function () {
                resolve(childNodes);
            });
        } catch (error) {
            console.log(error);
        }
    })
}


User.getUserdataGridNew = async (token, locObj, reqData) => {

    return new Promise(async (resolve, reject) => {

        try {

            let page_size = locObj[0];
            let current_page = locObj[1];
            let search = locObj[2];
            let role_access = locObj[3];
            let role_id = token.role;
            let key = "User-Data";
            let access = ` `;
            let addUpdateCheck = 0;
            let acccessString;

            
            if (role_access && role_access.length > 0) {
                let role_access_string = '';
                for(let level of role_access) {
                    role_access_string += `'${level}',`;
                }
                role_access_string = role_access_string.substring(0, role_access_string.lastIndexOf(','));
                access += ` and user_level IN (${role_access_string}) `;
                // key += `|USER_LEVEL:${role_access_string}`;
            }

            if (search) {
                let mobile_number = Number(search);
                console.log("----- mobile number ------ ", mobile_number);
                access += ` and and role_id !=1 and CAST(mobile_number AS text) like '${mobile_number}%'`
                key += `|Mobile:${mobile_number}`;
            }

            


            if (role_id == 1) {
                acccessString = ` where 1=1 ${access} `
                addUpdateCheck = await User.userAddUpdateCheck(acccessString + ` and date_created >= NOW() - INTERVAL '5 minutes' or date_modified >= NOW() - INTERVAL '5 minutes'`);
            } else {
                acccessString = ` where 1=1 ${access} `
                addUpdateCheck = await User.userAddUpdateCheck(acccessString + ` and date_created >= NOW() - INTERVAL '5 minutes' or date_modified >= NOW() - INTERVAL '5 minutes'`);
            }

            if (addUpdateCheck > 0) {

                let _query = {
                    text: QUERY.ADMIN.viewUserGrid + acccessString + ` and role_id !=1 order by date_modified desc, date_created desc limit ${page_size} offset ${current_page} `
                };


                try {
                    let rows = await pg.executeQueryPromise(_query);
                    resolve(rows);
                } catch (error) {
                    logger.error(error);
                    reject(error);
                }
            } else {

                if (role_id == 1) {
                    console.log('role id 1');
                    var arr = [];
                    key += "|Offset:" + current_page;
                    let result;
                    let redisResult = await redis.GetKeys(key);
                    if (redisResult && redisResult.length > 0) {
                        result = await redis.GetRedis(redisResult);
                        console.log("result -- ", result);
                        // cb(null, result);
                        console.log('role 1 redis')
                        if (result.length > 0) {
                            let usersData = JSON.parse(result);
                            resolve(usersData)
                        } else {
                            resolve(result)
                        }
                    } else {
                        let queryString = ` where 1=1 and role_id !=1 ${access} limit ${page_size} offset ${current_page}`;
                        console.log('with limit', queryString)

                        console.log("====================================");
                        console.log(QUERY.ADMIN.viewUserGrid + queryString);
                        console.log("====================================");
                        let _query = {
                            text: QUERY.ADMIN.viewUserGrid + queryString
                        };

                        try {
                            let rows = await pg.executeQueryPromise(_query);
                            if (rows && rows.length > 0) {
                                redis.SetRedis(key, rows, 60 * 10)
                                    .then()
                                    .catch(err => console.log(err));
                            }
                            resolve(rows);
                        } catch (error) {
                            logger.error(error);
                            reject(error);
                        }
                    }
                } else {
                    key += `|RoleIdNot:1-${role_id}|Offset:${current_page}`;
                    let result;
                    let redisResult = await redis.GetKeys(key);
                    if (redisResult && redisResult.length > 0) {
                        result = await redis.GetRedis(redisResult);
                        let usersData = JSON.parse(result);
                        resolve(usersData);

                    } else {
                        let queryString = ` where 1 = 1 ${access} order by user_id desc limit ${page_size} offset ${current_page}`

                        console.log("====================================");
                        console.log(QUERY.ADMIN.viewUserGrid + queryString);
                        console.log("====================================");
                        let _query = {
                            text: QUERY.ADMIN.viewUserGrid + queryString
                        };


                        try {
                            let rows = await pg.executeQueryPromise(_query);
                            if (rows && rows.length > 0) {
                                redis.SetRedis(key, rows, 60 * 10)
                                    .then()
                                    .catch(err => console.log(err));
                            }
                            resolve(rows);
                        } catch (error) {
                            logger.error(error);
                            reject(error);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

};


User.getUserdataGridCount = async (token, locObj, reqData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let role_id = token.role;
            let search = locObj[0];
            let role_access = locObj[1];

            let access = ` `;
            let key = "User-Data";


            if (role_access && role_access.length > 0) {
                let role_access_string = '';
                for(let level of role_access) {
                    role_access_string += `'${level}',`;
                }
                role_access_string = role_access_string.substring(0, role_access_string.lastIndexOf(','));
                access += ` and user_level IN (${role_access_string})`
                // key += `|USER_LEVEL:${role_access.join(',')}`
            }

            if (search) {
                let mobile_number = Number(search);
                console.log("----- mobile number ------ ", mobile_number);
                access += ` and mobile_number = '${mobile_number}'`
                key += `|Mobile:${mobile_number}`
            }
            

            if (role_id == 1) {
                key += "|Count";
                let result;
                let redisResult = await redis.GetKeys(key);
                if (redisResult && redisResult.length > 0) {
                    result = await redis.GetRedis(redisResult);
                    result = JSON.parse(result);
                    console.log("result -- ", result);
                    resolve(Number(result));

                } else {
                    let queryString = ` where 1=1 and role_id !=1 ${access} `;
                    console.log("====================================");
                    console.log(QUERY.ADMIN.countUserGrid + queryString);
                    console.log("====================================");
                    let _query = {
                        text: QUERY.ADMIN.countUserGrid + queryString
                    };

                    await pg.executeQuery(_query, (err, rows) => {
                        if (err) {
                            logger.error(err);
                            reject(err);
                        } else {
                            redis.SetRedis(key, rows[0].count, 60 * 10)
                                .then()
                                .catch(err => console.log(err));
                            resolve(rows[0].count);
                        }
                    }); // query
                }
            } else {

                key += `|RoleIdNot:1-${role_id}|Count`;
                let queryString = ' '
                let redisResult = await redis.GetKeys(key);
                console.log("====================================");
                console.log(QUERY.ADMIN.countUserGrid + queryString);
                console.log("====================================");

                if (redisResult && redisResult.length > 0) {
                    //cb(null, redisResult);
                    count = redisResult;
                    result = await redis.GetRedis(redisResult);
                    result = JSON.parse(result);
                    console.log("result -- ", result);
                    resolve(Number(result));
                } else {
                    queryString = ` where 1 = 1 ${access} `

                    console.log("====================================");
                    console.log(QUERY.ADMIN.countUserGrid + queryString);
                    console.log("====================================");
                    let _query = {
                        text: QUERY.ADMIN.countUserGrid + queryString
                    };

                    await pg.executeQuery(_query, (err, rows) => {
                        if (err) {
                            logger.error(err);
                            reject(err);
                        } else {
                            redis.SetRedis(key, rows[0].count, 60 * 10)
                                .then()
                                .catch(err => console.log(err));
                            resolve(rows[0].count);
                        }
                    }); // query
                }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }

    }); // Promise
};


User.getUserAccessList = (user_id) => {
    return new Promise(async (resolve, reject) => {
      let _query = {
        text: QUERY.USER.getUserAccessControl,
        values: [user_id]
      };
    
      await pg.executeQuery(_query, (err, rows) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(rows);
        }
      }); // query
    }); // Promise
  };

  User.getUserMobile = (userId) => {
    return new Promise(async (resolve, reject) => {
        let _query = {
            text: QUERY.ADMIN.getUserMobileQuery,
            values: [userId]
        };

        await pg.executeQuery(_query,
            (err, res) => {
                if (err) {
                    logger.error("error: ", err);
                    reject(err);
                } else {
                    logger.info("res: ", res);
                    resolve(res);
                }
            }
        );
    }); // Promise
}; // getUserMobile



module.exports = User;


