export default interface insider_data {
  filingDate: string | null;
  transactionDate: string | null;
  transactionType: string | null;
  person: string | null;
  person_position: string | null;
  form_type: string | null;
  securities_owned: number | null;
  securities_transacted: number | null;
  price: number | null;
  sec_link: string | null;
}
