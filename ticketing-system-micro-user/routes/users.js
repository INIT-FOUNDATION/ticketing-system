const express = require("express");
const router = express.Router();
const {
  STATUS,
  logger,
  CONST,
  passwordPolicy,
  redis,
  SMS,
} = require("ticketing-system-micro-common");
const bcrypt = require("bcryptjs");
let ERRORCODE = require("../constants/ERRRORCODE");
let userService = require("../services/userService");
let moment = require("moment");
let userModel = require("../models/users");
let async = require("async");

router.get("/health", async (req, res) => {
  try {
    return res.status(STATUS.OK).send("User Service is Healthy");
  } catch (error) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.post("/updateUser", async (req, res) => {
  var userId = CONST.decryptPayload(req.body.userId);

  let reqUser = req.plainToken;
  let reuserId = reqUser.user_id;
  let userBody = req.body;
  userBody.update_by = reuserId;

  var user = new userModel.UpdateUser(userBody);
  let key = `LOGGED_IN_USER_DETAILS_${reqUser.user_name}`;
  if (!userId || !user) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF0014", "error":"${ERRORCODE.ERROR.USRPRF0014}"}`
      );
  }

  const { error } = userModel.validateUpdateUsers(user);
  if (error) {
    if (
      error.details != null &&
      error.details != "" &&
      error.details != "undefined"
    ) {
      return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
    } else return res.status(STATUS.BAD_REQUEST).send(error.message);
  } else {
    user.updated_by = reuserId;
    userService.updateUser(user, userId, async (err, results) => {
      if (err) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
      }

      return res.status(STATUS.OK).send({
        error: false,
        data: results,
        message: "User has been updated successfully.",
      });
    });
    redis.del(key);
  }
});

router.post("/resetPassword", async (req, res) => {
  let txnId = req.body.txnId;
  let confirm_password = CONST.decryptPayload(req.body.confirm_password);
  let newPassword = CONST.decryptPayload(req.body.new_password);
  if (!txnId) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF00027", "error":"${ERRORCODE.ERROR.USRPRF00027}"}`
      );
  }

  if (!newPassword) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF00019", "error":"${ERRORCODE.ERROR.USRPRF00019}"}`
      );
  }
  if (!confirm_password) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF00028", "error":"${ERRORCODE.ERROR.USRPRF00028}"}`
      );
  }

  if (confirm_password != newPassword) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF00029", "error":"${ERRORCODE.ERROR.USRPRF00029}"}`
      );
  }

  let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${txnId}`;

  let redisResult = await redis.GetKeyRedis(forgotPasswordChangeKey);
  if (redisResult && redisResult.length > 0 && redisResult[0]) {
    redis.del(forgotPasswordChangeKey);
    let otpData = JSON.parse(redisResult);
    userService.getProfileDtlsbyMob(otpData.mobile_no, (err, result) => {
      if (err) res.status(STATUS.BAD_REQUEST).send(err);
      let type = 2;
      let lastPassword = result[0].current_password;
      if (result && result[0]) {
        passwordPolicy
          .validate_password(result[0].user_id, newPassword, type)
          .then(function (policy) {
            if (policy.status) {
              bcrypt.compare(newPassword, lastPassword, async (err, res1) => {
                if (res1) {
                  res
                    .status(STATUS.BAD_REQUEST)
                    .send(
                      `{"errorCode":"USRPRF0004", "error":"${ERRORCODE.ERROR.USRPRF0004}"}`
                    );
                } else {
                  const salt = await bcrypt.genSalt(10);
                  newPassword = await bcrypt.hash(newPassword, salt);
                  userService.updatePassword(
                    newPassword,
                    result[0].user_id,
                    result[0].user_name,
                    async (err, results) => {
                      if (err) {
                        res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                      } else {
                        if (type == 2) {
                          const userDetails =
                            await userService.getUserDtlsPromise(
                              result[0].user_id
                            );
                          let userData = {};
                          userData = Object.assign(userData, userDetails);
                          userData["user_name"] = userDetails["username"];
                          userData["state_id"] = userDetails["state"];
                          userData["district_id"] = userDetails["district"];
                          userData["password"] = lastPassword;
                          userData["account_locked"] = 0;
                          userData["date_created"] = moment(
                            userDetails["date_created"]
                          ).toISOString();
                          userData["password_last_updated"] = moment(
                            userDetails["password_last_updated"]
                          ).toISOString();
                          delete userData["username"];
                          delete userData["user_id"];
                          delete userData["state"];
                          delete userData["district"];
                          delete userData["current_password"];
                          delete userData["invalid_attempts"];

                          userService.setPasswordHistory(
                            userData,
                            function (e, r) {}
                          );
                        }
                      }
                      delete_current_user_keys(otpData.mobile_no);
                      res.status(STATUS.OK).send({
                        error: false,
                        data: results,
                        message: "Password has been changed successfully.",
                      });
                    }
                  );
                }
              });
            } else {
              return res
                .status(STATUS.BAD_REQUEST)
                .send(`{"errorCode":"USRPRF0022", "error":${policy.message}}`);
            }
          })
          .catch((err) => {
            return res.status(STATUS.BAD_REQUEST).send(err);
          });
      } else {
        return res
          .status(STATUS.BAD_REQUEST)
          .send(
            `{ "errorCode": "USRPRF0001", "error": "${ERRORCODE.ERROR.USRPRF0001}" }`
          );
      }
    });
  } else {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF00030", "error":"${ERRORCODE.ERROR.USRPRF00030}"}`
      );
  }
});

