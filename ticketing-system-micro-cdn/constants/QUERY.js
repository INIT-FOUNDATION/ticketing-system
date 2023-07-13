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
        user_name, first_name, last_name, display_name, mobile_number, password, role_id, country_id, state_id, district_id, created_by, account_locked, email_id, designation, is_active, date_created)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 1, now()) returning user_id;`,
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
    updateUserQuery: "UPDATE m_users SET first_name = $1, last_name = $2, display_name = $3, is_active = $4, email_id = $5, designation = $6, updated_by = $7 WHERE user_id = $8",
    viewLFGrid: "select * from vw_m_location_facility ",
    viewLFGridGetStateId: "select state_id from vw_m_location_facility",
    viewLFGridbyUpdatedate: "select * from vw_m_location_facility where date_created >= NOW() - INTERVAL 1 MINUTE or date_modified >= NOW() - INTERVAL 1 MINUTE;",
    insertIntoQuery: "INSERT INTO ",
    getUserMobileQuery: "SELECT mobile_number, display_name,state_id, email_id FROM m_users WHERE user_id = $1 LIMIT 1",
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
        user_id, country_id, state_id, district_id, sub_district_id, block_id, village_id, org_id, hosp_id, reporting_to, date_created, date_modified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now(), now()) returning user_id;`,
    insertUserDeptMappingQuery: `INSERT INTO public.m_user_dept_mapping(
            user_id, hosp_dept_id, date_created, date_modified, created_by, updated_by)
            VALUES ($1, $2, now(), now(), $3, $4) returning user_dept_map_id;`,
    getDoctorsByRoleQuery: `SELECT u.user_id, u.display_name from m_users u left join m_user_mapping um on u.user_id = um.user_id WHERE u.role_id = $1 AND um.hosp_id = $2 AND is_active = 1 AND is_deleted <> 1`,
    updateSignature: "UPDATE m_users SET signature_url=$1, date_modified=NOW() WHERE user_id=$2",
    getSignature: "SELECT signature_url FROM m_users WHERE user_id = $1",
    getReferenceDoctors: `SELECT u.user_id, u.display_name from m_users u left join m_user_mapping um on u.user_id = um.user_id left join m_roles rs on u.role_id = rs.role_id WHERE u.user_id != $1 AND rs.level = 'Department' AND um.hosp_id = $2 AND u.is_active = 1 AND u.is_deleted <> 1`,
    checkUserDeptMappingExist: "SELECT COUNT(*) AS count FROM m_user_dept_mapping WHERE user_id = $1 AND hosp_dept_id = $2",
    addPermissions: "INSERT INTO user_access_control(user_id,menu_id,per_id,date_created, created_by) values($1, $2, $3, now(), $4)",
    deletePermissions: "DELETE from user_access_control where user_id = $1",
    getDeptIDs: `select hosp_dept_id from m_user_dept_mapping where user_id = $1`,
    getSpecIDs: `select spec_id from m_user_speciality_mapping where user_id = $1`,
    getAllUsersByHospital: `SELECT U.user_id, U.display_name, U.designation, R.role_name FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE UM.hosp_id = $1`,
    updateUserMappingQuery: `UPDATE m_user_mapping SET reporting_to = $1, date_modified = now() where user_id = $2`,
    getUserHierarchy: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              UM.reporting_to, 
                              U.designation as designation, 
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE U.user_id= $1`,
    getUserHierarchyChild: `SELECT U.user_id as user_id,
                              U.profile_picture_url,
                              U.display_name as data ,
                              UM.reporting_to, 
                              U.designation as designation, 
                              R.role_name as label, 
                              true AS expanded,
                              'person' AS type,
                              'ui-person' AS styleClass FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    INNER JOIN m_roles R ON U.role_id = R.role_id
    WHERE UM.reporting_to= $1`,
    getUserParent: `SELECT U.user_id as user_id,
                              UM.reporting_to
    FROM m_users U
    INNER JOIN m_user_mapping UM ON U.user_id = UM.user_id
    WHERE U.user_id= $1`,
    getPincodeByDistrictId: `select distinct pincode from m_pincodes where district_id = $1 order by pincode`
};

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
                        LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
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
                                            WHEN (uac.per_id) = 1
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) write_permission,
                                    sum(
                                        CASE 
                                            WHEN (ac.per_id) = 2 
                                            THEN 1 
                                            WHEN (uac.per_id) = 2
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) read_permission,
                                    (
                                        CASE 
                                            WHEN sum(COALESCE(ac.per_id, 0)) > 0 
                                            THEN 1 
                                            WHEN sum(COALESCE(uac.per_id, 0)) > 0
                                            THEN 1
                                            ELSE 0 
                                        END
                                    ) display_permission
                                FROM m_menus mm 
                                LEFT OUTER JOIN user_access_control uac ON mm.menu_id = uac.menu_id AND uac.user_id=$1
                                LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$2
                                LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                                LEFT OUTER JOIN m_permissions mp1 ON uac.per_id = mp1.per_id
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

exports.ORGANIZATION = {
    checkOrgExist: "select COUNT(*) AS count from m_organization where org_name = $1",
    createOrg: `INSERT INTO m_organization(org_name, org_address, contact_name, contact_mobile, contact_phone, status, created_by, updated_by) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING org_id, org_code`,
    getAllOrganizations: `SELECT org_id, org_name, org_code, org_address, contact_name, contact_mobile, contact_phone, status FROM m_organization #WHERE_CLAUSE# ORDER BY org_id #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getAllOrganizationsCount: `SELECT COUNT(*) AS count FROM m_organization #WHERE_CLAUSE#`,
    getSpecificOrganizationDetails: `SELECT org_id, org_name, org_code, org_address, contact_name, contact_phone, status, contact_mobile from m_organization WHERE org_id = $1 ORDER BY org_name`,
    updateOrganization: `UPDATE m_organization SET org_name=$2, org_address=$3, contact_name=$4, contact_mobile=$5, contact_phone=$6, status=$7, updated_by=$8, date_modified=NOW() WHERE org_id = $1`,
    updateOrganizationStatus: `UPDATE m_organization SET status=$2, updated_by=$3 WHERE org_id = $1`,
    getActiveOrganizations: `SELECT org_id, org_name from m_organization where status=$1`,
};

