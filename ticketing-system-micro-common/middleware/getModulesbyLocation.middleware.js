const getModulesbyLocation = (req) => {

    let token = req.plainToken;

    if (token) {
        let level = token.user_level;
        let country_id = token.country_id ? token.country_id : 1;

        req.initPayload = {};

        switch (level) {
            case 'National':
                req.initPayload.access = 'country_id = ' + country_id;
                req.initPayload.role_access = ['Admin', 'Auditor'];
                break;

            case 'Admin':
                req.initPayload.access = 'country_id = ' + country_id;
                req.initPayload.role_access = ['Auditor'];
                break;

            case 'Auditor':
                req.initPayload.access = 'country_id = ' + country_id;
                req.initPayload.role_access = [];
                break;
        }
    }
}

module.exports = getModulesbyLocation;