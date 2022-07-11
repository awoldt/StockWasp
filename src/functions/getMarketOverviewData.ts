const axios = require("axios");

async function getGainersAndLosers() {
  try {
    const gainers = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=" +
        process.env.STOCK_API_KEY
    );
    const losers = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=" +
        process.env.STOCK_API_KEY
    );

    return {
      gainers: gainers.data,
      losers: losers.data,
    };
  } catch (e) {
    console.log("cannot get gainers/losers data :(");
    return null;
  }
}

async function getMostActive() {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=" +
        process.env.STOCK_API_KEY
    );

    //tally up all the stock symbols to make one massive company profile request
    let tickers = data.data.map((x: any) => {
      return x.symbol;
    });
    let allTickersString = tickers.join(",").slice(0, -1);

    const ALLCOMPANYDATA = await axios.get(
      "https://financialmodelingprep.com/api/v3/profile/" +
        allTickersString +
        "?apikey=" +
        process.env.STOCK_API_KEY
    );

    return ALLCOMPANYDATA.data;
  } catch (e) {
    console.log("cannot get most active stocks :(");
    return null;
  }
}

export default async function PROCESS_DATA() {
  const GAINLOSSDATA = await getGainersAndLosers();
  const MOSTACTIVE = await getMostActive();

  //show the most active stocks by highest volume to lowest on frontend
  MOSTACTIVE.sort((a: any, b: any) => {
    return b.volAvg - a.volAvg;
  });

  return {
    gainLoss: GAINLOSSDATA,
    mostActive: MOSTACTIVE,
  };
}
