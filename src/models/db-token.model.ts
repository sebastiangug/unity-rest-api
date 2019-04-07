export interface DbToken {
    /** GUID OF THE USER THE TOKEN BELONGS TO, cannot be null, must exist in USERS table */
    user_id: string;
    /** VARCHAR OF THE TOKEN ITSELF, can be null */
    token: string;
    /** SELF_UPDATING TIMESTAMP, set to CURRENT_TIMESTAMP on every update */
    updated_on: Date;
}