router.post("/updatePassword", async (req, res) => {
  var userId = CONST.decryptPayload(req.body.userId);
  req.body.currentPassword = CONST.decryptPayload(req.body.currentPassword);
  req.body.newPassword = CONST.decryptPayload(req.body.newPassword);

  if (!userId) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF0001", "error":"${ERRORCODE.ERROR.USRPRF0001}"}`
      );
  }
  if (!req.body.newPassword) {
    return res
      .status(STATUS.BAD_REQUEST)
      .send(
        `{"errorCode":"USRPRF0006", "error":"${ERRORCODE.ERROR.USRPRF0006}"}`
      );
  }
  userService.getProfileDtls(userId, (err, result) => {
    let currentPwd = result[0].current_password;
    if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    bcrypt.compare(
      req.body.currentPassword,
      result[0].current_password,
      async (err, res2) => {
        if (!res2) {
          res
            .status(STATUS.BAD_REQUEST)
            .send(
              `{"errorCode":"USRPRF0007", "error":"${ERRORCODE.ERROR.USRPRF00020}"}`
            );
        } else {
          bcrypt.compare(
            req.body.newPassword,
            result[0].current_password,
            async (err, res1) => {
              if (res1) {
                res
                  .status(STATUS.BAD_REQUEST)
                  .send(
                    `{"errorCode":"USRPRF0008", "error":"${ERRORCODE.ERROR.USRPRF00021}"}`
                  );
              } else {
                var passwrd = req.body.newPassword;
                const salt = await bcrypt.genSalt(10);
                req.body.newPassword = await bcrypt.hash(
                  req.body.newPassword,
                  salt
                );
                let type = 2;
                passwordPolicy
                  .validate_password(userId, passwrd, type)
                  .then(function (policy) {
                    if (policy.status) {
                      userService.updatePassword(
                        req.body.newPassword,
                        userId,
                        result[0].user_name,
                        (err, results) => {
                          if (err)
                            res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
                          else {
                            userService.getUserDtlsPro(
                              userId,
                              function (err, userDetails) {
                                let userData = {};

                                userData["user_name"] =
                                  userDetails["user_name"];
                                userData["password"] = currentPwd;
                                userData["user_id_parent"] =
                                  userDetails["user_id"];
                                userData["display_name"] =
                                  userDetails["display_name"];
                                userData["mobile_number"] =
                                  userDetails["mobile_number"];
                                userData["date_of_birth"] =
                                  userDetails["date_of_birth"];
                                userData["role_id"] = userDetails["role_id"];
                                userData["is_active"] =
                                  userDetails["is_active"];
                                userData["date_created"] =
                                  userDetails["date_created"];
                                userData["account_locked"] = 0;
                                userService.setPasswordHistory(
                                  userData,
                                  function (e, r) {}
                                );
                              }
                            );
                          }

                          delete_current_user_keys(result[0].user_name);

                          res.status(STATUS.OK).send({
                            error: false,
                            data: results,
                            message: "Password has been changed successfully.",
                          });
                        }
                      );
                    } else {
                      return res
                        .status(STATUS.BAD_REQUEST)
                        .send(
                          `{"errorCode":"USRPRF0022", "error":${policy.message}}`
                        );
                    }
                  });
              }
            }
          );
        }
      }
    );
  });
});

