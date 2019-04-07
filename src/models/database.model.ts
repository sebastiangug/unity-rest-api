/** USERS TABLE FROM DATABASE */
export const USERS = {
    /** JUST THE TABLE NAME */
    table: 'USERS',
    /** GUID, string, set by database, cannot be null  */
    id: 'USERS.id',
    /** GUID of the role, unique for the organisation, string, can be null, MUST EXIST IN ROLES TABLE  */
    role_id: 'USERS.role_id',
    /** GUID of the organisation the users belongs to, string, cannot be null, MUST EXIST IN ORGANISATIONS TABLE */
    org_id: 'USERS.org_id',
    /** Full name, string, cannot be null, max 70 characters  */
    full_name: 'USERS.full_name',
    /** Email used for auth, string, cannot be null, max 50 characters */
    email: 'USERS.email',
    /** OID of the user that manages the user, he will approve the timesheets for the user and have tha bility to submit it, can be null */
    manager_id: 'USERS.manager_id',
    /** Name of parent company, manually inserted, not necessarily same as organisation, string, cannot be null, max 50 characters */
    parent_company: 'USERS.parent_company',
    /** Tracks if the users ever signed in, boolean/bit, cannot be null */
    is_onboarded: 'USERS.is_onboarded',
    /** Tracks if users is able to login & submit his own timesheets, boolean/bit, cannot be null */
    self_submits: 'USERS.self_submits',
    /** GUID of the microsoft profile, string, can be null, max 50 characters */
    microsoft_id: 'USERS.microsoft_id',
    /** ID of the google profile, string, can be null, max 50 characters */
    google_id: 'USERS.google_id',
    /** ID of the facebook profile, string, can be null, max 50 characters */
    facebook_id: 'USERS.facebook_id',
    /** Email address of who adds the users, string, cannot be null, 50 characters */
    added_by: 'USERS.added_by',
    /** When the userS has been created, datetime, added by database as CURRENT_TIMESTAMP, cannot be null */
    timestamp: 'USERS.timestamp',
    /** INT ID of a row from the table USERS_TYPES, cannot be null, MUST EXIST IN USERS_TYPES TABLE */
    type: 'USERS.type',
    /** GUID of work area the userS is assigned to, unique within the organisation, can be null, work areas are created by org admin at organisation level, MUST EXIST IN WORK_AREAS TABLE */
    work_area: 'USERS.work_area',
    /** INT ID of what access level the userS has, cannot be null, 1 = ORG_ADMIN, 2 = DATA_ACCESS, 3 = STANDARD, MUST EXIST IN ACCESS_LEVELS TABLE */
    access_level: 'USERS.access_level'
};

/** CHARGE_FREQUENCIES TABLE FROM DATABASE */
export const CHARGE_FREQUENCIES = {
    /** JUST THE TABLE NAME */
    table: 'CHARGE_FREQUENCIES',
    /** INT, POSSIBLE VALUES: 1 - YEARLY, 2 - MONTHLY, 3 - WEEKLY, 4 - DAILY, 5 - HOURLY */
    id: 'CHARGE_FREQUENCIES.id',
    /** ONLY 5 VALUES EXIST IN DB: Yearly, Monthly, Weekly, Daily, Hourly, string, cannot be null, max 15 characters */
    frequency_name: 'CHARGE_FREQUENCIES.frequency_name'
};

/** ACCESS_LEVELS TABLE FROM DATABASE */
export const ACCESS_LEVELS = {
    /** JUST THE TABLE NAME */
    table: 'ACCESS_LEVELS',
    /** INT, POSSIBLE VALUES: 1 - ORG_ADMIN, 2 - DATA_ACCESS, 3 - STANDARD, 4 - OWNER */
    id: 'ACCESS_LEVELS.id',
    /** ONLY POSSIBLE VALUES: ORG_ADMIN, DATA_ACCESS, STANDARD, OWNER, string, cannot be null, max 15 characters */
    name: 'ACCESS_LEVELS.name'
};

