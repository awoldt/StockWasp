import axios from "axios";

async function getInsiderReports() {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v4/insider-trading?page=0&apikey=" +
        process.env.STOCK_API_KEY
    );
    if (data.data.length == 0) {
      return null;
    } else {
      let uniqueSymbols: string[] = [];
      data.data.forEach((x: any) => {
        if (uniqueSymbols.indexOf(x.symbol) == -1) {
          uniqueSymbols.push(x.symbol);
        }
      });

      //get all company profile data for each companyst c
      const companyProfileData = await axios.get(
        "https://financialmodelingprep.com/api/v3/profile/" +
          uniqueSymbols.join(",") +
          "?apikey=" +
          process.env.STOCK_API_KEY
      );

      let FINALDATA = data.data.map((stock: any) => {
        //find the first company profile with same ticker and break loop
        for (let i = 0; i < companyProfileData.data.length; ++i) {
          if (stock.symbol == companyProfileData.data[i].symbol) {
            return {
              filingDate: stock.filingDate.split(" ")[0],
              transactionDate: stock.transactionDate,
              transactionType: stock.transactionType,
              person: stock.reportingName,
              person_position:
                stock.typeOfOwner.split("officer: ").length > 1
                  ? stock.typeOfOwner.split("officer: ")[1]
                  : stock.typeOfOwner == "director"
                  ? "Director"
                  : stock.typeOfOwner,
              form_type: stock.formType,
              securities_owned: stock.securitiesOwned,
              securities_transacted: stock.securitiesTransacted,

              sec_link: stock.link,
              company_name: companyProfileData.data[i].companyName,
              company_logo: companyProfileData.data[i].image,
              company_symbol: companyProfileData.data[i].symbol,
            };
          }
        }
      });

      FINALDATA = FINALDATA.filter((x: any) => {
        return x !== undefined;
      });

      return FINALDATA;
    }
  } catch (e) {
    return null;
  }
}

export default async function processQuery() {
  const INSIDERDATA = await getInsiderReports();

  if (INSIDERDATA == null) {
    return null;
  } else {
    return INSIDERDATA;
  }
}
