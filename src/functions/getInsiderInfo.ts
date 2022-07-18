import axios from "axios";
import ALL_INSIDER_DATA from "../interfaces/ALL_INSIDER_DATA";
import insider_data from "../interfaces/insider_data";
import company_profile from "../interfaces/company_profile";

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
        if(insider_names.indexOf(x.reportingName.toUpperCase()) == -1) {
          insider_names.push(x.reportingName.toUpperCase())
        }
      })
      insider_names_num_of_trades.length = insider_names.length;
      insider_names_num_of_trades.fill(0);
      insider_names.forEach((x: string, index: number) => {
        data.data.forEach((y: any) => {
          if(x == y.reportingName.toUpperCase()) {
            insider_names_num_of_trades[index] += 1;
          }
        })
      })
      let mostTrades = []
      for(let i=0; i<insider_names.length; ++i) {
        let x: any = new Object();
        x.name = insider_names[i];
        x.trades = insider_names_num_of_trades[i];
        mostTrades.push(x);
      }
      
      mostTrades.sort((a,b) => {
        return b.trades-a.trades
      })
      console.log(mostTrades);

      let returnData: insider_data[] = data.data.map((x: any) => {
        return {
          filingDate: x.filingDate.split(' ')[0],
          transactionDate: x.transactionDate,
          transactionType: x.transactionType,
          person: x.reportingName,
          person_position: x.typeOfOwner.split('officer: ').length > 1 ? x.typeOfOwner.split('officer: ')[1] : x.typeOfOwner == 'director' ? "Director" : x.typeOfOwner,
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
  const COMPANYPROFILE = await getCompanyProfile(symbol);

  let returnData: ALL_INSIDER_DATA = {
    insider_reports: INSIDERREPORTS[0],
    company_profile: COMPANYPROFILE,
    ordered_trades: INSIDERREPORTS[1]
  };

  return returnData;
}
