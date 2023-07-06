const { pg, CONST, redis, logger, queryUtility } = require("ticketing-system-micro-common");
const QUERY = require('../constants/QUERY');
const ERRORCODE = require('../constants/ERRORCODE');
const fileConfig = require('../constants/config');

let roleService = function () {
  // do nothing
};

//Get version details query
roleService.getRoleDetails = () => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.selectRoleDetails
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


roleService.validatePattern = async (name, description) => {
  return new Promise((resolve, reject) => {
    let error = '';
    if (!fileConfig.roleNameRegex.test(name)) {
      error = `{"errorCode":"ROLE000004", "error":"${ERRORCODE.ERROR.ROLE000004}"}`;
    } else if (!fileConfig.roledescRegex.test(description)) {
      error = `{"errorCode":"ROLE000005", "error":"${ERRORCODE.ERROR.ROLE000005}"}`;
    }
    resolve(error);
  }); // Promise
};

roleService.checkIfExist = async (name, type) => {
  return new Promise(async (resolve, reject) => {
    let _text = (type == "ROLE") ? QUERY.ROLE.checkRoleExist : QUERY.ROLE.checkMenuExist;
    let _query = {
      text: _text,
      values: [name]
    };

    await pg.executeQuery(_query,
      (err, res) => {
        if (err) {
          logger.error("error: " + err);
          reject(err);
        } else {
          resolve(res[0].count);
        }
      }
    );
  }); // Promise
};


roleService.addPermissions = async (access) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.addPermissions,
      values: [access.role_id, access.menu_id, access.per_id]
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

roleService.addRole = async (role) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.insertRoleQuery,
      values: [role.role_name, role.role_description, role.level, role.is_active]
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




//Retrieve Role details for Edit Role
roleService.getSpecificRoleDetails = async (roleID, result) => {
  let _query = {
    text: QUERY.ROLE.selectSpecificRoleDetails,
    values: [roleID]
  };

  await pg.executeQuery(_query, function (err, res) {
    if (err) {
      logger.error("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};


roleService.countActiveUsers = async (role_id) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.countActiveUsersQuery,
      values: [role_id]
    };

    await pg.executeQuery(_query, function (err, res) {
      let error = "";
      if (err) {
        logger.error("error: " + err);
        reject(err);
      } else if (res[0].activeUsers > 0) {
        error = (`{"errorCode":"ADMROL0002", "error":"${ERRORCODE.ERROR.ADMROL0002}", "count":"${res[0].activeUsers}"}`);
        resolve(error);
      }
      else
        resolve(0);
    })
  }); // Promise
};


roleService.checkNameExist = async (name, id, type) => {
  return new Promise(async (resolve, reject) => {
    let _text = (type == "ROLE") ? QUERY.ROLE.checkRoleNameExist : QUERY.ROLE.checkRoleNameExist;
    let _query = {
      text: _text,
      values: [name, id]
    };

    await pg.executeQuery(_query,
      (err, res) => {
        if (err) {
          logger.error("error: " + err);
          reject(err);
        } else {
          resolve(res[0].count);
        }
      }
    );
  }); // Promise
};


roleService.deletePermissions = async (role) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.deletePermissions,
      values: [role.role_id]
    };

    await pg.executeQuery(_query, async (err, rows) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    })
  }); // Promise
};


//Get active roles query
roleService.getactiveRoles = (access, role_id) => {
  let queryString = (role_id == 1) ? ` ORDER BY role_name asc` : ` and level in ('${access}') ORDER BY role_name asc`;

  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.getActiveRolesQuery + queryString
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

roleService.getRoleAccessList = (role_id) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.getRoleAccessList,
      values: [role_id]
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

// To Update The Role Details
roleService.editRole = async (role) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.updateRoleQuery,
      values: [role.role_name, role.role_description, role.is_active, role.role_id, role.level]
    };

    await pg.executeQuery(_query, async (err, rows) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        redis.del(`ROSTERACCESS|${role.role_id}`)
        resolve();
      }
    })
  }); // Promise
};



//Get active roles query
roleService.getAllRoles = () => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.selectAllRolesQuery
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


roleService.getMenuList = (isActive) => {
  return new Promise(async (resolve, reject) => {
    let queryString = isActive ? ` AND is_active = 1 ORDER BY menu_order ASC` : ` ORDER BY menu_order ASC`;
    let _query = {
      text: QUERY.ROLE.getMenuList + queryString
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


roleService.getLevels = async (conf) => {
  try {

    const result = CONST.APP_CATEGORY_LEVELS[conf];
    return result;

  } catch (error) {
    throw new Error(error.message);
  }
}


//Get active roles query
roleService.getactiveRoles = (access, role_id) => {
  let queryString = (role_id == 1) ? ` ORDER BY role_name asc` : ` and level in ('${access}') ORDER BY role_name asc`;

  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.getActiveRolesQuery + queryString
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

roleService.getCombinedAccessList = (user_id, role_id) => {
  return new Promise(async (resolve, reject) => {
    let _query = {
      text: QUERY.ROLE.getCombinedAccessList,
      values: [user_id, role_id]
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

module.exports = roleService;
