import company_profile from "./company_profile";
import related_stock from "./related_stocks";
import stock_news from "./stock_news";
import company_quote from './company_quote'

interface historical_data {
  date: string | null;
  close: number | null;
}

interface core_info {
  sicCode: number | null;
  taxID: number | null;
}

interface imporant_people {
  title: string | null;
  name: string | null;
}

export default interface ALL_DATA {
  companyProfile: company_profile | null;
  companyQuote: company_quote | null,
  historicalPrices: historical_data[] | null;
  relatedStocks: related_stock[] | null;
  stockNews: stock_news[] | null;
  companyCoreInfo: core_info | null;
  isStockMarketOpen: boolean | null;
  importantPeople: imporant_people[] | null;
}
