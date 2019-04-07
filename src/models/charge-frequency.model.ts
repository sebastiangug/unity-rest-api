export interface ChargeFrequency {
    /** INT, POSSIBLE VALUES: 1 - YEARLY, 2 - MONTHLY, 3 - WEEKLY, 4 - DAILY, 5 - HOURLY */
    id: number;
    /** ONLY 5 VALUES EXIST IN DB: Yearly, Monthly, Weekly, Daily, Hourly, string, cannot be null, max 15 characters */
    frequency_name: string;
}
