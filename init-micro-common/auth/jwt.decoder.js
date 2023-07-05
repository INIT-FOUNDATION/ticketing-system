const jwt = require('jsonwebtoken');
const AUTH = require('../constants/AUTH');

function decodeToken(enc, done) {
    try {
        const decrypt = jwt.verify(enc, AUTH.SECRET_KEY)
        done(null, decrypt);
    } catch (ex) {
        done(ex);
    }
}

function decodePublicCertificateToken(enc, done) {
    try {
        const decrypt = jwt.verify(enc, AUTH.SECRET_KEY_CERT)
        done(null, decrypt);
    } catch (ex) {
        done(ex);
    }
}

module.exports = {
    decodeToken,
    decodePublicCertificateToken
}