exports.HOSPITAL = {
    checkHospitalExist: "select COUNT(*) AS count from m_hospital where hospital_name = $1 and org_id = $2",
    checkIfHospitalNameExist: "select COUNT(*) AS count from m_hospital where hospital_name = $1",
    checkNameExist: "select COUNT(*) AS count from m_hospital where hospital_name = $1 and hospital_id != $2 and org_id = $3",
    checkHospitalNameExist: "select COUNT(*) AS count from m_hospital where hospital_name = $1 and hospital_id != $2",
    insertHospital: `INSERT INTO public.m_hospital(
        hospital_name, org_id, country_id, state_id, district_id,block_id, village_id, city_name, address, zip_code, latitude, longitude, contact_person_name, contact_mobile_number, contact_phone_number, status, date_created, date_modified, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,now(), now(), $17)`,
    getHospital: `select hosp.hospital_id, 
                        hosp.hospital_name, 
                        hosp.hospital_code, 
                        hosp.org_id, 
                        hosp.country_id, 
                        hosp.state_id,
                        s.state_name,
                        hosp.district_id,
                        d.district_name,
                        hosp.block_id, 
                        hosp.village_id, 
                        hosp.city_name, 
                        hosp.address, 
                        hosp.zip_code, 
                        hosp.latitude, 
                        hosp.longitude, 
                        hosp.contact_person_name, 
                        hosp.contact_mobile_number, 
                        hosp.contact_phone_number, 
                        hosp.status,
                        hosp.logo_url
                        from m_hospital hosp
                        left join m_organization org on org.org_id = hosp.org_id
                        left join m_country c on hosp.country_id = c.country_id
                        left join m_state s on hosp.state_id = s.state_id
                        left join m_district d on hosp.district_id = d.district_id
                        where hospital_id = $1`,
    updateHospital: "update m_hospital set hospital_name = $1, city_name = $2, address = $3, zip_code = $4, latitude = $5, longitude = $6, contact_person_name = $7, contact_mobile_number = $8, contact_phone_number = $9, status = $10, updated_by = $11, date_modified = now() where hospital_id = $12",
    getHospitalGrid: `select hospital_id, hospital_name, hospital_code, hosp.org_id, hosp.country_id, hosp.state_id, hosp.district_id, city_name, address, zip_code, hosp.latitude, hosp.longitude, contact_person_name, contact_mobile_number, contact_phone_number, hosp.status, hosp.logo_url  
        from m_hospital hosp
        left join m_organization org on org.org_id = hosp.org_id
        left join m_country c on hosp.country_id = c.country_id
        left join m_state s on hosp.state_id = s.state_id
        left join m_district d on hosp.district_id = d.district_id `,
    getHospitalGridCount: "select count(*) as count from m_hospital hosp ",
    updateHospitalStatus: "update m_hospital set status = $1, updated_by = $2, date_modified = now() where hospital_id = $3",
    checkHospitalIdExist: "SELECT COUNT(*) AS count FROM m_hospital WHERE hospital_id = $1",
    checkHospitalConfigExist: "SELECT COUNT(*) AS count FROM m_hosp_config WHERE hospital_id = $1",
    addHospConfig: `SELECT create_hosp_config($1::JSON,$2::JSON)`,
    updateHospitalConfig: `update m_hosp_config set basic_reg_charge = $2, is_dept_req = $3, is_unit_req = $4, updated_by=$5 where hospital_id = $1`,
    getHospConfiguration: `SELECT hospital_id, basic_reg_charge, is_dept_req, is_unit_req, hosp_logo
	FROM public.m_hosp_config WHERE hospital_id = $1`,
    getHospDepartments: `SELECT hosp_dept_map_id, hospital_id, dept_id, status FROM public.m_hosp_dept_mapping WHERE hospital_id = $1`,
    getHospUnits: `SELECT U.unit_id, U.unit_name, U.unit_name, U.status, HD.dept_id, HD.hospital_id, HD.hosp_dept_map_id
	FROM m_unit U INNER JOIN m_hosp_dept_mapping HD ON U.hosp_dept_map_id = HD.hosp_dept_map_id
	WHERE HD.hospital_id = $1`,
    getHospitalbyOrganization: `SELECT hospital_id AS value, hospital_name AS label from m_hospital where org_id=$1`,
    getHospitalbyLocation: `SELECT hospital_id AS value, hospital_name AS label from m_hospital where 1=1 `,
    updateLogoURLQuery: "UPDATE m_hospital SET logo_url=$1 WHERE hospital_id = $2",
    getLogoURLQuery: 'SELECT logo_url FROM m_hospital WHERE hospital_id = $1'
};

