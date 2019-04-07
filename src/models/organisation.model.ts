export interface Organisation {
    /** GUID OF THE ORGANISATION, string, cannot be null */
    id: string;
    /** Text-friendly name of the organisation, string, cannot be null ,max 50 characters */
    org_name: string;
    /** INT, cannot be null, must exist in ORG_TYPES table, possible values:   /**int, possible types: 1-Small to Medium Company, 2-Labour Agency, 3-Enterprise  */
    type: number;
    /** GUID of the USER that's the owner of the organisation, cannot be null, must exist on USERS table */
    admin_id: string;
    /** Timestamp of the time organisation was created, datetime type, default value: CURRENT_TIMESTAMP */
    added_on: Date;
}
