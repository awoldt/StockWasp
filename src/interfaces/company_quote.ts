export default interface company_quote {
    price: number | null;
    change: number | null;
    percent_change: number | null;
    day_low: number | null;
    day_high: number | null;
    year_low: number | null;
    year_high: number | null;
    eps: number | null;
    shares_outstanding: number | null;
}