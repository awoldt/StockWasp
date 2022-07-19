import axios from "axios";
import { createImportSpecifier } from "typescript";
import related_stock from "../../interfaces/related_stocks";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default async function getRelatedStocks(ticker: string, sector: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock-screener?sector=" +
        sector +
        "&exchange=NYSE,NASDAQ&limit=25&apikey=" +
        process.env.STOCK_API_KEY
    );

    //get all tickers from screener
    //cannot be same as current ticker page stock
    //company name cannot be more than 25 characters
    let tickers = data.data.filter((stock: any) => {
      return (
        stock.symbol !== ticker.toUpperCase() && stock.companyName.length < 27
      );
    });

    let ticks = tickers.map((x: any) => {
      return x.symbol;
    });

    shuffleArray(ticks);
    //only search for 8 company profiles
    ticks.length = 8;
    let allTickersString = ticks.join(",").slice(0, -1);

    let ALLCOMPANYDATA = await axios.get(
      "https://financialmodelingprep.com/api/v3/profile/" +
        allTickersString +
        "?apikey=" +
        process.env.STOCK_API_KEY
    );

    ALLCOMPANYDATA = ALLCOMPANYDATA.data.filter((x: any) => {
      return x !== null;
    });

    const y: any = ALLCOMPANYDATA;
    //only send back company profile data needed (related_stock interface)
    const returnData: related_stock[] = y.map(
      (stock: any) => {
        return {
          name: stock.companyName,
          ticker: stock.symbol,
          logo: stock.image,
          exchange: stock.exchange,
        };
      }
    );

    return returnData;
  } catch (e) {
    console.log("error while getting related stocks");
    return null;
  }
}
