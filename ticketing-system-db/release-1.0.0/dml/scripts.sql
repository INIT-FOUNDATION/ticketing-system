INSERT INTO m_roles (role_id,role_name,role_description,is_active,level,date_created,date_modified) VALUES (1,'Universal Admin','Universal Admin',1,'National','2020-10-05 16:48:32','2020-10-05 16:48:32');

INSERT INTO public.m_users(user_id, user_name, display_name, first_name, last_name, mobile_number, email_id, gender, date_of_birth, password, password_last_updated, invalid_attempts, address, role_id, account_locked, is_active, profile_picture_url, is_logged_in, last_logged_in_out, is_deleted, date_created, date_modified, created_by, updated_by) VALUES (1,1234567890,'Universal Admin',NULL,NULL,1234567890,NULL,1, NULL, '$2a$10$oYltaj4Jv9M5VXXPR4daPuz/m5sYSPt5oVxp48JkRw3ajfGrdTU1i', NOW(), NULL, NULL, 1, 0, 1, NULL, NULL, NULL, 0, NOW(), NOW(), 1, 1);
	
INSERT INTO password_complexity VALUES
(1,0,1,5,0,0,0,0,'!@#$&*',100,'2020-10-14 15:03:22','2020-12-29 03:29:22');

INSERT INTO m_country(country_id, country_name, latitude, longitude, date_created, date_modified) VALUES
(1, 'India', 20.00000000, 20.00000000, '05-10-2020 16:48:32', '05-10-2020 16:48:32');

INSERT INTO public.m_app_version(app_id, app_version, apk_version, apk_link, force_update, remarks, release_date, date_created, date_modified) VALUES (1, '1.0.0', '1.0', 'init.apk', 1, 'new', now(), now(), now());

INSERT INTO public.m_menus(menu_id, menu_name, menu_description, is_active, parent_menu_id, menu_order, route_url, icon_class, date_created, date_modified) VALUES (1, 'Tickets', 'Tickets Creation', 1, NULL, 0, '/tickets', 'custom-notepad', NOW(), NOW());

	   
INSERT INTO public.access_control(
	role_id, menu_id, per_id, date_created, date_modified, created_by, updated_by)
	VALUES (1, 1, 1, NOW(), NOW(), 1, 1),
	       (1, 1, 2, NOW(), NOW(), 1, 1);


INSERT INTO m_roles (role_id,role_name,role_description,is_active,level,date_created,date_modified) VALUES (2,'Admin','Admin',1,'National','2020-10-05 16:48:32','2020-10-05 16:48:32');  
INSERT INTO m_roles (role_id,role_name,role_description,is_active,level,date_created,date_modified) VALUES (3,'Auditor','Auditor',1,'National','2020-10-05 16:48:32','2020-10-05 16:48:32');  