exports.DOCTOR_ROSTER = {
    getSlotsByDate: `SELECT roster_id, to_char(slot_date,'YYYY-MM-DD') as slot_date, start_time, end_time, booked  from tr_doctor_roster where doc_id=$1 AND active = 1 AND slot_date::date BETWEEN $2 AND $3 order by slot_date desc, start_time ASC`,
    getSlots: `SELECT roster_id, to_char(slot_date,'YYYY-MM-DD') as slot_date, start_time, end_time, booked  from tr_doctor_roster where doc_id=$1 AND active = 1 AND slot_date::date = $2`
};

exports.ACTIVITY_SESSION_ROSTER = {
    getSlotsByDate: `SELECT roster_id, to_char(slot_date,'YYYY-MM-DD') as slot_date, start_time, end_time, capacity, booked  from tr_session_activity_roster where doc_id=$1 AND active = 1 AND slot_date::date BETWEEN $2 AND $3 order by slot_date desc, start_time ASC`,
    getSlots: `SELECT roster_id, to_char(slot_date,'YYYY-MM-DD') as slot_date, start_time, end_time, capacity booked  from tr_session_activity_roster where doc_id=$1 AND active = 1 AND slot_date::date = $2`
};

exports.DOCTOR_SHIFT = {
    getShiftsByDate: `SELECT shift_id, to_char(shift_date,'YYYY-MM-DD') as shift_date, start_time, end_time, booked  from tr_doctor_shift where doc_id=$1 AND active = 1 AND shift_date::date BETWEEN $2 AND $3 order by shift_date desc, start_time ASC`,
    getShift: `SELECT shift_id, to_char(shift_date,'YYYY-MM-DD') as shift_date, start_time, end_time, booked  from tr_doctor_shift where doc_id=$1 AND active = 1 AND shift_date::date = $2`
};

