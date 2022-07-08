export default interface related_stock {
  name: string;
  ticker: string;
  price: number;
  logo: string;
  number_change: number | null;
  percent_change: number | null;
  exchange: string | null;
}
