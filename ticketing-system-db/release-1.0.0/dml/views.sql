DROP VIEW IF EXISTS public.vw_m_products;
CREATE OR REPLACE VIEW public.vw_m_products AS
SELECT P.product_id, P.product_name, P.serial_number, P.model_number, P.installation_date, P.status,
V.vendor_id, V.vendor_name, V.primary_contact_name AS vendor_contact_name, V.primary_contact_number AS vendor_contact_number, V.email_id,
S.site_id, S.site_name, S.site_type, S.address, S.site_code, S.primary_contact_name, S.primary_contact_number,
S.secondary_contact_name, S.secondary_contact_number, B.block_id, B.block_name, D.district_id, D.district_name,
ST.state_id, ST.state_name, P.date_created, P.date_modified
FROM m_products P
INNER JOIN m_vendors V ON V.vendor_id = P.vendor_id
INNER JOIN m_sites S ON S.site_id = P.site_id
INNER JOIN m_block B ON B.block_id = S.block_id
INNER JOIN m_district D ON D.district_id = B.district_id
INNER JOIN m_state ST ON ST.state_id = D.state_id;


DROP VIEW IF EXISTS public.vw_m_tickets;
CREATE OR REPLACE VIEW public.vw_m_tickets AS
SELECT T.ticket_id, T.ticket_number, T.ticket_mode, T.description, T.remarks, T.opening_date, T.closing_date,
P.product_id, P.product_name, P.serial_number, P.model_number, P.installation_date, P.status,
V.vendor_id, V.vendor_name, V.primary_contact_name AS vendor_contact_name, V.primary_contact_number AS vendor_contact_number, V.email_id,
S.site_id, S.site_name, S.site_type, S.address, S.site_code, S.primary_contact_name, S.primary_contact_number,
S.secondary_contact_name, S.secondary_contact_number, B.block_id, B.block_name, D.district_id, D.district_name,
ST.state_id, ST.state_name, T.date_created, T.date_modified
FROM m_tickets T 
INNER JOIN m_products P ON P.product_id = T.product_id
INNER JOIN m_vendors V ON V.vendor_id = P.vendor_id
INNER JOIN m_sites S ON S.site_id = P.site_id
INNER JOIN m_block B ON B.block_id = S.block_id
INNER JOIN m_district D ON D.district_id = B.district_id
INNER JOIN m_state ST ON ST.state_id = D.state_id;


DROP VIEW IF EXISTS public.vw_m_users;
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
     LEFT JOIN m_roles roles ON users.role_id = roles.role_id;
