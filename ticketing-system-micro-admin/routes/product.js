const express = require("express");
const router = express.Router();
const { STATUS } = require("ticketing-system-micro-common");

let async = require('async');

let roles = require('../models/roles');
let ERRORCODE = require('../constants/ERRORCODE');
const CONSTANT = require('../constants/CONST');
const productService = require("../services/productService");

router.post("/getProductList", async (req, res) => {
  try {

    const reqUserDetails = req.plainToken;
    let pageSize = req.body.pageSize ? req.body.pageSize : 0;
    let currentPage = req.body.currentPage ? req.body.currentPage : 0;
    currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

    const block_id = req.body.block_id ? req.body.block_id : null;
    const site_id = req.body.site_id ? req.body.site_id : null;
    const vendor_id = req.body.vendor_id ? req.body.vendor_id : null;
    const search_model = req.body.search_model ? req.body.search_model : null;
    const search_serial = req.body.search_serial ? req.body.search_serial : null;

    const reqParams = {
      pageSize,
      currentPage,
      block_id,
      site_id,
      vendor_id,
      search_model,
      search_serial
    };

    const productData = await productService.getProductList(reqParams)
    res.send(productData)

  } catch (error) {
    console.log("catch error", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"COMMON0000", "error":"${ERRORCODE.ERROR.COMMON0000}"}`);
  }
});

router.post("/getProduct", async (req, res) => {
  try {

    const product_id = req.body.product_id ? req.body.product_id : null;
    const serial_number = req.body.serial_number ? req.body.serial_number : null;
    const model_number = req.body.model_number ? req.body.model_number : null;

    const reqParams = {
      product_id,
      serial_number,
      model_number
    };

    const productData = await productService.getProduct(reqParams)
    res.send(productData)

  } catch (error) {
    console.log("catch error", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"COMMON0000", "error":"${ERRORCODE.ERROR.COMMON0000}"}`);
  }
});

module.exports = router;
