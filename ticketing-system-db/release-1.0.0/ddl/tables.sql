CREATE TABLE m_app_version (
  app_id SERIAL PRIMARY KEY,
  app_version VARCHAR(10),
  apk_version VARCHAR(10),
  apk_link VARCHAR(255),
  force_update SMALLINT DEFAULT '1',
  remarks VARCHAR(255),
  release_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_country (
  country_id int NOT NULL,
  country_name varchar(100) NOT NULL,
  latitude decimal(11,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  date_created TIMESTAMP NOT NULL,
  date_modified TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (country_id)
);

CREATE TABLE m_state (
  state_id SERIAL PRIMARY KEY,
  state_name varchar(100) NOT NULL,
  country_id INTEGER NOT NULL DEFAULT 1,
  latitude DECIMAL(11,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  state_or_ut varchar(100),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_district (
  district_id SERIAL PRIMARY KEY,
  district_name VARCHAR(100) NOT NULL,
  state_id INTEGER NOT NULL,
  latitude DECIMAL(11,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_sub_district (
  sub_district_id SERIAL PRIMARY KEY,
  sub_district_name VARCHAR(100) NOT NULL,
  district_id INTEGER NOT NULL,
  latitude DECIMAL(11,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_block (
  block_id SERIAL PRIMARY KEY,
  block_name VARCHAR(100) NOT NULL,
  district_id INTEGER NOT NULL,
  latitude DECIMAL(11,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_village (
  village_id SERIAL PRIMARY KEY,
  village_name VARCHAR(100) NOT NULL,
  state_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL,
  block_id INTEGER NOT NULL,
  latitude DECIMAL(11,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_pincodes (
  circle_name VARCHAR(100),
  region_name VARCHAR(100),
  division_name VARCHAR(100),
  office_name VARCHAR(100),
  office_type VARCHAR(100),
  pincode VARCHAR(6),
  delivery VARCHAR(100),
  state_id INTEGER,
  state_name VARCHAR(100),
  district_id INTEGER,
  district_name VARCHAR(100),
  latitude decimal(11,8),
  longitude decimal(11,8),
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_complexity (
  id INTEGER NOT NULL,
  password_expiry SMALLINT NOT NULL,
  password_history SMALLINT NOT NULL,
  min_password_length SMALLINT NOT NULL,
  complexity SMALLINT DEFAULT NULL,
  alphabetical SMALLINT DEFAULT NULL,
  numeric SMALLINT DEFAULT NULL,
  special_chars SMALLINT DEFAULT NULL,
  allowed_special_chars varchar(50) DEFAULT NULL,
  max_invalid_attempts INTEGER NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE m_menus (
  menu_id SERIAL PRIMARY KEY,
  menu_name VARCHAR(100) NOT NULL UNIQUE,
  menu_description VARCHAR(100) DEFAULT NULL,
  is_active SMALLINT NOT NULL,
  parent_menu_id INTEGER DEFAULT 0,
  menu_order INTEGER DEFAULT 0,
  route_url VARCHAR(100) DEFAULT NULL,
  icon_class VARCHAR(100) DEFAULT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.access_control(
    role_id integer NOT NULL,
    menu_id integer NOT NULL,
    per_id integer NOT NULL,
    date_created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by integer,
    updated_by integer
);

CREATE TABLE m_users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    mobile_number BIGINT NOT NULL,
    email_id VARCHAR(100) NULL,
    gender SMALLINT NULL,
    date_of_birth DATE NULL,
    password VARCHAR(100) NOT NULL,
    password_last_updated TIMESTAMP DEFAULT NULL,
    invalid_attempts INT NULL,
    address VARCHAR(250) NULL,
    role_id INTEGER NOT NULL,
    account_locked SMALLINT NOT NULL,
    is_active SMALLINT NOT NULL,
    profile_picture_url VARCHAR(100) NULL,
    is_logged_in SMALLINT NULL,
    last_logged_in_out TIMESTAMP NULL,
    is_deleted SMALLINT DEFAULT 0,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER DEFAULT NULL,
    updated_by INTEGER DEFAULT NULL
);

CREATE TABLE m_users_history (
    id SERIAL PRIMARY KEY,
    user_id_parent INTEGER DEFAULT NULL,
    user_name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    mobile_number BIGINT NOT NULL,
    email_id VARCHAR(100) NULL,
    gender SMALLINT NULL,
    date_of_birth DATE NULL,
    password VARCHAR(100) NOT NULL,
    password_last_updated TIMESTAMP DEFAULT NULL,
    invalid_attempts INT NULL,
    identity_id VARCHAR(100) NULL,
    address VARCHAR(250) NULL,
    role_id INTEGER NOT NULL,
    account_locked SMALLINT NOT NULL,
    is_active SMALLINT NOT NULL,
    profile_picture_url VARCHAR(100) NULL,
    is_logged_in SMALLINT NULL,
    last_logged_in_out TIMESTAMP NULL,
    is_deleted SMALLINT DEFAULT 0,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER DEFAULT NULL,
    updated_by INTEGER DEFAULT NULL
);

CREATE TABLE m_roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL UNIQUE,
  role_description VARCHAR(100) DEFAULT NULL,
  is_active SMALLINT NOT NULL,
  level VARCHAR(100) NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);

CREATE TABLE m_sites (
  site_id SERIAL PRIMARY KEY,
  site_name VARCHAR(100) NOT NULL UNIQUE,
  site_type SMALLINT NOT NULL,
  address VARCHAR(500),
  site_code VARCHAR(100) NOT NULL UNIQUE,
  block_id INTEGER NOT NULL,
  primary_contact_name VARCHAR(100) NOT NULL,
  primary_contact_number BIGINT NOT NULL,
  secondary_contact_name VARCHAR(100),
  secondary_contact_number BIGINT,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);

CREATE TABLE m_vendors (
  vendor_id SERIAL PRIMARY KEY,
  vendor_name VARCHAR(100) NOT NULL UNIQUE,
  primary_contact_name VARCHAR(100) NOT NULL,
  primary_contact_number BIGINT NOT NULL,
  email_id VARCHAR(100),
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);


CREATE TABLE m_products (
  product_id SERIAL PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  site_id INTEGER NOT NULL,
  vendor_id INTEGER NOT NULL,
  serial_number BIGINT NOT NULL,
  model_number VARCHAR(100) NOT NULL,
  installation_date TIMESTAMP,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);


CREATE TABLE m_tickets (
  ticket_id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(100) NOT NULL,
  ticket_mode SMALLINT NOT NULL,
  product_id INTEGER NOT NULL,
  description VARCHAR(500),
  opening_date TIMESTAMP,
  closing_date TIMESTAMP,
  remarks VARCHAR(500),
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);

CREATE TABLE m_ticket_documents (
  doc_id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  doc_title VARCHAR(100) NOT NULL,
  doc_url VARCHAR(500) NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);

CREATE TABLE tr_visits (
  visit_id SERIAL PRIMARY KEY,
  visit_type SMALLINT NOT NULL,
  visit_date TIMESTAMP,
  visit_by VARCHAR(100) NOT NULL,
  remarks VARCHAR(500) NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);

CREATE TABLE tr_visit_documents (
  visit_doc_id SERIAL PRIMARY KEY,
  visit_id INTEGER NOT NULL,
  doc_title VARCHAR(100) NOT NULL,
  doc_url VARCHAR(500) NOT NULL,
  status SMALLINT DEFAULT 1,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT NULL,
  updated_by INTEGER DEFAULT NULL
);