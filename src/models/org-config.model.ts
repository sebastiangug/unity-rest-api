export interface OrgConfig {
    /** INT, cannot be null, set by database */
    id: number;
    /** GUID OF THE ORGANISATION */
    org_id: string;
    /** INT ID FROM THE CURRENCIES TABLE, POSSIBLE VALUES: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    default_currency: number;
}
