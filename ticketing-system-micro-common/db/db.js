let mysql = require('mysql');
let config = require('../config/db');

const redis = require('../config/redis');
const expiretime = 60 * 60 * 3;

var read_connection = mysql.createPool({
  connectionLimit: config.connectionLimit,
  host: process.env.INIT_HOST,
  database: process.env.INIT_DATABASE,
  user: process.env.INIT_USER,
  password: process.env.INIT_PASSWORD,
  multipleStatements: true
});

var write_connection = mysql.createPool({
  connectionLimit: config.connectionLimit,
  host: process.env.INIT_HOST,
  database: process.env.INIT_DATABASE,
  user: process.env.INIT_USER,
  password: process.env.INIT_PASSWORD,
  multipleStatements: true
});

const executeQuery = async function (dbQuery, isRedis = false) {
  return new Promise(async (resolve, reject) => {
    if (isRedis) {
      let redisResult = await redis.GetKeyRedis(dbQuery);
      if (redisResult && redisResult.length > 0) {

        redisResult = JSON.parse(redisResult);
        resolve(redisResult);
      } else {
        read_connection.getConnection((err, connection) => {

          if (err) {
            console.error(err)
            reject(err.message)
          }
          connection.query(dbQuery, (error, results, fields) => {
            connection.release();
            if (error) {
              console.error(error)
              reject(error.message)
            }
            redis.SetRedis(dbQuery, results, expiretime)
              .then()
              .catch(err => { })
            resolve(results)
          });
        });
      }
    } else {
      read_connection.getConnection((err, connection) => {

        if (err) {
          console.error(err)
          reject(err.message)
        }
        connection.query(dbQuery, (error, results, fields) => {
          connection.release();
          if (error) {
            console.error(error)
            reject(error.message)
          }
          resolve(results)
        });
      });
    }
  });
}

module.exports = read_connection;
module.exports = write_connection;
module.exports.executeQuery = executeQuery;
