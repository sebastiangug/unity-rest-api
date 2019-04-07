export interface TimesheetStatus {
    /** INT of the status, cannot be null, possible values: 1-PENDING, 2-APPROVED, 3-COMPLETED, 4-DRAFT */
    id: number;
    /** NAME OF THE TIMESHEET STATUS, string, max 10 characters, cannot be null, possible values:  1-PENDING, 2-APPROVED, 3-COMPLETED, 4-DRAFT */
    name: string;
}
