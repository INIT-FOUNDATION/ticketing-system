exports.ANDROIDAPP = {
    selectAppVersionQuery: "SELECT app_id, app_version, apk_version, apk_link, force_update, remarks, release_date from m_app_version ORDER BY release_date DESC LIMIT 1",
    selectAppVersionNumber: "SELECT apk_version FROM m_app_version ORDER BY release_date DESC LIMIT 1"
};

exports.ADMIN = {
    checkIfCityExist: "SELECT COUNT(city_id) as count FROM m_city WHERE city_name=$1 and district_id = $2 ",
    checkIfCityNameExist: "SELECT COUNT(city_id) as count FROM m_city WHERE city_name=$1 and district_id = $2 and city_id != $3 ",
    selectStateQuery: "SELECT state_id,state_name from m_state ORDER BY state_name asc",
    selectDistrictQuery: "SELECT district_id,district_name from m_district WHERE state_id = $1 ORDER BY district_name asc",
    selectBlockQuery: "SELECT block_id, block_name from m_block WHERE district_id = $1 ORDER BY block_name asc",
    selectVillageQuery: "SELECT village_id, village_name from m_village WHERE block_id = $1 ORDER BY village_name asc",
    selectCityQuery: "SELECT city_id,city_name from m_city  WHERE district_id= $1 ORDER BY city_name asc",
    updateStateQuery: "UPDATE m_state set state_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where state_id = $5",
    updateDistrictQuery: "UPDATE m_district set district_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where district_id = $5",
    updateCityQuery: "UPDATE m_city set city_name = $1, latitude = $2, longitude = $3, updated_by = $4, date_modified = NOW() where city_id = $5",
    selectCityDataQuery: `SELECT b.city_name AS name, b.latitude AS latitude, b.longitude AS longitude,b.city_id AS block_id,b.district_id AS district_id , d.state_id AS state_id FROM m_city b,m_district d WHERE b.district_id=d.district_id AND b.city_id = $1`,
    selectDistrictDataQuery: `SELECT d.district_name AS name, d.latitude AS latitude, d.longitude AS longitude,d.district_id AS district_id,d.state_id AS state FROM m_district d WHERE d.district_id = $1`,
    selectAllDistrictQuery: "SELECT state_id,district_id,district_name from m_district ORDER BY district_name asc",
    selectAllCityQuery: "SELECT city_id, city_name, district_id from m_city  ORDER BY city_name asc",
    checkIfUserExist: "SELECT COUNT(user_id) AS usercount from m_users WHERE user_name=$1",
    updateUserStatusQuery: "UPDATE m_users SET is_active = $1, date_modified=NOW() WHERE user_id = $2",
    checkRoleStatusQuery: "SELECT count(1) as isRoleInActive from m_users inner join m_roles on m_users.role_id = m_roles.role_id where m_users.user_id = $1 and m_roles.is_active = 0 and m_users.is_active = 0",
    insertUserQuery: `INSERT INTO public.m_users(
        user_name, first_name, last_name, display_name, mobile_number, password, role_id, created_by, account_locked, email_id, is_active, date_created)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 1, now()) returning user_id;`,
    selectConfigQuery: "SELECT c.key ,c.value FROM m_config c WHERE c.key=$1",
    selectStateDataQuery: "SELECT state_name, latitude,longitude,state_id AS state, country_id AS country FROM m_state WHERE state_id = $1",
    getPasswordComplexityQuery: "SELECT id, password_expiry, password_history, min_password_length, complexity, alphabetical, numeric, special_chars, allowed_special_chars, max_invalid_attempts FROM password_complexity",
    createPasswordComplexityQuery: `INSERT INTO password_complexity(password_expiry, password_history, min_password_length, complexity, alphabetical, "numeric", special_chars, allowed_special_chars, max_invalid_attempts, date_created, date_modified)
	                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
    updatePasswordComplexity: `UPDATE password_complexity
                                SET password_expiry=$1, password_history=$2, min_password_length=$3, complexity=$4, alphabetical=$5, "numeric"=$6, special_chars=$7, allowed_special_chars=$8, max_invalid_attempts=$9, date_modified=NOW()
                                WHERE id=$10`,
    getPasswordHistory: "SELECT password FROM m_users_history WHERE user_name = $1 ORDER BY id DESC LIMIT 3",
    selectProfileDtlsQuery: "SELECT m.user_id as user_id,m.profile_picture_url as profile_picture_url, m.user_name as username,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.mobile_number as mobile_number," +
        "m.facility_id AS facility_id,m.role_id as role_id, " +
        "m.state_id as state,m.district_id as district,m.block_id as block, m.password as currentPassword, m.password_last_updated as password_last_updated, m.invalid_attempts as invalid_attempts," +
        "m.date_created as date_created, m.is_active as is_active FROM m_users m WHERE m.user_id =$1",
    userStatistics: "SELECT COUNT(*) as totalUsers, sum(m_users.is_active=1) as activeUsers, (sum(m_users.is_active=1)/COUNT(*))*100 AS avgActiveUsers, sum(m_users.is_active=1 AND is_logged_in = 0) as notLoggedInActiveUsers, (sum(m_users.is_active=1 AND is_logged_in = 0)/COUNT(*))*100 AS avgNotLoggedInActiveUsers, sum(m_users.is_active=0) as deactiveUsers, (sum(m_users.is_active=0)/COUNT(*))*100 AS avgDeactiveUsers, sum(m_users.is_active=1 AND is_logged_in = 1) as loggedInActiveUsers, (sum(m_users.is_active=1 AND is_logged_in = 1)/COUNT(*))*100 AS avgLoggedInActiveUsers from m_users left join  m_roles on m_users.role_id = m_roles.role_id ",
    viewUserGrid: "select * from vw_m_users ",
    userById: "select * from vw_m_users WHERE user_id = $1",
    viewUserGridbyUpdatedate: "select * from vw_m_users where date_created >= NOW() - INTERVAL 1 DAY or date_modified >= NOW() - INTERVAL 1 DAY",
    updateUserQuery: "UPDATE m_users SET first_name = $1, last_name = $2, display_name = $3, is_active = $4, email_id = $5, updated_by = $7 WHERE user_id = $8",
    viewLFGrid: "select * from vw_m_location_facility ",
    viewLFGridGetStateId: "select state_id from vw_m_location_facility",
    viewLFGridbyUpdatedate: "select * from vw_m_location_facility where date_created >= NOW() - INTERVAL 1 MINUTE or date_modified >= NOW() - INTERVAL 1 MINUTE;",
    insertIntoQuery: "INSERT INTO ",
    getUserMobileQuery: "SELECT mobile_number, display_name, email_id FROM m_users WHERE user_id = $1 LIMIT 1",
    updateUserPasswordbyAdminQuery: "UPDATE m_users SET password=$1 WHERE user_id = $2",
    updateUserProfilePicQuery: "UPDATE m_users SET profile_picture_url=$1 WHERE user_id = $2",
    getUserProfilePicQuery: "SELECT * FROM m_users WHERE user_id = $1",
    getUserLocations: "select * from vw_m_location_facility where 1=1 ",
    getLocalitybyPincode: "select * from m_pincodes where pincode = $1",
    deleteUserFromUsersQuery: "update m_users set is_deleted = 1, date_modified = now() where mobile_number = $1 ",
    selectUser: "SELECT * from m_users WHERE user_name= $1 AND is_active = 1",
    checkIfRoleIsValid: "select count(*) as count from m_roles where role_id=$1",
    countUserGrid: "select count(*) as count from vw_m_users ",
    countLFGrid: "select count(*) as count from vw_m_location_facility ",
    insertUserMappingQuery: `INSERT INTO public.m_user_mapping(
        user_id, country_id, state_id, district_id, sub_district_id, block_id, village_id, date_created, date_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now()) returning user_id;`,
    addPermissions: "INSERT INTO user_access_control(user_id,menu_id,per_id,date_created, created_by) values($1, $2, $3, now(), $4)",
    deletePermissions: "DELETE from user_access_control where user_id = $1",
    getSpecIDs: `select spec_id from m_user_speciality_mapping where user_id = $1`,
    updateUserMappingQuery: `UPDATE m_user_mapping SET reporting_to = $1, date_modified = now() where user_id = $2`,
    getUserHierarchy: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE U.user_id= $1`,
    getUserHierarchyChild: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE UM.reporting_to= $1`,
    getUserParent: `SELECT U.user_id as user_id,
                              UM.reporting_to
    FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    WHERE U.user_id= $1`,
    getPincodeByDistrictId: `select distinct pincode from m_pincodes where district_id = $1 order by pincode`
};


exports.USER_QUERY = {
    getUserCount: `SELECT COUNT(*) AS count FROM m_users U 
	LEFT JOIN m_roles R ON U.role_id = R.role_id #WHERE_CLAUSE#`,
    getAllUsers1: `SELECT * FROM vw_m_users #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getAllUsers: `SELECT U.user_id, U.user_name, U.display_name, U.first_name, U.last_name, U.mobile_number, U.email_id, U.gender, U.date_of_birth, 
    U.address, U.role_id, R.role_name, R.level AS user_level, U.profile_picture_url, 
    U.date_created, U.date_modified, U.is_deleted
    FROM m_users U LEFT JOIN m_roles R ON U.role_id = R.role_id
    #WHERE_CLAUSE# ORDER BY U.date_modified DESC  #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
}


