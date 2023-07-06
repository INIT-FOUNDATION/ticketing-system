const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const ERRORCODE = require('../constants/ERRORCODE');
const { STATUS, logger, CONST, JSONUTIL, redis } = require("ticketing-system-micro-common");
const s3CdnService = require('../services/s3-cdnService');

router.use(bodyParser.json({ limit: "5mb" }));
router.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));


router.get('/download', async (req, res) => {
    try {
        let file_name = req.query.file_name;
        if (!file_name) {
            return res.send(STATUS.BAD_REQUEST).send({ error_code: 'CDN00000', error: 'File name is required' });
        }

        const options = {
            Bucket: process.env.TS_S3_BUCKET,
            Key: file_name
        };

        let actual_file_name = file_name.split('/')
        try {
            res.setHeader("Content-Type", "application/vnd.android.package-archive");
            res.setHeader("Content-disposition", "filename=" + actual_file_name[2]);
            s3.getObject(options)
                .createReadStream()
                .on("error", function (err) {
                    res.status(500).json({ error: "Error -> " + err });
                })
                .pipe(res);
        } catch (ex) {
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ex);
        }
    } catch (error) {
        logger.error(error);
        res.send(STATUS.BAD_REQUEST).send(error);
    }
})


router.get('/file', async (req, res) => {
    try {
        let file_name = req.query.file_name;
        if (!file_name) {
            return res.send(STATUS.BAD_REQUEST).send({ error_code: 'CDN00000', error: 'File name is required' });
        }

        let redisData = await redis.GetKeyRedis(file_name);
        if (redisData) {
            let data = JSON.parse(redisData);
            const buffer = Buffer.from(data.base64, 'base64');
            res.header('Content-type', `${data.file_type.mime}`);
            res.header('Content-Disposition', `attachment;filename=${data.file_name}`);
            return res.status(STATUS.OK).send(buffer);
        }


        let data = await s3CdnService.getFileFromS3(file_name);
        if (data.buffer) {
            redis.SetRedis(file_name, data, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
            res.header('Content-type', `${data.file_type.mime}`);
            res.header('Content-Disposition', `attachment;filename=${data.file_name}`);
            res.status(STATUS.OK).send(data.buffer)
        } else {
            res.status(STATUS.NO_CONTENT).send();
        }
    } catch (error) {
        logger.error(error);
        res.send(STATUS.BAD_REQUEST).send(error);
    }
});


router.get('/fileDisplay', async (req, res) => {
    try {
        let file_name = req.query.file_name;
        if (!file_name) {
            return res.send(STATUS.BAD_REQUEST).send({ error_code: 'CDN00000', error: 'File name is required' });
        }

        let redisData = await redis.GetKeyRedis(file_name);
        if (redisData) {
            let data = JSON.parse(redisData);
            const buffer = Buffer.from(data.base64, 'base64');
            res.header('Content-type', `${data.file_type.mime}`);
            res.header('Content-Disposition', `inline;filename=${data.file_name}`);
            return res.status(STATUS.OK).send(buffer);
        }


        let data = await s3CdnService.getFileFromS3(file_name);
        if (data.buffer) {
            redis.SetRedis(file_name, data, CONST.CACHE_TTL.LONG).then().catch(err => console.log(err));
            res.header('Content-type', `${data.file_type.mime}`);
            res.header('Content-Disposition', `inline;filename=${data.file_name}`);
            res.status(STATUS.OK).send(data.buffer)
        } else {
            res.status(STATUS.NO_CONTENT).send();
        }
    } catch (error) {
        logger.error(error);
        res.send(STATUS.BAD_REQUEST).send(error);
    }
})

module.exports = router