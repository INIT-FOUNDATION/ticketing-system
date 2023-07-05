const request = require('request');

const sendMessage = async (mobile_numbers, template_id, parameters) => {
    try {
        let sendTextPayLoad = {
            "appid": process.env.WHATSAPP_APP_ID,
            "deliverychannel": "whatsapp",
            "message": {
                "template": template_id,
                "parameters": parameters
            },
            "destination": [
                {
                    "waid": mobile_numbers
                }
            ]
        }

        const headers = {
            'Content-Type': 'application/json',
            'key': process.env.WHATSAPP_SERVICE_KEY
        }

        return new Promise(function(resolve, reject) {
            request.post({
                headers: headers,
                url: 'https://api.imiconnect.in/resources/v1/messaging',
                body: JSON.stringify(sendTextPayLoad)
            }, function(error, response, body){
                    if (error) {
                        console.log(error)
                        reject(error)
                    } else {
                        resolve(response)
                    }
            });
        });

    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendMessage
}