exports.PRODUCT_QUERY = {
    getProductCount: `SELECT COUNT(*) AS count FROM vw_m_products #WHERE_CLAUSE#`,
    getProductList: `SELECT * FROM vw_m_products #WHERE_CLAUSE# ORDER BY date_modified DESC #LIMIT_CLAUSE# #OFFSET_CLAUSE#;`,
    getProduct: `SELECT * FROM vw_m_products #WHERE_CLAUSE#`
}

exports.ROLE = {
    selectRoleDetails: "SELECT m_roles.role_id, role_name, role_description, level, m_roles.is_active, count(m_users.user_id) as userCount FROM m_roles LEFT JOIN m_users ON m_roles.role_id = m_users.role_id and m_users.is_active = 1 where m_roles.role_id != 1 group by m_roles.role_id",
    selectSpecificRoleDetails: "SELECT role_id, role_name, role_description, level, is_active from m_roles where role_id = $1",
    selectSpecificMenuDetails: "SELECT menu_id, menu_name, menu_description, parent_menu_id, is_active from m_menus where menu_id = $1",
    selectModuleList: "select module_json from m_roles where role_id = 2;",
    checkRoleExist: "select COUNT(*) AS count from m_roles where role_name = $1",
    checkMenuExist: "select COUNT(*) AS count from m_menus where menu_name = $1",
    checkRoleNameExist: "select COUNT(*) AS count from m_roles where role_name = $1 and role_id != $2",
    insertRoleQuery: "INSERT INTO m_roles(role_name,role_description,level,is_active) values($1, $2, $3, $4) RETURNING role_id",
    insertMenuQuery: "INSERT INTO m_menus ",
    countActiveUsersQuery: "select COUNT(*) AS activeUsers FROM m_users WHERE role_id = $1 AND is_active = 1 ",
    selectRoleStatusQuery: "SELECT is_active FROM m_roles WHERE role_id = $1 ",
    updateRoleQuery: "UPDATE m_roles SET role_name = $1, role_description = $2, is_active = $3, level = $5 WHERE role_id = $4",
    updateMenuQuery: "UPDATE m_menus SET menu_name = $1, menu_description = $2, is_active = $3 WHERE menu_id = $4",
    updateRoleStatusQuery: "update m_roles set is_active = $1 where role_id = $2",
    selectActiveRolesQuery: "SELECT role_id,role_name, level from m_roles where is_active = 1 and role_id not in (2) ORDER BY role_name asc",
    selectActiveRolesForStatisticsQuery: "SELECT role_id,role_name, level from m_roles where is_active = 1 and role_id not in (2) ",
    getActiveRolesQuery: "SELECT role_id,role_name, level from m_roles where is_active = 1 and role_id != 1 ",
    selectAllRolesQuery: "SELECT role_id,role_name, level from m_roles where role_id != 1 ORDER BY role_name asc",
    selectDoctorRolesQuery: `SELECT R.role_id, R.role_name 
                            FROM m_roles R
                            INNER JOIN access_control AC ON AC.role_id = R.role_id
                            INNER JOIN m_menus M ON M.menu_id = AC.menu_id AND M.is_active = 1
                            WHERE AC.per_id = 1 AND upper(M.menu_name) = 'DOCTOR ROSTER' AND R.role_id != 1;`,
    getMenuList: "SELECT menu_id, menu_name, is_active from m_menus where 1=1",
    defaultAccessList: "select menu_id, menu_name, per_id, per_name from m_menus cross join m_permissions where is_active = 1 order by parent_menu_id, menu_id, per_id;",
    addPermissions: "INSERT INTO access_control(role_id,menu_id,per_id,date_created, date_modified, created_by) values($1, $2, $3, now(), now(), 1)",
    deletePermissions: "DELETE from access_control where role_id = $1",
    getRoleAccessList: `SELECT mm.menu_id, 
                            mm.menu_name,
                            mm.route_url,
                            mm.icon_class,
                            sum(CASE WHEN (ac.per_id) = 1 THEN 1 ELSE 0 END) write_permission,
                            sum(CASE WHEN (ac.per_id) = 2 THEN 1 ELSE 0 END) read_permission,
                            (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                        FROM m_menus mm 
                        LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                        WHERE mm.is_active=1
                        GROUP BY mm.menu_id
                        ORDER BY mm.menu_order ASC`,
    getCombinedAccessList: `SELECT mm.menu_id, 
                                    mm.menu_name,
                                    mm.route_url,
                                    mm.icon_class,
                                    sum(
                                        CASE 
                                            WHEN (ac.per_id) = 1 
                                            THEN 1 
                                            ELSE 0 
                                        END
                                    ) write_permission,
                                    sum(
                                        CASE 
                                            WHEN (ac.per_id) = 2 
                                            THEN 1 
                                            ELSE 0 
                                        END
                                    ) read_permission,
                                    (
                                        CASE 
                                            WHEN sum(COALESCE(ac.per_id, 0)) > 0 
                                            THEN 1 
                                            ELSE 0 
                                        END
                                    ) display_permission
                                FROM m_menus mm 
                                LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                                WHERE mm.is_active=1
                                GROUP BY mm.menu_id
                                ORDER BY mm.menu_order ASC`,
    getRolesForAssignedMembers: `SELECT role_id, role_name FROM m_roles WHERE role_name IN ('Doctor', 'Nurse')`
}

exports.USER = {
    getUserAccessControl: `SELECT mm.menu_id, 
                                mm.menu_name,
                                mm.route_url,
                                mm.icon_class,
                                sum(CASE WHEN (ac.per_id) = 1 THEN 1 ELSE 0 END) write_permission,
                                sum(CASE WHEN (ac.per_id) = 2 THEN 1 ELSE 0 END) read_permission,
                                (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                            FROM m_menus mm 
                            LEFT OUTER JOIN user_access_control ac ON mm.menu_id = ac.menu_id AND ac.user_id=$1
                            LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                            WHERE mm.is_active=1
                            GROUP BY mm.menu_id
                            ORDER BY mm.menu_order ASC`,
}

exports.LOCATION = {
    getDistrictMaster: "select district_id,district_name,state_id,latitude,longitude from m_district",
    getCityMaster: "select city_id,city_name,district_id,latitude,longitude from m_city",
    selectCountryQuery: "SELECT country_id, country_name from m_country ORDER BY country_name asc",
};

exports.LANGUAGE = {
    get_all_languages: 'SELECT * FROM m_languages WHERE status = 1'
}