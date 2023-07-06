DROP VIEW public.vw_m_users;
CREATE OR REPLACE VIEW public.vw_m_users
    AS
     SELECT users.user_id,
    users.user_name,
    users.first_name,
    users.last_name,
    users.mobile_number,
    users.email_id,
    users.gender,
    users.date_of_birth,
    users.role_id,
    users.country_id,
    c.country_name,
    users.zip_code,
    users.date_created,
    users.date_modified,
    users.is_active,
    users.display_name,
    users.is_logged_in,
    to_char(users.last_logged_in_out + '05:30:00'::interval, 'DD-MON-YYYY HH12:MIPM'::text) AS last_logged_in_out,
    roles.role_name,
    roles.level AS user_level,
    users.profile_picture_url
   FROM m_users users
     LEFT JOIN m_roles roles ON users.role_id = roles.role_id
     LEFT JOIN m_country c ON users.country_id = c.country_id;