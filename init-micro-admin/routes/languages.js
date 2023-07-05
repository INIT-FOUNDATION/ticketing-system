const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const { STATUS, logger, DB_STATUS, s3Util } = require("init-micro-common");
const bodyParser = require("body-parser");
let ERRORCODE = require('../constants/ERRORCODE');
let languageService = require('../services/languageService');

router.use(bodyParser.json({
    limit: "5mb"
}));

router.use(bodyParser.urlencoded({
    extended: true,
    limit: "5mb"
}));

router.use(fileUpload());

router.get('/list', async (req, res) => {
    try {
        let allLanguages = await languageService.getAllLanguages();
        res.status(STATUS.OK).send(allLanguages);
    } catch (error) {
        logger.error(`Error occurred:: ${error}`);
        res.status(STATUS.BAD_REQUEST).send({ errorCode: "LANGSERVC000", error: ERRORCODE.LANGUAGE_ERR.LANGSERVC000 })
    }
});

module.exports = router;