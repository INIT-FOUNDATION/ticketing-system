const express = require("express");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const {
  SECURITY,
  logger,
  appVersionMiddleWare,
  getModulesbyLocation
} = require("ticketing-system-micro-common");

var resolveCrossDomain = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  /*res.header("Access-Control-Expose-Headers",
  );*/
  res.header("Access-Control-Allow-Credentials", true);
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

let setAppVersiontoHeader = async function (req, res, next) {
  try {
    let versionNo = await appVersionMiddleWare();
    res.header("Version", versionNo);
    res.header("Server", "");
  } catch (err) {
    logger.error(err);
    res.header("Version", "");
    res.header("Server", "");
  } finally {
    next();
  }
};

let callGetModulesbyLocation = async function (req, res, next) {
  getModulesbyLocation(req);
  next();
};

app.set('view engine', 'ejs');
app.use(helmet());
app.use(resolveCrossDomain, setAppVersiontoHeader);

app.use(logger.printLog);

app.use(function applyXFrame(req, res, next) {
  res.set('X-Frame-Options', 'DENY');
  next();
});
SECURITY(app);
app.use(callGetModulesbyLocation);
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`[SERVER STARTED] Listening to port [${port}]`);
});

module.exports = server;
