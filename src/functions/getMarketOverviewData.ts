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

export default async function PROCESS_DATA() {
  const GAINLOSSDATA = await getGainersAndLosers();

  return {
    gainLoss: GAINLOSSDATA,
  };
}
