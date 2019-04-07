export interface AccessLevel {
    /** INT, POSSIBLE VALUES: 1 - ORG_ADMIN, 2 - DATA_ACCESS, 3 - STANDARD, 4 - OWNER */
    id: number;
    /** ONLY POSSIBLE VALUES: ORG_ADMIN, DATA_ACCESS, STANDARD, OWNER, string, cannot be null, max 15 characters */
    name: string;
}
