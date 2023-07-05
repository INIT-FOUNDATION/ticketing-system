const AWS = require('aws-sdk');
const mailcomposer = require('mailcomposer')

// Set region
AWS.config.update({
  region: process.env.REGION_NAME
});

const params = {
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: 'HTML_FORMAT_BODY',
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Test email',
    },
  },
  Source: process.env.INIT_FROM_EMAIL,
  ReplyToAddresses: [
    process.env.INIT_FROM_EMAIL,
  ],
};

const sendMail = async (email_to, full_name, subject, html_body) => {
  return new Promise((resolve, reject) => {

    console.log('---in sendmail ---');
    try {
      send([email_to], [], [], html_body, subject, (err, result) => {
        if (err) {
          console.log('----send mail error ----', err);
          return reject(err)
        } else {
          return resolve();
        }
      });
    }
    catch (err) {
      return reject(err);
    }
  })
}

const send = (to, cc, bcc, html, subject, done) => {
  const temp = {
    ...params,
  };

  if (Array.isArray(to)) {
    temp.Destination = {
      ToAddresses: to,
      CcAddresses: cc,
      BccAddresses: bcc,
    };
  } else {
    temp.Destination = {
      ToAddresses: [
        to,
      ],
      CcAddresses: [
        cc,
      ],
      BccAddresses: [
        bcc
      ]
    };
  }

  temp.Message.Body.Html.Data = html;
  temp.Message.Subject.Data = subject;
  temp.Source = process.env.INIT_FROM_EMAIL;

  const sendPromise = new AWS.SES().sendEmail(temp).promise();

  sendPromise.then(
    (value) => {
      done(null, value);
    },
  ).catch(
    (err) => {

      done(err);
    },
  );
};

const sendAttachmentMail = (to_email, subject, textBody, attachments) => {

  const mail = mailcomposer({
    from: process.env.INIT_FROM_EMAIL,
    replyTo: process.env.INIT_FROM_EMAIL,
    to: to_email,
    subject: subject,
    html: textBody,
    attachments: attachments
  });

  return new Promise(async (resolve, reject) => {
    let sendRawEmail;
    mail.build((error, message) => {
      if (error) {
        reject(error)
      }
      sendRawEmail = new AWS.SES().sendRawEmail({ RawMessage: { Data: message } }).promise();
    });
    resolve(sendRawEmail)
  });

}


module.exports = {
  send,
  sendMail,
  sendAttachmentMail
};