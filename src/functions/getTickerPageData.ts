const axios = require("axios");

import ALL_DATA from "../interfaces/ALL_DATA";
import company_profile from "../interfaces/company_profile";
import company_quote from "../interfaces/company_quote";
import related_stock from "../interfaces/related_stocks";
import getSameAs from "./getSameAsLinks";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

//everything about a company EXECPT price
async function getCompanyProfile(ticker: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/profile/" +
        ticker.toUpperCase() +
        "?apikey=" +
        process.env.STOCK_API_KEY
    );

    //only return data needed
    let returnData: company_profile = {
      symbol: data.data[0].symbol,
      market_cap: data.data[0].mktCap,
      name: data.data[0].companyName,
      exchange: data.data[0].exchangeShortName,
      image: data.data[0].image,
      website: data.data[0].website,
      description: data.data[0].description,
      address: data.data[0].address,
      city: data.data[0].city,
      state: data.data[0].state,
      ceo: data.data[0].ceo,
      phone: data.data[0].phone,
      num_of_employees: data.data[0].fullTimeEmployees,
      industry: data.data[0].industry,
      sector: data.data[0].sector,
    };

    return returnData;
  } catch (e) {
    console.log("error getting company profile :(");
    return null;
  }
}

//use this function to get price changes for the day
async function getCompanyQuote(ticker: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/quote/" +
        ticker.toUpperCase() +
        "?apikey=" +
        process.env.STOCK_API_KEY
    );

    let returnData: company_quote = {
      price: data.data[0].price,
      change: data.data[0].change,
      percent_change: data.data[0].changesPercentage,
      day_low: data.data[0].dayLow,
      day_high: data.data[0].dayHigh,
      year_low: data.data[0].yearLow,
      year_high: data.data[0].yearHigh,
      eps: data.data[0].eps,
      shares_outstanding: data.data[0].sharesOutstanding,
    };

    return returnData;
  } catch (e) {
    console.log("could not get company quote :(");
    return null;
  }
}

async function getPriceHistory(ticker: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/historical-price-full/" +
        ticker +
        "?serietype=line&apikey=" +
        process.env.STOCK_API_KEY
    );

    //only need the most recent 30 days
    //DONT WANT TO SEND BACK MASSIVE ARRAY TO FRONTEND
    if (data.data.historical.length > 30) {
      data.data.historical.length = 30;
      return data.data.historical;
    } else {
      return data.data.historical;
    }
  } catch (e) {
    console.log("error while getting price history :(");
    return null;
  }
}

async function getRelatedStocks(ticker: string, sector: string) {
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
    //only send back company profile data needed (related_stock interface)
    const returnData: related_stock[] = ALLCOMPANYDATA.map((stock: any) => {
      return {
        name: stock.companyName,
        ticker: stock.symbol,
        price: stock.price,
        logo: stock.image,
        number_change: stock.changes.toFixed(2),
        percent_change: Number(
          ((stock.changes / stock.price) * 100).toFixed(2)
        ),
        exchange: stock.exchangeShortName,
      };
    });

    return returnData;
  } catch (e) {
    console.log("error while getting related stocks");
    return null;
  }
}

async function getStockNews(ticker: any) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock_news?tickers=" +
        ticker.toUpperCase() +
        "&limit=10&apikey=" +
        process.env.STOCK_API_KEY
    );

    return data.data;
  } catch (e) {
    console.log("cannot get stock news :(");
    return null;
  }
}

async function getCompanyCoreData(ticker: any) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v4/company-core-information?symbol=" +
        ticker.toUpperCase() +
        "&apikey=" +
        process.env.STOCK_API_KEY
    );

    let y = {
      sicCode: data.data[0].sicCode,
      taxID: data.data[0].taxIdentificationNumber,
    };

    return y;
  } catch (e) {
    console.log("could not get company core data :(");
    return null;
  }
}

async function isStockMarketOpen() {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=" +
        process.env.STOCK_API_KEY
    );
    return data.data.isTheStockMarketOpen;
  } catch (e) {
    console.log("Could not get stock market hours :(");
    return null;
  }
}

async function getImportantPeople(ticker: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/key-executives/" +
        ticker.toUpperCase() +
        "?apikey=" +
        process.env.STOCK_API_KEY
    );
    return data.data;
  } catch (e) {
    console.log("Could not get important poeple :(");
    return null;
  }
}

//
//PROCESS QUERY FUNCTION
//

export default async function PROCESS_QUERY(ticker: string) {
  try {
    const COMPANYPROFILE = await getCompanyProfile(ticker);
    const COMPANYQUOTE = await getCompanyQuote(ticker);
    const PRICEHISTORY = await getPriceHistory(ticker);
    const RELATEDSTOCKS = await getRelatedStocks(
      ticker,
      COMPANYPROFILE!.sector!
    );
    const STOCKNEWS = await getStockNews(ticker);
    const COMPANYCOREINFO = await getCompanyCoreData(ticker);
    const STOCKMARKETHOURS = await isStockMarketOpen();
    const IMPORTANTPEOPLE = await getImportantPeople(ticker);

    const SAMEASDATA: string | null = await getSameAs(ticker);

    //type ALL_DATA in interface folder
    const returnData: ALL_DATA = {
      companyProfile: COMPANYPROFILE,
      companyQuote: COMPANYQUOTE,
      historicalPrices: PRICEHISTORY,
      relatedStocks: RELATEDSTOCKS,
      stockNews: STOCKNEWS,
      companyCoreInfo: COMPANYCOREINFO,
      isStockMarketOpen: STOCKMARKETHOURS,
      importantPeople: IMPORTANTPEOPLE,
      sameAsLinks: SAMEASDATA! ? SAMEASDATA : null,
    };

    return returnData;
  } catch (e) {
    console.log("error getting stock data :(");
    return null;
  }
}
