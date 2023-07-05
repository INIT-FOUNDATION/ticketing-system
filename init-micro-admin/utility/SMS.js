const { logger } = require("init-micro-common");

var AWS = require('aws-sdk');
var aws_region = process.env.REGION_NAME;
var applicationId = process.env.INIT_PINPOINT;
var messageType = "TRANSACTIONAL";
var senderId = "INIT";

function sendSMS(originationNumber, message) {
    AWS.config.update({ region: aws_region });

    //Create a new Pinpoint object.
    var pinpoint = new AWS.Pinpoint();
    // Specify the parameters to pass to the API.
    var params = {
        ApplicationId: applicationId,
        MessageRequest: {
            Addresses: {
                [originationNumber]: {
                    "BodyOverride": message,
                    "ChannelType": "SMS"
                }
            },
            MessageConfiguration: {
                SMSMessage: {
                    Body: message,
                    MessageType: messageType,
                    SenderId: senderId
                }
            }
        }
    };

    //Try to send the message.
    pinpoint.sendMessages(params, function (err, data) {
        if (err) {
            logger.debug("SMS sent failed : " + err.message);
        } else {
            logger.debug("Message sent successful : Message Id  : " +
                data['MessageResponse']['Result'][originationNumber]['StatusMessage']);
        }
    });

}

module.exports.sendSMS = sendSMS;