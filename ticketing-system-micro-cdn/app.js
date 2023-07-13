//IMPORTS
const express = require("express");
const helmet = require("helmet");
require("dotenv").config();
const app = express();
let server;
const {
    SECURITY,
    logger,
} = require("ticketing-system-micro-common");

let workers = [];

var resolveCrossDomain = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Strict-Transport-Security", 'max-age=15552000');
    if ("OPTIONS" == req.method) {
      res.send(200);
    } else {
      next();
    }
  };
  
  let setAppVersiontoHeader = async function (req, res, next) {
    res.header("Access-Control-Expose-Headers", "Version");
    res.header("Version", "");
    res.header("Server", "");
    next();
  };

  app.use(helmet());
  app.use(resolveCrossDomain, setAppVersiontoHeader);
  app.use(function applyXFrame(req, res, next) {
    res.set('X-Frame-Options', 'DENY');
    next();
  });
  app.use(logger.printLog);
  // SECURITY(app);
  require("./startup/routes")(app, server);
  
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    logger.info(`[SERVER STARTED] Listening to port [${port}]`);
  });
  
module.exports = server;

