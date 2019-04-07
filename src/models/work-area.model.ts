export interface WorkArea {
    /** GUID OF THE WORK AREA, TO BE USED ONLY FOR 1 ORGANISATION */
    id: string;
    /** GUID THE ORGANISATION THAT IS ABLE TO GET THE WORK AREA DATA */
    org_id: string;
    /** Friendly name of the work area for display purposes, string, cannot be null, 50 max characters */
    name: string;
    /** Text description, can be null, max 250 characters */
    descr?: string;
    /** Latitude, using decimal 9,6, can be null */
    lat?: number;
    /** Longitude, using decimal 9,6, can be null */
    lng?: number;
    /** Address line, mostly for display purposes, string, 100 max characters, can be null */
    address?: string;
    /** Postcode for internal purposes, string, can be null, 10 max characters */
    postcode?: string;
    /** Timestamp, set by database, defaul value CURRENT_TIMESTAMP, cannot be null */
    added_on: Date;
    /** Email address of who added the work area, cannot be null, string, 50 max characters */
    added_by: string;
}
