
const express = require("express");

const helmet = require("helmet");
require("dotenv").config();
const { SECURITY, logger, appVersionMiddleWare } = require("ticketing-system-micro-common");
const app = express();

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

app.set('view engine', 'ejs');
app.use(helmet());
app.use(resolveCrossDomain, setAppVersiontoHeader);
app.use(function applyXFrame(req, res, next) {
  res.set('X-Frame-Options', 'DENY');
  next();
});
app.use(logger.printLog);
SECURITY(app);
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`[SERVER STARTED] Listening to port [${port}]`);
});

module.exports = server;
