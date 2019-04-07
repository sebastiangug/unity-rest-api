export interface User {
    /** GUID, string, set by database, cannot be null  */
    id: string;
    /** GUID of the role, unique for the organisation, string, can be null, MUST EXIST IN ROLES TABLE  */
    role_id: string;
    /** GUID of the organisation the users belongs to, string, cannot be null, MUST EXIST IN ORGANISATIONS TABLE */
    org_id: string;
    /** Full name, string, cannot be null, max 70 characters  */
    full_name: string;
    /** Email used for auth, string, cannot be null, max 50 characters */
    email: string;
    /** OID of the user that manages the user, he will approve the timesheets for the user and have tha bility to submit it, can be null */
    manager_id: string;
    /** Name of parent company, manually inserted, not necessarily same as organisation, string, cannot be null, max 50 characters */
    parent_company: string;
    /** Tracks if the users ever signed in, boolean/bit, cannot be null */
    is_onboarded: boolean;
    /** Tracks if users is able to login & submit his own timesheets, boolean/bit, cannot be null */
    self_submits: boolean;
    /** GUID of the microsoft profile, string, can be null, max 50 characters */
    microsoft_id?: string;
    /** ID of the google profile, string, can be null, max 50 characters */
    google_id?: string;
    /** ID of the facebook profile, string, can be null, max 50 characters */
    facebook_id?: string;
    /** ID of the linkedin profile, string, can be null, max 50 characters */
    linkedin_id?: string;
    /** Email address of who adds the users, string, cannot be null, 50 characters */
    added_by: string;
    /** When the userS has been created, datetime, added by database as CURRENT_TIMESTAMP, cannot be null */
    timestamp: Date;
    /** INT ID of a row from the table USERS_TYPES, cannot be null, MUST EXIST IN USERS_TYPES TABLE */
    type: number;
    /** GUID of work area the userS is assigned to, unique within the organisation, can be null, work areas are created by org admin at organisation level, MUST EXIST IN WORK_AREAS TABLE */
    work_area: string;
    /** INT ID of what access level the userS has, cannot be null, 1 = ORG_ADMIN, 2 = DATA_ACCESS, 3 = STANDARD, MUST EXIST IN ACCESS_LEVELS TABLE */
    access_level: number;
    /** VARCHAR(MAX) BASE64 STRING, PLEASE NEVER EVER INCLUDE THIS IN THE TOKEN, ONLY GET IT SEPARATELY */
    photo?: string;
}
