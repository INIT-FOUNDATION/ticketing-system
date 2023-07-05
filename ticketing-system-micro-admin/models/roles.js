const { ERROR } = require("../constants/ERRORCODE");
const Joi = require("joi");

// Constructor
var Role = function (role) {
  this.role_name = role.role_name;
  this.role_description = role.role_description;
  this.level = role.level;
  this.is_active = role.is_active;
  this.module_json = role.module_json
};

// var Menu = function (menu) {
//   this.menu_name = menu.menu_name;
//   this.menu_description = menu.menu_description;
//   this.parent_menu_id = menu.parent_menu_id ? menu.parent_menu_id : 0;
//   this.is_active = menu.is_active;
// };

// Edit Role Constructor
var EditRole = function (role) {
  this.role_name = role.role_name;
  this.role_id = role.role_id;
  this.role_description = role.role_description;
  this.is_active = role.is_active;
  this.level = role.level;
};

// var EditMenu = function (menu) {
//   this.menu_name = menu.menu_name;
//   this.menu_id = menu.menu_id;
//   this.menu_description = menu.menu_description;
//   this.parent_menu_id = menu.parent_menu_id;
//   this.is_active = menu.is_active;
// };

function validateRole(role) {

  const schema = {
    role_name: Joi.string()
      .min(1)
      .max(50)
      .error(
        new Error(`{"errorCode":"ROLE000002", "error":"${ERROR.ROLE000002}"}`)
      )
      .required(),
    role_description: Joi.string()
      .allow("", null)
      .max(100)
      .error(
        new Error(`{"errorCode":"ROLE000003", "error":"${ERROR.ROLE000003}"}`)
      ),
    level: Joi.string()
      .required(),
    is_active: Joi.number()
      .required(),
    module_json: Joi.array()
    .required(),
  };
  return Joi.validate(role, schema);
}



function validateEditRole(roles) {
  const schema = {
    role_name: Joi.string()
      .min(1)
      .max(50)
      .error(
        new Error(`{"errorCode":"ROLE000002", "error":"${ERROR.ROLE000002}"}`)
      )
      .required(),
    role_description: Joi.string()
      .allow("", null)
      .max(100)
      .error(
        new Error(`{"errorCode":"ROLE000003", "error":"${ERROR.ROLE000003}"}`)
      ),
    role_id: Joi.number()
      .required(),
    is_active: Joi.number()
      .required(),
    level: Joi.string().required()
  };
  return Joi.validate(roles, schema);
}



module.exports.Role = Role;
module.exports.validateRole = validateRole;
module.exports.EditRole = EditRole;
module.exports.validateEditRole = validateEditRole;
//module.exports.Menu = Menu;
//module.exports.EditMenu = EditMenu;
//module.exports.validateMenu = validateMenu;
//module.exports.validateEditMenu = validateEditMenu;