router.get("/getLoggedInUser", async (req, res) => {
  const userData = req.plainToken;
  userService.selectUser(userData.user_name, async (err, userres) => {
    if (err) {
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send("SOMETHING WENT WRONG IN SELECT USER");
    } else {
      if (!userres[0]) {
        return res.status(STATUS.BAD_REQUEST).send("Invalid User");
      } else {
        var userDetails = {};
        let userDetailsDB = userres[0];
        console.log("=================================");
        console.log(userDetailsDB);
        console.log("=================================");
        const _app_level = CONST.APP_CATEGORY_LEVELS[userData.app_conf];
        let gender = CONST.GENDER[userDetailsDB.gender];

        userDetails = {
          ...userDetailsDB,
          user_level: userData.user_level,
          app_level: _app_level,
          gender_name: gender,
          hierarchy: userData.app_conf,
          user_id: CONST.encryptPayload(userDetailsDB.user_id),
          role_id: CONST.encryptPayload(userDetailsDB.role_id),
        };
        res.status(STATUS.OK).send({
          loggedInUser: userDetails,
        });
      }
    }
  });
});

router.get("/getLoggedInUserInfo", async (req, res) => {
  const userData = req.plainToken;
  let key = `LOGGED_IN_USER_DETAILS_${userData.user_name}`;
  let redisResult = await redis.GetKeyRedis(key);
  if (redisResult && redisResult.length > 0 && redisResult[0]) {
    res.status(STATUS.OK).send({
      loggedInUser: JSON.parse(redisResult),
    });
  } else {
    userService.selectUser(userData.user_name, async (err, userres) => {
      if (err) {
        return res
          .status(STATUS.INTERNAL_SERVER_ERROR)
          .send("SOMETHING WENT WRONG IN SELECT USER");
      } else {
        if (!userres[0]) {
          return res.status(STATUS.BAD_REQUEST).send("Invalid User");
        } else {
          var userDetails = {};
          let userDetailsDB = userres[0];
          console.log("=================================");
          console.log(userDetailsDB);
          console.log("=================================");

          let aws_s3_prefix_url = `https://${process.env.TS_S3_BUCKET}.s3.ap-south-1.amazonaws.com/`;
          if (userDetailsDB.profile_picture_url) {
            let profile_pic_cdn = userDetailsDB.profile_picture_url.replace(
              aws_s3_prefix_url,
              ""
            );
            userDetailsDB.profile_pic_cdn = `${process.env.CDN_CONTEXT_PATH}/api/v1/admin/cdn/file?file_name=${profile_pic_cdn}`;
          }

          const _app_level = CONST.APP_CATEGORY_LEVELS[userData.app_conf];
          let gender = CONST.GENDER[userDetailsDB.gender];

          userDetails = {
            ...userDetailsDB,
            user_level: userData.user_level,
            app_level: _app_level,
            gender_name: gender,
            hierarchy: userData.app_conf,
            user_id: CONST.encryptPayload(userDetailsDB.user_id),
            role_id: CONST.encryptPayload(userDetailsDB.role_id),
          };
          let loggedInUserKey = `LOGGED_IN_USER_DETAILS_${userData.user_name}`;
          redis.SetRedis(loggedInUserKey, userDetails, 28800);
          res.status(STATUS.OK).send({
            loggedInUser: userDetails,
          });
        }
      }
    });
  }
});

function delete_current_user_keys(username) {
  let keys = [`${username}`, `User|Username:${username}`];
  redis.del(keys);
}

module.exports = router;
