
const AWS = require('aws-sdk');
const region_name = process.env.REGION_NAME

AWS.config.update({
    region: region_name
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

function commonService(action, params, cb) {
    dynamodb[action](params, function (err, data) {
        if (err) {

            cb(err, null);
        } else {



            cb(null, data);
        }
    });
}

module.exports = dynamodb;
module.exports.commonService = commonService;

