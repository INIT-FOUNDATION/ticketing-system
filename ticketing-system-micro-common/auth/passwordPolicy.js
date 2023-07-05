const bcrypt = require('bcryptjs');
let userService = require('../services/userService');

const validate_password = async (id, password, type) => {
    return new Promise(async (resolve, reject) => {

        try {
            const salt = await bcrypt.genSalt(10);
            let hashedPass = await bcrypt.hash(password, salt);
            const flags = {
                expiryFlag: false,
                lengthFlag: false,
                regexFlag: false,
                historyFlag: false,
                loginAttemptsFlag: false
            }
            const start = /^/
            const alpha = /(?=.*?[A-Z])(?=.*?[a-z])/
            const numeric = /(?=.*?[0-9])/
            const special = /(?=.*?[!@#$&*])/
            const length = /.{8,}$/

            const userDetails = await userService.getUserDtls(id);
            let pwdComplexity = await userService.getPasswordComplexity();
            pwdComplexity = pwdComplexity[0];
            const userPasswordHistory = await userService.getPasswordHistory(userDetails.username);
            let userOldPasswords = [];

            passwordExpiry = pwdComplexity.password_expiry;
            userPasswordLength = pwdComplexity.min_password_length;
            invalidAttempts = pwdComplexity.max_invalid_attempts;
            userInvalidAttempts = userDetails.invalid_attempts;
            passwordHistory = pwdComplexity.password_history;

            if (userPasswordHistory && userPasswordHistory.length > 0) {
                for (let i = 0; i < passwordHistory; i++) {
                    if (userPasswordHistory[i]) {

                        await bcrypt.compare(password, userPasswordHistory[i].password).then(function (result) {

                            if (result == true) {
                                flags.historyFlag = true;
                            } else if (flags.historyFlag !== true) {
                                flags.historyFlag = false;
                            }
                        });
                    }

                }
            }

            const passwordLastUpdated = userDetails.password_last_updated ? userDetails.password_last_updated : userDetails.date_created;
            flags.lengthFlag = (password.length >= userPasswordLength) ? true : false;
            flags.loginAttemptsFlag = (userInvalidAttempts <= invalidAttempts) ? true : false;
            const date = new Date(passwordLastUpdated);
            expiryDate = new Date(date.setDate(date.getDate() + passwordExpiry)).toISOString();
            flags.expiryFlag = (new Date().toISOString() >= expiryDate) ? false : true;

            var str, strMsg = '';
            str = '^'
            if (type == 2) {

                if (flags.historyFlag || await bcrypt.compare(hashedPass, userDetails.current_password)) {
                    strMsg += `"New password must not match previous ${passwordHistory} passwords" `
                } else {
                    strMsg += ''
                }
            }
            if (pwdComplexity.max_invalid_attempts < userDetails.invalid_attempts) {
                strMsg += `Max. invalid attempts exceeded. Account is locked. \n`
            } else {
                strMsg += ``
            }
            if ((pwdComplexity.min_password_length <= password.length)) {
                strMsg += ``
            } else {
                strMsg += `Provide a password with atleast ${pwdComplexity.min_password_length} characters \n`
            }

            if (pwdComplexity.complexity && pwdComplexity.alphabetical) {

                if (password.match(alpha) !== null) {
                    str += alpha.source;
                } else {
                    str += alpha.source;
                    strMsg += 'Provide atleast one lower and uppercase alphabet \n'
                }
            } else {
                strMsg += ``
            }
            if (pwdComplexity.complexity && pwdComplexity.numeric) {
                if (password.match(numeric)) {
                    str += numeric.source;
                } else {
                    str += numeric.source;
                    strMsg += 'Provide atleast one number \n'
                }
            } else {
                strMsg += ``
            }
            if (pwdComplexity.complexity && pwdComplexity.special_chars) {
                if (password.match(special)) {
                    str += special.source;
                } else {
                    str += special.source;
                    strMsg += 'Provide atleast one special character \n'
                }
            } else {
                strMsg += ``
            }

            if (str) {
                str += '{'
                str += `${userPasswordLength}`
                str += '}'
            } else {
                str = `${userPasswordLength}`
            }

            if (pwdComplexity.complexity && (pwdComplexity.alphabetical || pwdComplexity.numeric || pwdComplexity.special_chars)) {
                const testRegex = new RegExp(str);
                flags.regexFlag = testRegex.test(password) ? true : false;
            } else if (pwdComplexity.complexity && !(pwdComplexity.alphabetical || pwdComplexity.numeric || pwdComplexity.special_chars)) {
                reject({
                    status: false,
                    message: `Select any Aplhabetical, Numeric or Special Characters in Password policy`
                });
            }

            if (flags.lengthFlag && flags.loginAttemptsFlag) {
                if ((pwdComplexity.complexity && flags.regexFlag || pwdComplexity.complexity == false)) {
                    if (type == 2 && flags.historyFlag) {
                        reject({ status: false, message: `${strMsg}` });
                    } else {
                        resolve({ status: true, message: "" });
                    }
                } else {
                    reject({ status: false, message: `"${strMsg}"` });
                }
            } else {
                reject({ status: false, message: `"${strMsg}"` });
            }

        } catch (error) {
            console.log("error", error);
            reject(error)
        }
    }).then((result) => {
        return result;
    }).catch((e) => {

        return e;
    });
}

module.exports = {
    validate_password
}