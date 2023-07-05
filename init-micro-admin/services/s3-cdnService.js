const AWS = require("aws-sdk");
const fileType = require('file-type');
// Set region
AWS.config.update({
  region: process.env.REGION_NAME
});

let s3 = new AWS.S3({});
const { Readable } = require('stream');

const getFileFromS3 = async (file_name) => {
  return new Promise(async (resolve, reject) => {
    if (!file_name) {
      reject(null);
    }

    const options = {
      Bucket: process.env.INIT_S3_BUCKET,
      Key: file_name
    };

    try {
      const data = await s3.getObject(options).promise();
      const stream = Readable.from(data.Body);
      let file_type = await fileType.stream(stream);
      let objJsonB64 = Buffer.from(data.Body).toString("base64");
      let file_ext = file_type.fileType;
      if (!file_ext) {
        if (data.ContentType == 'image/svg+xml') {
          file_ext = { ext: 'svg', mime: data.ContentType }
        }
      }

      let file_data = {
        buffer: data.Body,
        file_type: file_ext,
        file_name: `download.${file_ext.ext}`,
        base64: objJsonB64
      }
      resolve(file_data);
    } catch (ex) {
      reject(ex);
    }
  })
}

module.exports = {
  getFileFromS3
}