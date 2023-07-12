let CryptoJS = require("crypto-js");
let moment = require("moment");

exports.HEADER = {
    authToken: "authorization"
};

exports.ageLimit = {
    MAX_AGE: 150,
    AGE_LIMIT: 45,
    MIN_AGE: 45,
    COMORBILITY_AGE_LIMIT: 45
}

exports.SERVICES = {
    MOBILE: "+91<mobile@anchal.com>",
    OTP_TRIALS: 3,
    NEXT_OTP: 60,
    email_To: "email_To",
    emailTo_feedback: "emailTo_feedback",
    newUser_sms: "newUser_sms",
    forgotPwd_sms: "forgotPwd_sms",
    update_mobno_sms: "update_mobno_sms",
    resetUser_sms: "resetUser_sms",
    verify_mobno_sms: "verify_sms",
    register_sms: "register_sms",
    session_sms: "session_sms",
    default_pass: "TICKETING_SYSTEM_123",
    campaign_id: "3737373",
    INIT_audit_logs_localFile_maxSize: 1
};

exports.OTPREASONS = {
    FORGOTPASSWORD: "FORGOT PASSWORD",
    UPDATEMOBNO: "UPDATE MOBILE NUMBER",
    VERIFYMOBNO: "VERIFY MOBILE NUMBER"
};

exports.CalenderMonths = {
    JAN: 1,
    FEB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12
}

exports.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports.decryptPayload = function (reqData) {
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, "INIT@$#&*(!@%^&");
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};

exports.decryptPayloadWithTimestamp = function (reqData, timestamp) {
    let key = "INIT@$#&*(!@%^&" + timestamp;
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};

exports.encryptPayload = function (reqData) {
    let key = "INIT@$#&*(!@%^&";
    if (reqData) {
        return CryptoJS.AES.encrypt(JSON.stringify(reqData), key).toString();
    } else {
        return "";
    }
};

exports.ageLimit = {
    MAX_AGE: 150,
    AGE_LIMIT: 18,
    MIN_AGE: 45,
    COMORBILITY_AGE_LIMIT: 45
}

exports.SMS_TEMPLATES = {
    HOSPITAL_REGISTRATION_WELCOME: {
        body: 'Welcome to AIEZE, AEMS! We are happy to see you onboarded. Your password is <PASSWORD>. Login with your registered mobile number via <URL> also you can download mobile app for doctors - AEMS',
    },
    HOSPITAL_REGISTRATION_OTP: {
        body: '<OTP> is the OTP for registration. This is valid for <TIME> mins. Do not share this OTP with anyone. - AIEZE',
    },
    ADMIN_USER_CREATION: {
        body: 'Dear <NAME>, Your login for AIEZE has been created successfully and the password is <PASSWORD>. To login, click <URL> - AIEZE',
    },
    ADMIN_FORGOT_PASSWORD: {
        body: '<OTP> is the OTP for forgot password. This is valid for <TIME> mins. Do not share this OTP with anyone. - AIEZE',
    },
    ADMIN_UPDATE_MOBILE_NUMBER_OTP: {
        body: '<OTP> is the OTP for update mobile number. This is valid for <TIME> mins. Do not share this OTP with anyone. - AIEZE',
    },
    ADMIN_RESET_PASSWORD: {
        body: 'Dear <NAME>, Your password has been reset successfully. Kindly login with password: <PASSWORD> - AIEZE',
    },
    PATIENT_REGISTRATION: {
        body: 'Dear <NAME>, you are successfully registered on AIEZE, CARE. Your Reference Id: <PATIENT_REF_ID>',
    },
    PATIENT_REGISTRATION_OTP: {
        body: '<OTP> is the OTP for registration. This is valid for <TIME> mins. Do not share this OTP with anyone. - AIEZE',
    },
    PATIENT_RESET_PASSWORD: {
        body: 'Dear <NAME>, Your password has been reset successfully. Kindly login with password: <PASSWORD> - AIEZE',
    },
    PATIENT_PRESCRIPTION: {
        body: 'Please find herewith the prescription for the consultation provided on <DATE> by <DOCTOR_NAME>',
    },
    PATIENT_SCHEDULED_APPOINTMENT: {
        body: 'Your appointment has been scheduled with <DOCTOR_NAME> on <DATE>',
    },
    PATIENT_CANCELLED_APPOINTMENT: {
        body: 'Your appointment with <DOCTOR_NAME> has been cancelled.',
    },
    PAYMENT_LINK: {
        body: 'Please proceed with payment of Rs. <AMOUNT>. You may pay by clicking on the link - <LINK>',
    },
    PAYMENT_REFUND: {
        body: 'Your refund of Rs. <AMOUNT> for appointment with <DOCTOR_NAME> has been successfully processed. amount should reflect in your account within 2-3 working days.',
    },
    PAYMENT_SUCCESS: {
        body: 'Thank you for the payment of Rs. <AMOUNT>. Please find herewith Payment Receipt <LINK>',
    },
    VC_LINK: {
        body: 'The video call with <NAME> has been initiated. Please tap the link <LINK> to join the video call<TIME>',
    },
    otpLogin: {
        body: '<otp> is the OTP for AIEZE. This is valid for <time> mins. Do not share this OTP with anyone. - AIEZE',
        template_id: '1107166520316700843',
        time: '3'
    },
    forgotPasswordOtp: {
        body: 'Your OTP to update password for HMIS Application is <otp>. It will be valid for <time> minutes. Please do not share this OTP with anyone',
        template_id: '1707164750832694407',
        time: '3'
    },
}

exports.exceed_attempts_limit = 50

exports.CACHE_TTL = {
    SHORT: 15 * 60,
    MID: 60 * 60,
    PAYMENT_LINK: 2 * 60 * 30,
    LONG: 24 * 60 * 60
};

exports.uniqueID = async function () {
    let d = new Date();
    let timestamp = d.getTime();

    return timestamp;
};

exports.admin_secret_key = {
    secret: '30c85dc9-a5e2-422b-9028-d83378597497'
}

exports.APP_CATEGORY_LEVELS = ["Admin", "Auditor"]
exports.GENDER = {
    1: 'Male',
    2: 'Female',
    3: 'Others'
}

exports.TICKET_STATUS = {
    1: 'Opened',
    2: 'In Progress',
    3: 'Closed',
    4: 'Deleted'
}