exports.DEPARTMENT = {
    checkDeptExist: "select COUNT(*) AS count from m_department where dept_name = $1",
    createDept: `INSERT INTO m_department(dept_name, dept_desc, dept_logo, status, created_by, updated_by) values($1, $2, $3, $4, $5, $6) RETURNING dept_id`,
    getAllDepartments: `select dept_id, dept_name, dept_desc, dept_logo, status from m_department #WHERE_CLAUSE# ORDER BY dept_id #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getSpecificDepartmentDetails: `SELECT dept_id, dept_name, dept_desc, dept_logo, status from m_department WHERE dept_id = $1 ORDER BY dept_name`,
    updateOrganization: `UPDATE m_department SET dept_name=$2, dept_desc=$3, dept_logo=$4, status=$5, updated_by=$6 WHERE dept_id = $1`,
    getAllDepartmentsCount: `SELECT COUNT(*) AS count FROM m_department #WHERE_CLAUSE#`,
    checkDeptMappingExist: "SELECT COUNT(*) AS count FROM m_hosp_dept_mapping WHERE hospital_id = $1 AND dept_id = $2",
    addDeptHospMapping: `INSERT INTO m_hosp_dept_mapping(hospital_id, dept_id, status, created_by, updated_by) values($1, $2, $3, $4, $5) RETURNING hosp_dept_map_id`,
    getDeptHospMappingCount: `SELECT COUNT(*) AS count FROM m_hosp_dept_mapping HD #WHERE_CLAUSE#`,
    getAllDeptHospMapping: `SELECT HD.hosp_dept_map_id, HD.hospital_id, HD.dept_id, HD.status,
    H.hospital_name, H.hospital_code, D.dept_name
    FROM m_hosp_dept_mapping HD 
    INNER JOIN m_hospital H ON H.hospital_id = HD.hospital_id
    INNER JOIN m_department D on D.dept_id = HD.dept_id #WHERE_CLAUSE# ORDER BY dept_id #LIMIT_CLAUSE# #OFFSET_CLAUSE#`,
    getUsersByDept: `SELECT u.user_id, u.display_name
    FROM m_user_dept_mapping udm
    INNER JOIN m_users u ON u.user_id = udm.user_id
    WHERE hosp_dept_id = $1 `,
    getUsersByAvailability: `SELECT u.user_id, u.display_name, um.hosp_id
    FROM m_user_dept_mapping udm
    INNER JOIN m_users u ON u.user_id = udm.user_id
    INNER JOIN m_roles r ON u.role_id = r.role_id
    INNER JOIN m_user_mapping um ON u.user_id = um.user_id
	LEFT JOIN tr_doctor_shift ds ON ds.doc_id = udm.user_id
    WHERE hosp_dept_id = $1 AND ds.shift_date = $2 AND r.role_name = $3`,
    getUsersByAvailabilityOPDFutureDates: `SELECT DISTINCT u.user_id, u.display_name, um.hosp_id
    FROM m_user_dept_mapping udm
    INNER JOIN m_users u ON u.user_id = udm.user_id
    INNER JOIN m_roles r ON u.role_id = r.role_id
    INNER JOIN m_user_mapping um ON u.user_id = um.user_id
	LEFT JOIN tr_doctor_roster dr ON dr.doc_id = udm.user_id
    WHERE hosp_dept_id = $1 AND dr.slot_date = $2 AND r.role_name = $3`,
    getUsersByAvailabilityOPDCurrentDates: `SELECT u.user_id, u.display_name, um.hosp_id
    FROM m_user_dept_mapping udm
    INNER JOIN m_users u ON u.user_id = udm.user_id
    INNER JOIN m_roles r ON u.role_id = r.role_id
    INNER JOIN m_user_mapping um ON u.user_id = um.user_id
    WHERE hosp_dept_id = $1 AND r.role_name = $2`
};

