import axios from "axios";

export default async function getInsiderInfo(symbol: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v4/insider-trading?symbol=" +
        symbol.toUpperCase() +
        "&page=0&apikey=" +
        process.env.STOCK_API_KEY
    );
    if (data.data.length == 0) {
      return null;
    } else {
      return data.data;
    }
  } catch (e) {
    return null;
  }
}
