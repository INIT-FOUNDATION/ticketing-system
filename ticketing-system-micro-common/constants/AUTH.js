exports.SECRET_KEY = "INIT_2021";
exports.SECRET_KEY_CERT = "INIT_CERT_2021";
exports.EXPIRY_DAY = 1;
exports.EXPIRY_HOURS = 8;
exports.EXPIRY_MINS = 15;

exports.API = {
    PUBLIC: [
        "/api/v1/user/health",
        "/api/v1/auth/health",
        "/api/v1/admin/health",
        "/api/v1/ticket/health",
        "/api/v1/auth/login",
        "/api/v1/communication/health",
        "/api/v1/crm/health",
        "/api/v1/registration/health",
        "/api/v1/appointment/health",
        "/api/v1/registrationdemo/health",
        "/api/v1/auth/validateToken",
        "/api/v1/auth/setConfig",
        "/api/v1/admin/user/password_policy",
        "/api/v1/admin/mobile/appVersion",
        "/api/v1/user/verifyMobileNumber",
        "/api/v1/user/verifyForgotPasswordOtp",
        "/api/v1/user/resetPassword",
        "/api/v1/user/updatePassword",
        "/api/v1/registration/payment/summary/:orderID",
        "/api/v1/registration/payment/verify/order",
        "/api/v1/registration/zoom/signature",
        "/api/v1/registration/zoom/meeting",
        "/api/v1/registration/zoom/getMeetingDetails/:id",
        "/api/v1/registration/payment/createOrder",
        // "/api/v1/registration/patient/basicRegistration", //TODO: To be removed     
        "/api/v1/registration/payment/summary/:refID",
        "/api/v1/registration/payment/callback/:refID",

        "/api/v1/teamplate/crm/addEmailTemplate",
        "/api/v1/teamplate/crm/updateEmailTemplate",
        "/api/v1/teamplate/crm/getEmailTemplateGrid",

        "/api/v1/teamplate/crm/addSMSTemplate",
        "/api/v1/teamplate/crm/updateSMSTemplate",
        "/api/v1/teamplate/crm/getSMSTemplateGrid",

        "/api/v1/teamplate/crm/addWhatsappTemplate",
        "/api/v1/teamplate/crm/updateWhatsappTemplate",
        "/api/v1/teamplate/crm/getWhatsappTemplateGrid",

        "/api/v1/crm/lead/addLead",
        "/api/v1/crm/contact",

        "/api/v1/auth/generateOTP",
        "/api/v1/auth/validateOTP",
        "/api/v1/auth/getOtp",
        "/api/v1/auth/verifyOtp",

        "/api/v1/auth/patient/generateOTP",
        "/api/v1/auth/patient/validateOTP",
        "/api/v1/auth/patient/setPin",
        "/api/v1/auth/patient/loginByPin",
        "/api/v1/auth/patient/getSignUpOTP",

        "/api/v1/auth/patient/getResetPinOTP",
        "/api/v1/auth/patient/verifyResetPinOTP",
        "/api/v1/auth/patient/resetPin",

        "/api/v1/registration/master/getPatientFormDetails",

        "/api/v1/registration/app/patient/signUp",

        "/api/v1/admin/location/states",
        "/api/v1/admin/location/districts/:stateId",
        "/api/v1/admin/location/getPincodes/:districtId",

        "/api/v1/crm/contact",
        "/api/v1/crm/onboardTrack",

        "/api/v1/registration/hospitalAdmin/sendOTP",
        "/api/v1/registration/hospitalAdmin/validate",
        "/api/v1/registration/hospitalAdmin/register",
        "/api/v1/admin/cdn/file",
        "/api/v1/admin/cdn/download",
        "/api/v1/admin/cdn/fileDisplay",
        "/api/v1/appointment/doctor/search",
        "/api/v1/registration/hospitalAdmin/register",
        "/api/v1/registration/hospitalAdmin/validate",
        "/api/v1/registration/hospitalAdmin/sendOTP",
        "/api/v1/registration/hospitalAdmin/registerDoctor"
    ],
    REGISTRATION: [
        "/api/v1/registration/createCustomer"
    ],
    PATIENT: [
        "/api/v1/admin/role/getCombinedAccessList/:user_id/:role_id",
        // "/api/v1/user/getLoggedInUserInfo",
        "/api/v1/registration/patient/getAppointmentGrid",
        "/api/v1/registration/patient/uploadPatientDocument",
        "/api/v1/registration/patient/downloadPatientDocument",
        "/api/v1/registration/patient/getPatientDocuments"
    ],
    PATIENT_V1: [
        "/api/v1/user/getLoggedInUserInfo",
        "/api/v1/appointment/doctor/search",
        "/api/v1/registration/app/patient/getPatientProfile",
        "/api/v1/registration/app/patient/updatePatientProfile",
        "/api/v1/registration/app/patient/uploadProfilePic",
        "/api/v1/registration/app/patient/download/profilePic",
        "/api/v1/registration/patient/downloadPrescription",
        "/api/v1/auth/patient/signOut",
        "/api/v1/appointment/patient/bookAppointment",
        "/api/v1/appointment/patient/rescheduleAppointment",
        "/api/v1/appointment/patient/cancelAppointment",
        "/api/v1/appointment/patient/getAppointmentDetails",
        "/api/v1/appointment/doctor/getSlotsByDoctor",
        "/api/v1/appointment/doctor/getDoctorDetails/:doc_id",
        "/api/v1/appointment/doctor/getRosterDetails/:roster_id",
        "/api/v1/appointment/patient/getAppointments",
        "/api/v1/appointment/payment/callback/:refID",
        "/api/v1/appointment/payment/getPaymentDetails",
    ],
    ADMIN: [
    ],
    GUEST: [
    ]
};


