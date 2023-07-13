const express = require("express");
const bodyParser = require("body-parser");
const sanitizeRequest = require('express-sanitize-middleware');
const s3CDN = require('../routes/s3-cdn');
const { STATUS } = require('ticketing-system-micro-common');

module.exports = function (app, server) {
    app.use(express.json());
    //Enabling CORS
    app.use(function (err, req, res, next) {
        if (err) {
            return res.sendStatus(400); // Bad request
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.header("Server", "");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );
        next();
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use([
        sanitizeRequest({
            body: true,
            header: true,
            params: true,
            query: true
        })
    ])
    let removeCSVInjection = function (req, res, next) {
        //CSV Injection
        if (req.body) {
            const riskyChars = ["=", "+", "-", "@", "|"];
            for (let key in req.body) {
                if (req.body && req.body[key] && typeof req.body[key] == 'string') {
                    if (riskyChars.indexOf(req.body[key].charAt(0)) >= 0) {
                        req.body[key] = req.body[key].slice(1)
                    }
                    req.body[key] = req.body[key].replace(/>|<|=/g, '');
                }
            }
        }
        next()
    }

    app.use(removeCSVInjection)

    app.get('/api/v1/cdn/health', async (req, res) => {
        try {
            return res.status(STATUS.OK).send("CDN Service is Healthy");
        } catch (error) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    });

    app.use("/api/v1/cdn", s3CDN);
};