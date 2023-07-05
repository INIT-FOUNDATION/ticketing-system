
const logger = require("../config/logger");
const axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');

const sendMessage = async (mobile, message, image = '') => {
    try {

        if (!mobile || !message) {
            throw new Error('Missing Parameters')
        }

        const apiHost = process.env.WHATSAPP_API_HOST;
        const apiKey = process.env.WHATSAPP_API_KEY;
        const apiURL = `http://${apiHost}/api/send_whatsapp?api_key=${apiKey}&text=${encodeURIComponent(message)}&mobile=${mobile}&img1=${image}`
        console.log('---------------- WhatsApp ----------------------');
        console.log(apiURL);
        const response = await axios.get(apiURL);
        console.log('---------------- WhatsApp Response----------------------');
        console.log(response.data);
        return response;
    } catch (error) {
        logger.error(error)
        throw error;
    }
}


module.exports = {
    sendMessage
}