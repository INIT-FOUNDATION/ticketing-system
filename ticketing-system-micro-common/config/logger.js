var winston = require("winston");
const { format } = require("winston");
const { combine, timestamp, label, printf } = format;
const URLS = require('../constants/URLS');
var mysql = require("mysql");
const { match, parse } = require('matchit');
var auditApiLists = require('../constants/URLS').AUDIT.AUDIT_API_LIST;
var loggerApiLists = require('../constants/URLS').AUDIT.LOGGER_API_LIST;

const auditRoutes = auditApiLists.map(parse);
const loggerRoutes = loggerApiLists.map(parse);

var auditPool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.INIT_AUDIT_HOST,
    database: process.env.INIT_AUDIT_DATABASE,
    user: process.env.INIT_AUDIT_USER,
    password: process.env.INIT_AUDIT_PASSWORD
});

var descriptionArray = {

    "login": "LOGGED IN SUCCESSFULLY",
    "logout": "LOGGED OUT SUCCESSFULLY",
};

const tsFormat = () =>
    moment()
        .utcOffset("330")
        .format("YYYY-MM-DD hh:mm:ss")
        .trim();

var options = {
    file: {
        level: "info",
        colorize: false,
        timestamp: tsFormat,
        filename: `./logs/hmis.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 2
    },
    debugFile: {
        level: "debug",
        timestamp: tsFormat,
        filename: `./logs/init-debug.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 2,
        colorize: true
    },
    errorFile: {
        level: "error",
        timestamp: tsFormat,
        filename: `./logs/init-error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 2,
        colorize: true
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: true
    }
};


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message} `;
});

let logger = winston.createLogger({
    format: combine(
        label({ label: `${process.env.MODULE}` }),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [

        new winston.transports.File(options.errorFile),
        new winston.transports.Console(options.console)

    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        logger.info(" FROM EVENT " + message);
    }
};

function printLog(req, res, next) {
    const url = req.url;

    var apiToAudit = Object.keys(match(req.originalUrl, auditRoutes)).length == 0 ? "" : "AUDIT";
    var apiToLog = Object.keys(match(req.originalUrl, loggerRoutes)).length == 0 ? "" : "LOG";

    var auditOrLog = apiToAudit ? apiToAudit : apiToLog ? apiToLog : "";

    if (url.includes("api") && auditOrLog) {

        const oldWrite = res.write;
        const oldEnd = res.end;

        const chunks = [];

        res.write = (...restArgs) => {
            chunks.push(Buffer.from(restArgs[0]));
            oldWrite.apply(res, restArgs);
        };

        res.end = (...restArgs) => {
            if (restArgs[0]) {
                chunks.push(Buffer.from(restArgs[0]));
            }
            const body = Buffer.concat(chunks).toString("utf8");

            var logData = {
                time: new Date(),
                from_ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
                method: req.method,
                status: res.statusCode,
                original_uri: req.originalUrl,
                uri: req.url,
                description: getDescription(req.url),
                request_data: req.body,
                response_data: body,
                referer: req.headers.referer || "",
                ua: req.headers["user-agent"]
            };

            oldEnd.apply(res, restArgs);

            logData.module_name = `${process.env.MODULE}`;

            logData.date_inserted = new Date();

            if (logData.request_data != null && logData.request_data != "")
                logData.request_data = JSON.stringify(logData.request_data);

            if (
                req.plainToken != null &&
                req.plainToken != "" &&
                req.plainToken != "undefined") {
                logData.user_name = req.plainToken.user_name;
            }

            logData.indicator = auditOrLog;

        };
        next();
    } else {
        logger.info("NOT LOGGED IN AUDIT LOG : " + req.url);
        next();
    }

}

function getDescription(uri) {
    var lastIndex = uri.lastIndexOf("/");
    if (lastIndex == 0)
        lastIndex = uri.length;
    else
        lastIndex = lastIndex - 1;
    var key = uri.substring(1, lastIndex);
    return descriptionArray[key];
}

module.exports = logger;
module.exports.printLog = printLog;
module.exports.auditPool = auditPool;