/** CURRENCIES TABLE FROM DATABASE */
export const CURRENCIES = {
    /** JUST THE TABLE NAME */
    table: 'CURRENCIES',
    /** INT, possible values 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    id: 'CURRENCIES.id',
    /** currencies available by id: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    currency: 'CURRENCIES.currency'
};

/** ORG_CONFIG TABLE FROM DATABASE */
export const ORG_CONFIG = {
    /** JUST THE TABLE NAME */
    table: 'ORG_CONFIG',
    /** INT, cannot be null, set by database */
    id: 'ORG_CONFIG.id',
    /** GUID OF THE ORGANISATION */
    org_id: 'ORG_CONFIG.org_id',
    /** INT ID FROM THE CURRENCIES TABLE, POSSIBLE VALUES: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    default_currency: 'ORG_CONFIG.default_currency'
};

/** ORG_TYPES TABLE FROM DATABASE */
export const ORG_TYPES = {
    /** JUST THE TABLE NAME */
    table: 'ORG_TYPES',
    /**int, possible types: 1-Small to Medium Company, 2-Labour Agency, 3-Enterprise  */
    id: 'ORG_TYPES.id',
    /** string, cannot be null, max 15 characters, possible values: Small to Medium Company, Labour Agency, Enterprise */
    name: 'ORG_TYPES.name'
};

/** ORGANISATIONS TABLE FROM DATABASE */
export const ORGANISATIONS = {
    /** JUST THE TABLE NAME */
    table: 'ORGANISATIONS',
    /** GUID OF THE ORGANISATION, string, cannot be null */
    id: 'ORGANISATIONS.id',
    /** Text-friendly name of the organisation, string, cannot be null ,max 50 characters */
    org_name: 'ORGANISATIONS.org_name',
    /** INT, cannot be null, must exist in ORG_TYPES table, possible values:   /**int, possible types: 1-Small to Medium Company, 2-Labour Agency, 3-Enterprise  */
    type: 'ORGANISATIONS.type',
    /** GUID of the USER that's the owner of the organisation, cannot be null, must exist on USERS table */
    admin_id: 'ORGANISATIONS.admin_id',
    /** Timestamp of the time organisation was created, datetime type, default value: CURRENT_TIMESTAMP */
    added_on: 'ORGANISATIONS.added_on'
};

/** ROLES TABLE FROM DATABASE */
export const ROLES = {
    /** JUST THE TABLE NAME */
    table: 'ROLES',
    /** GUID OF THE ROLE -- EACH ROLE IS AVAILABLE WITHIN THEIR ORG ONLY, SET BY THE DATABASE, cannot be null */
    id: 'ROLES.id',
    /** GUID of the organisation, cannot be null */
    org_id: 'ROLES.org_id',
    /** Friendly name of the role, string, cannot be null, max 25 characters */
    role_name: 'ROLES.role_name',
    /** Currency int of the role, must exist on table CURRENCIES, cannot be null, possible values: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR  */
    currency: 'ROLES.currency',
    /** Boolean/bit, tracks if this role has been created specifically for a user and should not be displayed in the dropdown, cannot be null */
    is_custom: 'ROLES.is_custom',
    /** number/decimal(19,4), cannot be null */
    standard_rate: 'ROLES.standard_rate',
    /** number/decimal(19,4), cannot be null */
    standard_hours: 'ROLES.standard_hours',
    /** number/decimal(19,4), cannot be null */
    overtime_rate: 'ROLES.overtime_rate',
    /** number/decimal(19,4), can be null */
    secondary_overtime_rate: 'ROLES.secondary_overtime_rate',
    /** INT, id, must exist on table CHARGE_FREQUENCIES, cannot be null, possible values: 1 - YEARLY, 2 - MONTHLY, 3 - WEEKLY, 4 - DAILY, 5 - HOURLY */
    rate_frequency: 'ROLES.rate_frequency',
    /**string, email of the user that created this role, cannot be null, max 50 characters */
    added_by: 'ROLES.added_by',
    /** timestamp of when the role was created, datetime, cannot be null, added by database, default value: CURRENT_TIMESTAMP */
    added_on: 'ROLES.added_on'
};

/** TIMESHEETS TABLE FROM DATABASE */
export const TIMESHEETS = {
    /** JUST THE TABLE NAME */
    table: 'TIMESHEETS',
    /** GUID OF THE SPECIFIC TIMESHEET */
    id: 'TIMESHEETS.id',
    /** GUID OF THE USER THIS TIMESHEET IS ABOUT, cannot be null */
    user_id: 'TIMESHEETS.user_id',
    /** GUID OF THE ROLE THIS TIMESHEET IS ABOUT, cannot be null */
    role_id: 'TIMESHEETS.role_id',
    /** string/date of the day this timesheet is on, cannot be null */
    day: 'TIMESHEETS.day',
    /** INT/number how many minutes have been worked on the standard rate */
    standard_minutes: 'TIMESHEETS.standard_minutes',
    /** INT/number how many minutes have been worked on the overtime rate */
    overtime_minutes: 'TIMESHEETS.overtime_minutes',
    /** BIT/boolean if the overtime minutes are for the first or secondary overtime rate */
    overtime_is_custom: 'TIMESHEETS.overtime_is_custom',
    /** GUID of the user that has submitted this timesheet, could be the user that the timesheet is about or his submitter */
    submitted_by_id: 'TIMESHEETS.submitted_by_id',
    /** GUID of the work area this timesheet is for, can be null, could be different from the work area the user is assigned to, MUST EXIST IN WORK_AREAS TABLE */
    work_area: 'TIMESHEETS.work_area',
    /** TIMESTAMP of when this timesheet was inserted into the database, added by db, default value: CURRENT_TIMESTAMP */
    added_on: 'TIMESHEETS.added_on'
};

/** WORK_AREAS TABLE IN THE DATABASE */
export const WORK_AREAS = {
    /** JUST THE TABLE NAME */
    table: 'WORK_AREAS',
    /** GUID OF THE WORK AREA, TO BE USED ONLY FOR 1 ORGANISATION */
    id: 'WORK_AREAS.id',
    /** GUID THE ORGANISATION THAT IS ABLE TO GET THE WORK AREA DATA */
    org_id: 'WORK_AREAS.org_id',
    /** Friendly name of the work area for display purposes, string, cannot be null, 50 max characters */
    name: 'WORK_AREAS.name',
    /** Text description, can be null, max 250 characters */
    descr: 'WORK_AREAS.descr',
    /** Latitude, using decimal 9,6, can be null */
    lat: 'WORK_AREAS.lat',
    /** Longitude, using decimal 9,6, can be null */
    lng: 'WORK_AREAS.lng',
    /** Address line, mostly for display purposes, string, 100 max characters, can be null */
    address: 'WORK_AREAS.address',
    /** Postcode for internal purposes, string, can be null, 10 max characters */
    postcode: 'WORK_AREAS.postcode',
    /** Timestamp, set by database, defaul value CURRENT_TIMESTAMP, cannot be null */
    added_on: 'WORK_AREAS.added_on',
    /** Email address of who added the work area, cannot be null, string, 50 max characters */
    added_by: 'WORK_AREAS.added_by'
};

/** TIMESHEET_STATUS TABLE IN THE DATABASE */
export const TIMESHEET_STATUS = {
    /** JUST THE TABLE NAME */
    table: 'TIMESHEET_STATUS',
    /** INT of the status, cannot be null, possible values: 1-PENDING, 2-APPROVED, 3-COMPLETED, 4-DRAFT */
    id: 'TIMESHEET_STATUS.id',
    /** NAME OF THE TIMESHEET STATUS, string, max 10 characters, cannot be null, possible values:  1-PENDING, 2-APPROVED, 3-COMPLETED, 4-DRAFT */
    name: 'TIMESHEET_STATUS.name'
};
