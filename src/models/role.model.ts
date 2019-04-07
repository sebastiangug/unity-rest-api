export interface Role {
    id: string;
    /** GUID of the organisation, cannot be null */
    org_id: string;
    /** Friendly name of the role, string, cannot be null, max 25 characters */
    role_name: string;
    /** Currency int of the role, must exist on table CURRENCIES, cannot be null, possible values: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR  */
    currency: number;
    /** Boolean/bit, tracks if this role has been created specifically for a user and should not be displayed in the dropdown, cannot be null */
    is_custom: boolean;
    /** number/decimal(19,4), cannot be null */
    standard_rate: number;
    /** number/decimal(19,4), cannot be null */
    standard_hours: number;
    /** number/decimal(19,4), cannot be null */
    overtime_rate: number;
    /** number/decimal(19,4), can be null */
    secondary_overtime_rate: number;
    /** INT, id, must exist on table CHARGE_FREQUENCIES, cannot be null, possible values: 1 - YEARLY, 2 - MONTHLY, 3 - WEEKLY, 4 - DAILY, 5 - HOURLY */
    rate_frequency: number;
    /**string, email of the user that created this role, cannot be null, max 50 characters */
    added_by: string;
    /** timestamp of when the role was created, datetime, cannot be null, added by database, default value: CURRENT_TIMESTAMP */
    added_on: Date;
}
