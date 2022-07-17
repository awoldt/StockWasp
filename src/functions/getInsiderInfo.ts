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
      console.log(data.data);

      let returnData: insider_data[] = data.data.map((x: any) => {
        return {
          filingDate: x.filingDate,
          transactionDate: x.transactionDate,
          transactionType: x.transactionType,
          person: x.reportingName,
          person_position: x.typeOfOwner,
          form_type: x.formType,
          securities_owned: x.securitiesOwned,
          securities_transacted: x.securitiesTransacted,
          price: x.price,
          sec_link: x.link,
        };
      });

      return returnData;
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
  const INSIDERREPORTS = await getInsiderReports(symbol);
  const COMPANYPROFILE = await getCompanyProfile(symbol);

  let returnData: ALL_INSIDER_DATA = {
    insider_reports: INSIDERREPORTS,
    company_profile: COMPANYPROFILE,
  };

  console.log(returnData);

  return returnData;
}
