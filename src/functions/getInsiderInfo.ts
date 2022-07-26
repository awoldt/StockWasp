import axios from "axios";
import ALL_INSIDER_DATA from "../interfaces/ALL_INSIDER_DATA";
import insider_data from "../interfaces/insider_data";
import company_profile from "../interfaces/company_profile";
import related_stock from "../interfaces/related_stocks";

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
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

    const y: any = ALLCOMPANYDATA;
    //only send back company profile data needed (related_stock interface)
    const returnData: related_stock[] = y.map((stock: any) => {
      return {
        name: stock.companyName,
        ticker: stock.symbol,
        logo: stock.image,
        exchange: stock.exchangeShortName,
      };
    });

    return returnData;
  } catch (e) {
    console.log("error while getting related stocks");
    return null;
  }
}

async function getInsiderReports(symbol: String) {
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
      let insider_names: any = []; //all the people who appear on SEC records
      let insider_names_num_of_trades: any = []; //keeps track of the number of trades each person in above array has
      data.data.forEach((x: any) => {
        if (insider_names.indexOf(x.reportingName.toUpperCase()) == -1) {
          insider_names.push(x.reportingName.toUpperCase());
        }
      });
      insider_names_num_of_trades.length = insider_names.length;
      insider_names_num_of_trades.fill(0);
      insider_names.forEach((x: string, index: number) => {
        data.data.forEach((y: any) => {
          if (x == y.reportingName.toUpperCase()) {
            insider_names_num_of_trades[index] += 1;
          }
        });
      });
      let mostTrades = [];
      for (let i = 0; i < insider_names.length; ++i) {
        let x: any = new Object();
        x.name = insider_names[i];
        x.trades = insider_names_num_of_trades[i];
        mostTrades.push(x);
      }
      mostTrades.sort((a, b) => {
        return b.trades - a.trades;
      });

      let returnData: insider_data[] = data.data.map((x: any) => {
        return {
          filingDate: x.filingDate.split(" ")[0],
          transactionDate: x.transactionDate,
          transactionType: x.transactionType,
          person: x.reportingName,
          person_position:
            x.typeOfOwner.split("officer: ").length > 1
              ? x.typeOfOwner.split("officer: ")[1]
              : x.typeOfOwner == "director"
              ? "Director"
              : x.typeOfOwner,
          form_type: x.formType,
          securities_owned: x.securitiesOwned,
          securities_transacted: x.securitiesTransacted,
          price: x.price,
          sec_link: x.link,
        };
      });

      return [returnData, mostTrades];
    }
  } catch (e) {
    return null;
  }
}

async function getCompanyProfile(symbol: string) {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/profile/" +
        symbol.toUpperCase() +
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

export default async function processQuery(symbol: string) {
  const INSIDERREPORTS: any = await getInsiderReports(symbol);
  const COMPANYPROFILE: company_profile | null = await getCompanyProfile(
    symbol
  );
  const RELATEDSTOCKS: any[] | null = await getRelatedStocks(
    COMPANYPROFILE!.symbol!,
    COMPANYPROFILE!.sector!
  );
  //could not get insider info
  if (INSIDERREPORTS == null) {
    return null;
  } else {
    let returnData: ALL_INSIDER_DATA = {
      insider_reports: INSIDERREPORTS[0],
      company_profile: COMPANYPROFILE,
      ordered_trades: INSIDERREPORTS[1],
      related_stocks: RELATEDSTOCKS,
    };

    return returnData;
  }
}