exports.BED_QUERIES = {
    getWardsMaster: `SELECT ward_id, ward_name, ward_code, status FROM m_wards #WHERE_CLAUSE#`,
    getWardBedsCount: `SELECT COUNT(*) AS count FROM m_beds B INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id WHERE hospital_id = $1`,
    getBedConfig: `SELECT B.ward_hosp_id, MAX(WH.ward_label) AS ward_label, MAX(WH.ward_id) AS ward_id, 
    MAX(W.ward_name) AS ward_name, MIN(B.bed_price) AS bed_price, COUNT(*) AS count FROM m_beds B 
    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
    INNER JOIN m_wards W ON W.ward_id = WH.ward_id
    WHERE hospital_id = $1
    GROUP BY B.ward_hosp_id`,
    getBeds: `SELECT B.bed_id, B.bed_code,B.bed_price, B.bed_desc, B.status, B.ward_hosp_id, WH.ward_label, WH.ward_id, W.ward_name, W.ward_code 
    FROM m_beds B 
    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
    INNER JOIN m_wards W ON W.ward_id = WH.ward_id
    WHERE hospital_id = $1 ORDER BY B.bed_id`,
    addBed: `INSERT INTO m_beds(bed_code, ward_hosp_id, bed_desc, bed_price, status, created_by, updated_by) values($1, $2, $3, $4, $5, $6, $7) RETURNING bed_id, bed_code, ward_hosp_id, bed_desc, bed_price, status`,
    addWard: `INSERT INTO m_wards_hosp_mapping(ward_id, hospital_id, ward_label, date_created, date_modified, created_by, updated_by) values($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4, $5) RETURNING ward_hosp_id`,
    updateBed: `UPDATE m_beds SET bed_code=$2, bed_price=$3, bed_desc=$4, status=$5, updated_by=$6, date_modified=CURRENT_TIMESTAMP WHERE bed_id = $1`,
    getHospitalIdByBedId: `SELECT WH.hospital_id FROM m_beds B 
    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
    WHERE bed_id = $1`,
    getHospitalIdByWardHospId: `SELECT WH.hospital_id FROM m_wards_hosp_mapping WH WHERE WH.ward_hosp_id = $1`,
    checkWardLabelExists: `SELECT COUNT(*) AS count FROM m_wards_hosp_mapping WHERE ward_label ILIKE $1 AND hospital_id = $2`,
    checkWardHospIdExists: `SELECT COUNT(*) AS count FROM m_wards_hosp_mapping WHERE ward_hosp_id = $1`,
    getWardTotalBedCount: `SELECT WH.ward_id, COUNT(*) AS bed_count FROM m_beds B 
    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
    INNER JOIN m_wards W ON W.ward_id = WH.ward_id
    WHERE hospital_id = $1
    GROUP BY WH.ward_id`,
    getHospIdByWardHospId: `SELECT hospital_id, ward_id FROM m_wards_hosp_mapping WHERE ward_hosp_id = $1`,
    isBedCodeExist: `SELECT COUNT(*) AS count FROM m_beds B 
    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
    WHERE B.bed_code ILIKE $1 AND WH.hospital_id = $2`,
    updateWardBed: `UPDATE m_beds SET bed_price=$2, updated_by=$3, date_modified=CURRENT_TIMESTAMP WHERE ward_hosp_id = $1`,
    updateWard: `UPDATE m_wards_hosp_mapping SET ward_label=$2, updated_by=$3, date_modified=CURRENT_TIMESTAMP WHERE ward_hosp_id = $1`,
    getBedsAvailability: `SELECT B.bed_id, B.ward_hosp_id, MAX(PBM.status) as assigned_status, 
                                 MAX(B.status) as bed_status, MAX(PBM.patient_id) AS patient_id,
                                 MAX(PBM.patient_on_bed_status) AS patient_on_bed_status 
                          FROM m_beds B 
    LEFT JOIN tr_patient_bed_mapping PBM ON B.bed_id = PBM.bed_id AND (PBM.end_date is null OR PBM.end_date::date >= $1)
    WHERE B.ward_hosp_id = $2
    GROUP BY B.bed_id`,
    getBedDetails: `SELECT b.bed_id, b.bed_code, b.bed_price, whm.ward_label FROM m_beds b
    INNER JOIN m_wards_hosp_mapping whm ON whm.ward_hosp_id = b.ward_hosp_id
    WHERE bed_id=$1`,
    getBedsAvailabilityDateWise: `SELECT B.bed_id, 
                                        MAX(B.bed_code) AS bed_code,
                                        MAX(B.bed_price) AS bed_price, 
                                        MAX(B.bed_desc) AS bed_desc, 
                                        MAX(B.status) AS status, 
                                        MAX(B.ward_hosp_id) AS ward_hosp_id, 
                                        MAX(WH.ward_label) AS ward_label, 
                                        MAX(WH.ward_id) AS ward_id, 
                                        MAX(W.ward_name) AS ward_name, 
                                        MAX(W.ward_code) AS ward_code,
                                        MAX(PBM.status) as availability_status,
                                        MAX(PBM.patient_id) AS patient_id,
                                        MAX(PBM.patient_on_bed_status) AS patient_on_bed_status 
                                    FROM m_beds B 
                                    INNER JOIN m_wards_hosp_mapping WH ON B.ward_hosp_id = WH.ward_hosp_id
                                    INNER JOIN m_wards W ON W.ward_id = WH.ward_id
                                    LEFT JOIN tr_patient_bed_mapping PBM ON B.bed_id = PBM.bed_id AND (PBM.end_date is null OR PBM.end_date::date >= $1)
                                    WHERE WH.ward_hosp_id = $2 
                                    GROUP BY B.bed_id
                                    ORDER BY B.bed_id`,
    getHospitalWards: `SELECT whm.ward_hosp_id, 
    whm.ward_label,
    (SELECT COUNT(*) FROM m_beds B WHERE B.ward_hosp_id = whm.ward_hosp_id) as no_of_beds,
    (SELECT B.bed_price FROM m_beds B WHERE B.ward_hosp_id = whm.ward_hosp_id LIMIT 1) as bed_price FROM m_wards_hosp_mapping whm
WHERE hospital_id=$1
ORDER BY whm.ward_id`
}

exports.SERVICES_QUERIES = {
    checkServiceNameExist: "SELECT COUNT(*) AS count FROM m_hosp_services WHERE service_name = $1 AND hospital_id = $2",
    createService: `INSERT INTO m_hosp_services( service_name, hospital_id, service_desc, price, created_by, updated_by)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING service_id, service_name, hospital_id, service_desc, price`,
    getServices: `SELECT service_id, service_name, service_desc, price, status
    FROM m_hosp_services WHERE hospital_id = $1 AND status = 1;`,
    updateService: `UPDATE m_hosp_services SET service_name=$2, service_desc=$3, price=$4, status=$5, updated_by=$6, date_modified=CURRENT_TIMESTAMP WHERE service_id = $1`,
    removeService: `UPDATE m_hosp_services SET status=$2, updated_by=$3, date_modified=CURRENT_TIMESTAMP WHERE service_id = $1`,
    checkUpdatedServiceNameExist: "SELECT COUNT(*) AS count FROM m_hosp_services WHERE service_name = $1 AND hospital_id = $2 AND service_id <> $3",
};

exports.LANGUAGE = {
    get_all_languages: 'SELECT * FROM m_languages WHERE status = 1'
}