const getModulesbyLocation = (req) => {

    let token = req.plainToken;

    if (token) {
        let level = token.user_level;
        let country_id = token.country_id ? token.country_id : 1;
        let state_id = token.state_id;
        let district_id = token.district_id;
        let sub_district_id = token.sub_district_id;
        let block_id = token.block_id;
        let village_id = token.village_id;

        req.initPayload = {};

        switch (level) {

            case 'National':
                req.initPayload.access = 'country_id = ' + country_id;
                req.initPayload.role_access = ['State', 'District', 'SubDistrict', 'Block', 'Village'];
                break;

            case 'State':
                req.initPayload.access = 'country_id = ' + country_id + ' and state_id = ' + state_id;
                req.initPayload.role_access = ['District', 'SubDistrict', 'Block', 'Village'];
                break;

            case 'District':
                req.initPayload.access = 'country_id = ' + country_id + ' and district_id = ' + district_id
                req.initPayload.role_access = ['SubDistrict', 'Block', 'Village'];
                break;

            case 'Block':
                req.initPayload.access = 'country_id = ' + country_id + ' and block_id = ' + block_id
                req.initPayload.role_access = ['Village'];
                break;

            case 'Village':
                req.initPayload.access = 'country_id = ' + country_id + ' and village_id = ' + village_id
                req.initPayload.role_access = ['Hospital'];
                break;

            case 'SubDistrict':
                req.initPayload.access = 'country_id = ' + country_id + ' and sub_district_id = ' + sub_district_id
                req.initPayload.role_access = ['Hospital'];
                break;
        }
    }
}

module.exports = getModulesbyLocation;