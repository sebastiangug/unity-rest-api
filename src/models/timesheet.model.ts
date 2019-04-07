export interface Timesheet {
    id: string;
    /** GUID OF THE USER THIS TIMESHEET IS ABOUT, cannot be null */
    user_id: string;
    /** GUID OF THE ROLE THIS TIMESHEET IS ABOUT, cannot be null */
    role_id: string;
    /** string/date of the day this timesheet is on, cannot be null */
    day: Date;
    /** INT/number how many minutes have been worked on the standard rate */
    standard_minutes: number;
    /** INT/number how many minutes have been worked on the overtime rate */
    overtime_minutes: number;
    /** BIT/boolean if the overtime minutes are for the first or secondary overtime rate */
    overtime_is_custom: boolean;
    /** GUID of the user that has submitted this timesheet, could be the user that the timesheet is about or his submitter */
    submitted_by_id: string;
    /** GUID of the work area this timesheet is for, can be null, could be different from the work area the user is assigned to, MUST EXIST IN WORK_AREAS TABLE */
    work_area: string;
    /** TIMESTAMP of when this timesheet was inserted into the database, added by db, default value: CURRENT_TIMESTAMP */
    added_on: Date;
}
