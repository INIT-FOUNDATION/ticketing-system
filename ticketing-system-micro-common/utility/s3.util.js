
const logger = require("../config/logger");
const AWS = require("aws-sdk");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1"
});
s3 = new AWS.S3({});

const uploadFile = async (fileName, fileBody, bucketName, contentType = false) => {
    
    try {

        let params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBody  
        };

        if (contentType) {
            params.ContentType = `application/${fileName.split(".")[1]}`
        }

        const data = await s3.upload(params).promise()
        const { Location } = data
        return Location


    } catch (error) {
        logger.error(error);
        throw new Error(error.message);
    }

}


const readFile = async (fileName, bucketName) => {

    try {

        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const data = await s3.getObject(params).promise()

        return data;

    } catch (error) {
        //throw new Error(error.message);
        console.log(error.message)
        return {Body:'[]'};
    }
}


const getPresignedUrl = async (fileName, signedUrlExpireSeconds, bucketName) => {
    return new Promise(async (resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: signedUrlExpireSeconds
        };

        await s3.getSignedUrl('getObject', params, (err, res) => {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                resolve(res)
            }
        });
    })
}


const deleteFile = async (fileName, bucketName) => {

    try {

        const params = {
            Bucket: bucketName,
            Key: fileName
        };

        const data = await s3.deleteObject(params).promise()
        return data;

    } catch (error) {
        //throw new Error(error.message);
        console.log(error.message)
        return {Body:'[]'};
    }
}
module.exports = {
    uploadFile,
    readFile,
    getPresignedUrl,
    deleteFile
}