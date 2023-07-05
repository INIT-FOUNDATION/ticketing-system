const ERROR = require("../constants/ERRORCODE");
const Joi = require("joi");

const Hospital = function (ele) {
  this.hospital_name = ele.hospital_name;
  this.org_id = ele.org_id ? parseInt(ele.org_id) : null;
  this.country_id = ele.country_id ? parseInt(ele.country_id) : null;
  this.state_id = ele.state_id ? parseInt(ele.state_id) : null;
  this.district_id = ele.district_id ? parseInt(ele.district_id) : null;
  this.block_id = ele.block_id ? parseInt(ele.block_id) : null;
  this.village_id = ele.village_id ? parseInt(ele.village_id) : null;
  this.city_name = ele.city_name ? ele.city_name : null;
  this.address = ele.address;
  this.zip_code = ele.zip_code;
  this.latitude = ele.latitude ? ele.latitude : null;
  this.longitude = ele.longitude ? ele.longitude : null;
  this.contact_person_name = ele.contact_person_name;
  this.contact_mobile_number = ele.contact_mobile_number;
  this.contact_phone_number = ele.contact_phone_number;
  this.status = 1;
};

const EditHospital = function (ele) {
  this.hospital_id = ele.hospital_id;
  this.hospital_name = ele.hospital_name;
  this.city_name = ele.city_name ? ele.city_name : null;
  this.address = ele.address;
  this.zip_code = ele.zip_code;
  this.latitude = ele.latitude ? ele.latitude : null;
  this.longitude = ele.longitude ? ele.longitude : null;
  this.contact_person_name = ele.contact_person_name;
  this.contact_mobile_number = ele.contact_mobile_number;
  this.contact_phone_number = ele.contact_phone_number;
  this.status = 1;
};

function validateHospital(ele) {

  const schema = {
    hospital_name: Joi.string()
      .min(1)
      .max(200)
      .error(
        new Error(`{"errorCode":"HOSP0001", "error":"${ERROR.HOSPITAL.HOSP0001}"}`)
      )
      .required(),
    org_id: Joi.number().allow(null),
    country_id: Joi.number().required(),
    state_id: Joi.number().required(),
    district_id: Joi.number().required(),
    block_id: Joi.number().empty('').allow(null),
    village_id: Joi.number().empty('').allow(null),
    city_name: Joi.string().empty('').allow(null),
    address: Joi.string()
      .min(5)
      .max(500),
    zip_code: Joi.string(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .empty('').required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .empty('').required(),
    contact_person_name: Joi.string(),
    contact_mobile_number: Joi.number(),
    contact_phone_number: Joi.string().empty('').allow(null),
    status: Joi.number()
      .required()
  };
  return Joi.validate(ele, schema);
}

function validateEditHospitale(ele) {

  const schema = {
    hospital_id: Joi.number()
      .required(),
    hospital_name: Joi.string()
      .min(1)
      .max(200)
      .error(
        new Error(`{"errorCode":"HOSP0001", "error":"${ERROR.HOSPITAL.HOSP0001}"}`)
      )
      .required(),
    city_name: Joi.string().empty('').allow(null),
    address: Joi.string()
      .min(5)
      .max(500),
    zip_code: Joi.string(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .empty('').required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .empty('').required(),
    contact_person_name: Joi.string().empty('').allow(null),
    contact_mobile_number: Joi.number().empty('').allow(null),
    contact_phone_number: Joi.string().empty('').allow(null),
    status: Joi.number()
  };
  return Joi.validate(ele, schema);
}

const validateLatLong = (lat_long) => {
  try {

    if (!lat_long) { return false }

    const commaCount = (lat_long.match(/,/g) || []).length;
    console.log('commaCount', commaCount);

    if (commaCount != 1) { return false }

    return true

  } catch (error) {
    return false
  }
}



module.exports.Hospital = Hospital;
module.exports.validateHospital = validateHospital;
module.exports.EditHospital = EditHospital;
module.exports.validateEditHospitale = validateEditHospitale;
//module.exports.HospitalConfig = HospitalConfig;
//module.exports.validateHospitalConfig = validateHospitalConfig;
//module.exports.updateHospitalConfig = updateHospitalConfig;
//module.exports.validateUpdateHospitalConfig = validateUpdateHospitalConfig;
module.exports.validateLatLong = validateLatLong;
