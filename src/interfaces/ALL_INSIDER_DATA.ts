import insider_data from "./insider_data"
import company_profile from "./company_profile";
export default interface ALL_INSIDER_DATA {
    insider_reports: insider_data[] | null;
    company_profile: company_profile | null;
}