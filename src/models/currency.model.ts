export interface Currency {
    /** INT, possible values 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    id: number;
    /** currencies available by id: 1 - GBP, 2 - EUR, 3 - USD, 4 - CAD, 5 - AUD, 6 - CNY, 7 - SAR, 8 - INR, 9 - AED, 10 - QAR */
    currency: string;
}
