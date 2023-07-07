const express = require("express");
const router = express.Router();
const { STATUS } = require("ticketing-system-micro-common");

let async = require('async');

let roles = require('../models/roles');
let ERRORCODE = require('../constants/ERRORCODE');
const CONSTANT = require('../constants/CONST');
const roleService = require("../services/roleService");

router.get("/getRoles", async (req, res) => {
  try {
    let data = await roleService.getRoleDetails();
    res.status(STATUS.OK).send(data);
  } catch (err) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.post("/getSiteList", async (req, res) => {
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
});

//Retrieve Role details for Edit Role
router.get("/getRole/:roleID", async (req, res) => {
  let roleID = req.params.roleID;
  roleService.getSpecificRoleDetails(roleID, (err, result) => {
    if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
    res.status(STATUS.OK).send(result[0]);
  });
});

// To Update The Role Status
router.post("/updateRoleStatus", async (req, res) => {
  let role_id = req.body.role_id;
  let is_active = (req.body.is_active == '') ? 0 : req.body.is_active;
  try {
    let activeUsers = await roleService.countActiveUsers(role_id);
    if (activeUsers) {
      return res.status(STATUS.BAD_REQUEST).send(activeUsers);
    } else {
      roleService.updateRoleStatus(is_active, role_id, (err, results) => {
        if (err) res.status(STATUS.INTERNAL_SERVER_ERROR).send(err);
        res.status(STATUS.OK).send({ message: "Role Status has been updated successfully." });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }

});

router.get("/getRoleAccessList/:role_id", async (req, res) => {
  try {

    let role_id = req.params.role_id;
    let data = await roleService.getRoleAccessList(role_id);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    console.log(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

// To Update The Role Details
router.post("/updateRoleDetails", async (req, res) => {
  try {
    var roleDetails = new roles.EditRole(req.body);
    const { error } = roles.validateEditRole(roleDetails);
    let validatePatternError = await roleService.validatePattern(roleDetails.role_name, roleDetails.role_description);
    if (validatePatternError) {
      return res.status(STATUS.BAD_REQUEST).send(validatePatternError);
    }
    if (error) {
      if (
        error.details != null &&
        error.details != "" &&
        error.details != "undefined"
      ) {
        return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
      }
      else {
        return res.status(STATUS.BAD_REQUEST).send(error.message);
      }

    } else {
      if (roleDetails.is_active == 0) {
        let activeUsers = await roleService.countActiveUsers(roleDetails.role_id);
        if (activeUsers > 0) {
          return res.status(STATUS.BAD_REQUEST).send(activeUsers);
        }
      }
      let checkRoleNameExist = await roleService.checkNameExist(roleDetails.role_name, roleDetails.role_id, 'ROLE');
      if (checkRoleNameExist > 0) {
        return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"ROLE000001", "error":"${ERRORCODE.ERROR.ROLE000001}"}`);
      }

      await roleService.editRole(roleDetails);
      if (req.body.module_json) {
        await roleService.deletePermissions(roleDetails);
        async.forEachOfSeries(req.body.module_json, async function (per, cb2) {
          let access = {
            "role_id": roleDetails.role_id,
            "menu_id": per.menu_id,
            "per_id": per.per_id
          }
          await roleService.addPermissions(access);

        }, async function () {
        });
      }
      return res.status(STATUS.OK).send({ message: "Role updated successfully." });
    }

  } catch (err) {
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getActiveRoleList", async (req, res) => {
  try {
    var import_access = req.initPayload.role_access;
    let token = req.plainToken;
    var role_id = token.role;
    var role_access = import_access.join("','");
    let data = await roleService.getactiveRoles(role_access, role_id);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    console.log(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getAllRoleList", async (req, res) => {
  try {
    let data = await roleService.getAllRoles();
    res.status(STATUS.OK).send(data);
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getMenuList/:isActive", async (req, res) => {
  try {
    let isActive = req.params.isActive ? parseInt(req.params.isActive) : 0;
    let data = await roleService.getMenuList(isActive);
    res.status(STATUS.OK).send(data);
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});


router.get("/getLevels", async (req, res) => {
  try {
    let token = req.plainToken;
    var getConfig = token.app_conf;
    console.log("config data", getConfig);
    let data = await roleService.getLevels(getConfig);

    res.status(STATUS.OK).send(data);
  } catch (err) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});

router.get("/getCombinedAccessList/:user_id/:role_id", async (req, res) => {
  try {
    let token = req.plainToken;
    let txnId = token.txnId;
    console.log("txnId", txnId);
    // let user_id = req.params.user_id ? req.params.user_id : token.user_id;
    // let role_id = req.params.role_id ? req.params.role_id :  token.role_id;

    let user_id = token.user_id ? token.user_id : req.params.user_id;
    let role_id = token.role ? token.role : req.params.role_id;

    if (txnId) {
      return res.status(STATUS.OK).send(CONSTANT.PATIENT_PERMISSION);
    } else {
      let data = await roleService.getCombinedAccessList(user_id, role_id);
      return res.status(STATUS.OK).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(STATUS.INTERNAL_SERVER_ERROR).send();
  }
});


module.exports = router;
