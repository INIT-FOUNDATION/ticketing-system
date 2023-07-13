//Name Validation (Allow only “.”,  “-“,  “( )”  ,”0-9”, “a-z”, “A-Z”)
let nameRegex = /^[ A-Za-z0-9.\-()]*$/;
//User Names Field Validation (Allow only  “.”,  “-“,  “( )” , “a-z”, “A-Z”)
let usernameRegex = /^[ A-Za-z.\-()]*$/;
//Description Field Validation (Allow only “.”,  “,”, “-“,  “( )”  ,”0-9”, “a-z”, “A-Z”)
let descRegex = /^[ A-Za-z0-9.,\-()]*$/;
let roleNameRegex = /^[ A-Za-z0-9/.\-\&()]*$/;
let roledescRegex = /^[ A-Za-z0-9/.\-\&()]*$/;
let fileNameRegex = /^[ A-Za-z0-9_\-]*$/;


module.exports.fileNameRegex = fileNameRegex;
module.exports.nameRegex = nameRegex;
module.exports.usernameRegex = usernameRegex;
module.exports.descRegex = descRegex;
module.exports.roleNameRegex = roleNameRegex;
module.exports.roledescRegex = roledescRegex;




