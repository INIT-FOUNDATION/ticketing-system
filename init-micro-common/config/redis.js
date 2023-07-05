let logger = require('../config/logger'),
    redis = require("redis");

let client = redis.createClient(process.env.INIT_REDIS_PORT, process.env.INIT_REDIS_HOST, {});

let clientReader;
if (process.env.INIT_REDIS_HOST_READER) {
    clientReader = redis.createClient(process.env.INIT_REDIS_PORT, process.env.INIT_REDIS_HOST_READER, {});
} else {
    logger.info("Redis replica host not found. falling back to the primary redis host");
    clientReader = redis.createClient(process.env.INIT_REDIS_PORT, process.env.INIT_REDIS_HOST, {});
}

isRedis = false;
isWriterRedis = false;

clientReader.on("connect", function () {
    logger.info("redis clientReader connected");
    isRedis = true;
});

clientReader.on("error", function (err) {
    logger.error("redis replica connection error " + err);
    throw err;
});

clientReader.on("end", function (err) {
    logger.info("redis replica connection end " + err);
});

client.on("connect", function () {
    logger.info("redis client connected");
    isWriterRedis = true;
});

client.on("error", function (err) {
    logger.error("redis primary connection error " + err);
    throw err;
});

client.on("end", function (err) {
    logger.info("redis primary connection end " + err);
});

function SetRedis(key, val, expiretime) {
    return new Promise(function (resolve, reject) {
        if (isRedis) {
            let newVal = JSON.stringify(val);
            client.set(key, newVal);
            if (expiretime) {
                client.expire(key, expiretime)
            }

            resolve(redis.print);
        } else {
            reject('err');
        }
    });
}

function GetKeys(key, isScan = false) {
    return new Promise(async (resolve, reject) => {
        if (isRedis) {

            if (isScan) {
                clientReader.keys(key, function (err, reply) {
                    if (err) {
                        reject(err);
                    }

                    if (reply) {
                        resolve(reply);
                    } else {
                        reject('err');
                    }
                });
            } else {
                clientReader.exists(key, function (err, reply) {
                    if (err) {
                        reject(err);
                    }

                    if (reply) {
                        resolve(key);
                    } else {
                        resolve(null);
                    }

                });
            }

        } else {
            reject('err');
        }
    });
}

function GetRedis(key) {
    return new Promise(function (resolve, reject) {
        if (isRedis) {
            clientReader.mget(key, function (err, reply) {
                if (err) {
                    reject(err);
                }
                if (reply) {
                    resolve(reply);
                } else {
                    reject('err');
                }

            });
        } else {
            reject('err');
        }
    });
}

function GetKeyRedis(key) {
    return new Promise(function (resolve, reject) {
        if (isRedis) {
            clientReader.get(key, function (err, reply) {
                if (err) {
                    reject(err);
                }
                if (reply) {
                    resolve(reply);
                } else {
                    resolve(false);
                }

            });
        } else {
            resolve(false);
        }
    });
}

function delRedis(keyPattern) {
    return new Promise(async function (resolve, reject) {
        if (isWriterRedis) {
            let getKeys = await GetKeys(keyPattern);
            if (getKeys && getKeys.length > 0) {
                client.del(getKeys, function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    if (reply) {
                        resolve(reply);
                    } else {
                        resolve();
                    }

                });
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
}

const deleteKey = async (key) => {
    return new Promise(async (resolve, reject) => {
        client.del(key, function (err, reply) {
            if (err) {
                reject(err);
            }
            if (reply) {
                resolve(reply);
            } else {
                resolve();
            }
        });
    });
}

function IncrementRedis(key, expiretime) {
    return new Promise(function (resolve, reject) {
        if (isRedis) {
            client.INCR(key);
            if (expiretime) {
                client.expire(key, expiretime)
            }
            resolve(redis.print);
        } else {
            reject('err');
        }
    });
}

function decrementRedis(key, value) {
    return new Promise(function (resolve, reject) {


        if (isRedis) {
            client.DECRBY(key, value);
            resolve(redis.print);
        } else {
            reject('err');
        }
    });
}

function getTTL(key) {
    return new Promise(function (resolve, reject) {
        if (isRedis) {
            client.TTL(key, function (err, reply) {
                if (err) {
                    reject(err);
                }
                if (reply) {
                    resolve(reply);
                } else {
                    resolve(false);
                }
            });
        } else {
            resolve(false);
        }
    });
}

module.exports = client;
module.exports.SetRedis = SetRedis;
module.exports.GetKeys = GetKeys;
module.exports.GetRedis = GetRedis;
module.exports.GetKeyRedis = GetKeyRedis;
module.exports.delRedis = delRedis;
module.exports.IncrementRedis = IncrementRedis;
module.exports.decrementRedis = decrementRedis;
module.exports.getTTL = getTTL;
module.exports.deleteKey = deleteKey;
