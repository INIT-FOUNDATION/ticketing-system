exports.USER = {
    verifyMobile:
        "SELECT COUNT(m.mobile_number) as count FROM m_users m WHERE m.mobile_number=$1 AND m.is_active=1",
    selectConfigQuery: "SELECT c.key ,c.value FROM m_config c WHERE c.key=$1",
    selectProfileDtlsbyMobQuery: "SELECT m.user_id as user_id,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.is_active as is_active,password as current_password FROM m_users m WHERE m.mobile_number=$1 and m.is_active=1",
    updateUserPwdQuery:
        "UPDATE m_users SET password=$1, password_last_updated=NOW() WHERE user_id = $2 AND is_active=1",
    selectUser: `SELECT U.user_id AS user_id,
                        U.user_name AS user_name,
                        U.date_of_birth AS date_of_birth,
                        U.gender AS gender,
                        U.email_id AS email_id,
                        U.first_name AS first_name,
                        U.last_name AS last_name,
                        U.mobile_number AS mobile_number,
                        U.display_name AS display_name,
                        U.role_id AS role_id,
                        U.profile_picture_url AS profile_picture_url,
                        R.role_id AS role,
                        R.role_name AS name, 
                        U.password AS password,
                        U.is_active AS is_active,
                        U.account_locked AS account_locked
                    FROM m_users U 
                    LEFT OUTER JOIN m_roles R ON U.role_id = R.role_id
                    WHERE U.user_name= $1 AND U.is_active=1`,
    updateUsername:
        "UPDATE m_users SET user_name=$1, mobile_number=$2, date_modified=NOW() WHERE user_name=$3",
    insertUserHistoryQuery: "INSERT INTO m_users_history ",
    updateUserQuery: "UPDATE m_users SET ",
    checkIfUserExist:
        "SELECT COUNT(user_id) AS usercount from m_users WHERE user_name=$1",
    selectProfileDtlsQuery:
        "SELECT m.user_id as user_id,m.profile_picture_url as profile_picture_url, m.user_name as user_name,m.display_name as display_name,m.gender AS gender,m.date_of_birth AS date_of_birth,m.mobile_number as mobile_number," +
        "m.role_id as role_id, " +
        "m.password as current_password," +
        "m.date_created as date_created, m.is_active as isActive FROM m_users m WHERE m.user_id =$1",
    setPasswordHistory:"INSERT INTO m_users_history ",
    getUserPermissions: `select role_id, menu_id, per_id from access_control where role_id = $1
        union all
        select $2 as role_id, menu_id, per_id from user_access_control where user_id = $3`,
    getReportingTO: `select UM.reporting_to, U.display_name as reporting_to_name, U.designation AS reporting_to_designation
        from m_user_mapping UM left join m_users U on U.user_id = UM.reporting_to
        where UM.user_id = $1;`,
    deleteUserLanguage: `delete FROM m_user_lang_mapping where user_id = $1`,
    addUserLanguage: `INSERT INTO public.m_user_lang_mapping(
        user_id, language_id, date_created, date_modified, created_by, updated_by)
        VALUES ($1, $2, now(), now(), $3, $4) returning user_lang_map_id;`, 
    getHospitalAdministratorRoleID: `SELECT role_id from m_roles where upper(role_name) = 'HOSPITAL ADMINISTRATOR';`,
    getHospitalDoctorRoleID: `SELECT role_id from m_roles where upper(role_name) = 'DOCTOR';`,
    updatePreferredLocation: `UPDATE m_user_mapping SET preferred_state_id = $1, preferred_district_id = $2, preferred_zipcode = $3 WHERE user_id = $4` 
}