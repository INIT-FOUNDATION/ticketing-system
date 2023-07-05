const ENCODE = require('./jwt.encoder');
let redis = require("../config/redis");

const generateToken = (userdata, req, done) => {
    if (userdata) {
        const token = ENCODE.encodeGuestToken(userdata);
        const build = {};
        build.encoded = token;
        build.plain = userdata;
        return done(null, build);
    } else return done('No Username');
};

const generatePublicCertificateToken = (userdata, req, done) => {
    if (userdata) {

        const token = ENCODE.encodePublicCertificateToken(userdata);
        const build = {};
        build.encoded = token;
        build.plain = userdata;
        redis.SetRedis(userdata.user_name, token, process.env.INIT_REDIS_SHORT_TTL)
            .then()
            .catch(err => console.error(err))
        return done(null, build);
    } else return done('No Username');
};

module.exports = {
    generateToken,
    generatePublicCertificateToken
};
