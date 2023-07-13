exports.ERROR = {

    COMMON0000: "Something Went Wrong",
    COMMON0001: "%s is mandatory",
    COMMON0002: "%s is invalid",
    COMMON0003: "Invalid %s %s",
    COMMON0004: "%s %s does not belong to %s %s",
    COMMON0005: "Address must contain only English Alphabets ('a-z' and 'A-Z'), Numbers '0-9', Dot '.', Comma ',', Hyphen '-', Open parenthesis '(' and Close parenthesis ')'",

    ROLE000001: "Role Name already exists",
    ROLE000002: "Role Name must be upto 50 characters",
    ROLE000003: "Role Description must be upto 100 characters",
    ROLE000004: "Name must contain only English Alphabets (“a-z” and “A-Z”), Numbers “0-9”, Dot “.”, Hyphen “-”, Ampersand “&”, Open parenthesis “(” and Close parenthesis “)”",
    ROLE000005: "Description must contain only English Alphabets (“a-z” and “A-Z”), Numbers “0-9”, Dot “.”, Hyphen “-”, Ampersand “&”, Open parenthesis “(” and Close parenthesis “)”",
    ROLE000006: "Menu Name must be upto 50 characters",
    ROLE000007: "Menu Name already exists",
    ROLE000008: "Menu Description must be upto 100 characters",
    ROLE000009: "Menu Name already exists",
    ADMVER0001: "No record found ",
    ADMROL0002: "Status cannot be changed as X Active Users are associated with the Role In Order to change a Role to Inactive, please make sure no Active Users are associated with it",
    ADMROL0003: "User status cannot be changed to Active as User is associated with Inactive Role",
    ADMROL0004: "isActive value is mandatory ",
    ADMROL0005: "Mobile Number is already registered ",
    ADMROL0006: "Role is Inactive ",
    ADMROL0007: "No files were uploaded. ",
    ADMROL0008: "File format should be PNG, JPEG ",
    ADMROL0009: "File Upload Success",
    ADMROL0010: "Invalid file",
    ADMROL0011: "User Id is mandatory",
    ADMROL0012: "Invalid Role",
    ADMROL0013: "Display Name is mandatory",
    ADMROL0014: "Mobile Number is invalid",

    ADMROS0001: "Slot Already Present within that time range",
    ADMSOS0001: "Shift Already Present within that time range",

    USRRES0001: "Admin Email not found ",
    USRRES0002: "User not found ",
    USRRES0003: "User is already allocated to Session site",
    USRRES0004: "Date Selection is mandatory",
    USRRES0005: "Selected Date is Invalid",
    USRAUT0012: "OTP is Required",
    USRAUT0013: "txnId is Required",
    USRAUT0014: "Invalid OTP",

    LOCVALID01: "Invalid state %s",
    LOCVALID02: "Invalid district %s",
    LOCVALID03: "District %s does not belong to state %s",
    LOCVALID04: "Invalid block %s",
    LOCVALID05: "Block %s does not belong to district %s",
    LOCVALID06: "State %s should be same as logged in user state %s",
    LOCVALID07: "District %s should be same as logged in user district",
    LOCVALID08: "Block %s should be same as logged in user block",
    LOCVALID09: "State Name should not be numeric",
    LOCVALID10: "District Name should not be numeric",
    LOCVALID11: "Block Name should not be numeric",
    LOCVALID12: "Facility Name should not be numeric",



}

exports.USER = {
    USRRESULT0001: "User deleted successfully",
    USRPRF00027: "No files were uploaded ",
    USRPRF00028: "Invalid File ",
    USRPRF00029: "File format should be PNG, JPEG ",
    USRPRF00030: "Something went wrong!"
};

exports.HOSPITAL = {
    HOSP0000: "Something Went Wrong",
    HOSP0001: "Hospital Name must be upto 200 characters",
    HOSP0002: "City Name must be upto 200 characters",
    HOSP0003: "Hospital Name already exists",
    HOSP0004: "Hospital Config already exists",
    HOSP0005: "Hospital Id is not exists",
    HOSP0006: "Invalid dept_list parameter",
    HOSP0007: "Invalid unit_list parameter",
    HOSP0008: 'Hospital Id is required',    
    HOSP0009: 'Organization Id is required' ,
    HOSP0010: 'Invalid latitude and longitude'
};

exports.ORGANIZATION = {
    ORGVALID000: "Something Went Wrong",
    ORGVALID001: "Invalid Organization Name",
    ORGVALID002: "Invalid Contact Person Name",
    ORGVALID003: "Invalid Contact Mobile Number",
    ORGVALID004: "Invalid Contact Phone Number",
    ORGVALID005: "Organization Name Already Exists",
    ORGVALID006: "No Organization Found",
    ORGVALID007: "No Organizations Found",
};


exports.DEPARTMENT = {
    DEPTVALID000: "Something Went Wrong",
    DEPTVALID001: "Invalid Department Name",
    DEPTVALID002: "Department Name Already Exists",
    DEPTVALID003: "Department Already Exists in Hospital",
};

exports.BED_ERROR = {
    BEDVALID000: "Something Went Wrong",
    BEDVALID001: "Invalid Bed Config",
    BEDVALID002: "Bed Count can not be changed",
    BEDVALID003: "Hospital Id is Required",
    BEDVALID004: "Bed Price is Required",
    BEDVALID005: "Ward Id is Required",
    BEDVALID006: "Bed Count is Required",
    BEDVALID007: "Ward Label Already Present",
    BEDVALID008: "Duplicate Ward Labels Present",
    BEDVALID009: "Invalid word_hosp_id",
    BEDVALID010: "Bed Code Already Exists",
}


exports.SERVICE_ERR = {
    SERVALID000: "Something Went Wrong",
    SERVALID001: "Service Name Already Exists",
    SERVALID002: "Hospital Id is Required",
    SERVALID003: "Service Id is Required",
}


exports.SPECIALITY_ERR = {
    SPECVALID000: "Something Went Wrong",
    SPECVALID001: "Speciality Name Already Exists",
    SPECVALID002: "Invalid Speciality Name ",
    SPECVALID003: "Service Id is Required",
}


exports.LANGUAGE_ERR = {
    LANGSERVC000: "Something Went Wrong",
    LANGSERVC001: "Speciality Name Already Exists",
}

exports.PRESCRIPTIONSETTINGS = {
    PRESCRPTNSETT0001: "Something Went Wrong",
    PRESCRPTNSETT0002: "Invalid request",
}