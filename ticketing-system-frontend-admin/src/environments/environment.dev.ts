const BASE_URL = 'https://apipt.dev.aieze.in';
const DIRECT_BASE_URL = 'https://apipt.dev.aieze.in';
const API_ADMIN_PORT = ``;
const API_AUTH_PORT = ``;
const API_USER_PORT = ``;
const API_REGISTRATION_PORT = ``;
const API_APPOINTMENT_PORT = ``;
const API_SESSION_PORT = ``;
const API_REPORTS_PORT = ``;
const API_CRM_PORT = ``;
const API_WEBSOCKET_PORT = ``;

export const environment = {
  production: false,
  defaultLanguage: 'en',
  supportedLanguages: [
    { id: 'en', name: 'English', regional: 'English' },
  ],
  admin_prefix_url_port: `${DIRECT_BASE_URL}${API_ADMIN_PORT}`,
  socket_admin_prefix_url_port: `${BASE_URL}:9001`,
  session_prefix_url_port: `${BASE_URL}:9005`,
  admin_prefix_url: `${BASE_URL}${API_ADMIN_PORT}/api/v1/admin`,
  admin_prefix_url_v2: `${BASE_URL}${API_ADMIN_PORT}/api/v2/admin`,
  patient_registration_prefix_url: `${BASE_URL}${API_REGISTRATION_PORT}/api/v1/registration`,
  appointment_url : `${BASE_URL}${API_APPOINTMENT_PORT}/api/v1/appointment`,
  admin_prefix_url_v2_direct: `${DIRECT_BASE_URL}${API_ADMIN_PORT}/api/v2/admin`,
  auth_prefix_url: `${BASE_URL}${API_AUTH_PORT}/api/v1/auth`,
  user_prefix_url: `${BASE_URL}${API_USER_PORT}/api/v1/user`,
  session_prefix_url: `${BASE_URL}${API_SESSION_PORT}/api/v1/session`,
  beneficiary_registration_prefix_url: `${BASE_URL}${API_REGISTRATION_PORT}/api/v1/registration`,
  admin_prefix_direct_url: `${DIRECT_BASE_URL}${API_ADMIN_PORT}/api/v1/admin`,
  session_prefix_direct_url: `${DIRECT_BASE_URL}${API_SESSION_PORT}/api/v1/session`,
  recaptcha_site_key: '6LdNBNUZAAAAAAYITU9accPJNhMSzHMsuqc99RPE',
  report_prefix_direct_url: `${BASE_URL}${API_REPORTS_PORT}/api/v1/reports`,
  report_prefix_url: `${DIRECT_BASE_URL}${API_REPORTS_PORT}/api/v1/reports`,
  crm_prefix_url: `${DIRECT_BASE_URL}${API_CRM_PORT}/api/v1/crm`,
  crm_prefix_direct_url: `${BASE_URL}${API_CRM_PORT}/api/v1/crm`,
  websocket_prefix_direct_url: `${BASE_URL}${API_WEBSOCKET_PORT}`,
  safevac_oauth_sso_uri: `https://safevac.nhp.gov.in/service/uaa/oauth/authorize?response_type=code&state=&client_id=cowin_dio&scope=&redirect_uri=${BASE_URL}/beneficiarymanagement`,
  redirect_uri: `${BASE_URL}/beneficiarymanagement`,
  isUat: false,
  chatboturl: 'https://covid19-staging.nhp.gov.in:80/admin/',
  env: 'OtherEnv',
  google_map_api_key: '',


  //Support Grievance
  registration_url_v2_cdn: `${BASE_URL}${API_REGISTRATION_PORT}/api/v2/registration`,
  local_url: 'http://localhost:4200',
  REPEAT_PER_DAY: {
    1: ['7:00'],
    2: ['7:00','21:00'],
    3: ['7:00','12:00','21:00'],
    4: ['7:00','12:00','16:00','21:00'],
    5: ['7:00','12:00','16:00','18:00','21:00']
  },
  ROLES: {
    HOSPITAL_ADMINISTRATOR: 'Hospital Administrator',
    ORGANIZATION_ADMINISTARTOR: 'Organization Administrator',
    PSYCHIATRIST: 'Psychiatrist',
    DOCTOR: 'Doctor',
    PSYCHOLOGIST: 'Psychologist',
    RECEPTIONIST: 'Receptionist',
    COUNSELOR: 'Counsellor',
    ACCOUNT_MANAGER: 'Account Manager'
  },
  BED_SELECTION_REQUIRED: ['IPD', 'EMERGENCY'],
  APPOINTMENT_STATUS : {
    1: 'SCHEDULED',
    2: 'RESCHEDULED',
    3: 'CANCELLED',
    4: 'ONGOING',
    5: 'CLOSED',
    6: 'PAYMENT PENDING',
    7: 'PAYMENT LINK GENERATED',
    8: 'PAYMENT LINK EXPIRED',
    9: 'PAYMENT FAILED',
    10: 'PAYMENT LINK REGENERATED',
    11: 'UNASSIGNED',
    12: 'ASSIGNED',
    13: 'DISCHARGE',
    14: 'FINAL BILL GENERATED',
  },
  when: {
    "Before Food": {en: "Before Food", hi: "खाने से पहले", tl: "తినడానికి ముందు", mr: "जेवायच्या आधी", kn: "ಆಹಾರದ ಮೊದಲು"},
    "After Food": {en: "After Food", hi: "खाने के बाद", tl: "తిన్న తరువాత", mr: "जेवल्या नंतर", kn: "ಆಹಾರದ ನಂತರ"},
    "Before Breakfast": {en: "Before Breakfast", hi: "नाश्ते से पहले", tl: "అల్పాహారం ముందు", mr: "नाष्ट्याच्या आधी", kn: "ಬೆಳಗಿನ ಉಪಾಹಾರದ ಮೊದಲು"},
    "After Breakfast": {en: "After Breakfast", hi: "नाश्ते के बाद", tl: "అల్పాహారం తరువాత", mr: "नाष्ट्याच्या नंतर", kn: "ಬೆಳಗಿನ ಉಪಾಹಾರದ ನಂತರ"},
    "Before Lunch": {en: "Before Lunch", hi: "दोपहर - खाने से पहले", tl: "మధ్యాహ్నం - భోజనానికి ముందు", mr: "दुपारी जेवण्याच्या आधी", kn: "ಊಟದ ಮೊದಲು"},
    "After Lunch": {en: "After Lunch", hi: "दोपहर - खाने के बाद", tl: "మధ్యాహ్నం - రాత్రి భోజనం తర్వాత", mr: "दुपारी जेवल्या नंतर", kn: "ಮಧ್ಯಾನ್ನದ ಊಟದ ನಂತರ"},
    "Before Dinner": {en: "Before Dinner", hi: "रात - खाने से पहले", tl: "రాత్రి భోజనం ముందు", mr: "रात्री जेवण्याच्या आधी", kn: "ಊಟದ ಮುಂಚೆ"},
    "After Dinner": {en: "After Dinner", hi: "रात - खाने के बाद", tl: "రాత్రి భోజనం తర్వాత", mr: "रात्री जेवल्या नंतर", kn: "ಊಟದ ನಂತರ"},
    "Empty Stomach": {en: "Empty Stomach", hi: "खाली पेट", tl: "ఖాళీ కడుపుతో", mr: "रिकामी पोटी", kn: "ಖಾಲಿ ಹೊಟ್ಟೆ"},
    "Bed Time": {en: "Bed Time", hi: "सोने से पहले", tl: "నిద్రకు ముందు", mr: "झोपायच्या आधी", kn: "ಮಲಗುವ ಸಮಯ"},
    "Sos": {en: "Sos", hi: "जब जरूरत", tl: "ఎప్పుడు అవసరమైతే", mr: "गरज असेल तेव्हां", kn: "ಯಾವಾಗ ಬೇಕಾದರೂ"},
  },
  frequency: {
    "Daily": {en: "Daily", hi: "रोज", tl: "రోజువారీ", mr: "रोज", kn: "ಪ್ರತಿದಿನ"},
    "Alternate Day": {en: "Alternate Day", hi: "हर दूसरे दिन", tl: "ప్రత్యామ్నాయ రోజు", mr: "एक दिवस सोडून", kn: "ಪರ್ಯಾಯ ದಿನ"},
    "Weekly": {en: "Weekly", hi: "हफ़्ते में एक बार", tl: "వారానికోసారి", mr: "आठवड्याने एकदा", kn: "ಸಾಪ್ತಾಹಿಕ"},
    "Fort Night": {en: "Fort Night", hi: "पाक्षिक", tl: "ఫోర్ట్ నైట్", mr: "पंधरा दिवसाने एकदा", kn: "ಫೋರ್ಟ್ ನೈಟ್"},
    "Monthly": {en: "Monthly", hi: "महीने में एक बार", tl: "నెలవారీ", mr: "महिन्याने एकदा", kn: "ಮಾಸಿಕ"}
  },
  languages: [
    {lang_id: "en", lang_name: "English", active: true},
    {lang_id: "hi", lang_name: "Hindi"},
    {lang_id: "mr", lang_name: "Marathi"},
    {lang_id: "tl", lang_name: "Telugu"},
    {lang_id: "kn", lang_name: "Kannada"}
  ],
  meeting_prefix_link: `http://telemedicine.aieze.in`,
};
