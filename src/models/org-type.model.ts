export interface OrgType {
    /**int, possible types: 1-Small to Medium Company, 2-Labour Agency, 3-Enterprise  */
    id: number;
    /** string, cannot be null, max 15 characters, possible values: Small to Medium Company, Labour Agency, Enterprise */
    name: string;
}
