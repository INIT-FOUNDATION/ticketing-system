const jwt = require('jsonwebtoken');
const AUTH = require('../constants/AUTH');
const winston = require("winston");

function encodeToken30Days(data) {
    const token = jwt.sign(
        data,
        AUTH.SECRET_KEY,
        { expiresIn: AUTH.EXPIRY_HOURS.toString() + 'h' }
    );
    winston.info(`Token Generated Successfully!!`);
    return token;
}

function encodeGuestToken(data) {
    const token = jwt.sign(
        data,
        AUTH.SECRET_KEY,
        { expiresIn: AUTH.EXPIRY_HOURS.toString() + 'h' }
    );
    winston.info(`Guest Token Generated Successfully!!`);
    return token;
}

function encodePublicCertificateToken(data) {

    winston.info('----------AUTH.SECRET_KEY_CERT-------',AUTH.SECRET_KEY_CERT)
    winston.info('----------data-------',data)
    const token = jwt.sign(
        data,
        AUTH.SECRET_KEY_CERT,
        { expiresIn: AUTH.EXPIRY_MINS.toString() + 'm' }
    );
    winston.info(`Public Certificate Token Generated Successfully!!`);
    return token;
}

const encodeDashboardGuestToken = (data) => {
    const token = jwt.sign(
        data,
        AUTH.SECRET_KEY,
        { expiresIn: AUTH.DASHBOARD_GUEST_EXPIRY.toString() + 'm' }
    );
    winston.info(`Dashboard Guest Token Generated Successfully!!`);
    return token;
}

module.exports = {
    encodeToken30Days,
    encodeGuestToken,
    encodeDashboardGuestToken,
    encodePublicCertificateToken
}
