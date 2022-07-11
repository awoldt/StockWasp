"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
//everything about a company EXECPT price
function getCompanyProfile(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/profile/" +
                ticker.toUpperCase() +
                "?apikey=" +
                process.env.STOCK_API_KEY);
            //only return data needed
            let returnData = {
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
        }
        catch (e) {
            console.log("error getting company profile :(");
            return null;
        }
    });
}
//use this function to get price changes for the day
function getCompanyQuote(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/quote/" +
                ticker.toUpperCase() +
                "?apikey=" +
                process.env.STOCK_API_KEY);
            let returnData = {
                price: data.data[0].price,
                change: data.data[0].change,
                percent_change: data.data[0].changesPercentage,
                day_low: data.data[0].dayLow,
                day_high: data.data[0].dayHigh,
            };
            return returnData;
        }
        catch (e) {
            console.log("could not get company quote :(");
            return null;
        }
    });
}
function getPriceHistory(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/historical-price-full/" +
                ticker +
                "?serietype=line&apikey=" +
                process.env.STOCK_API_KEY);
            //only need the most recent 30 days
            //DONT WANT TO SEND BACK MASSIVE ARRAY TO FRONTEND
            if (data.data.historical.length > 30) {
                data.data.historical.length = 30;
                return data.data.historical;
            }
            else {
                return data.data.historical;
            }
        }
        catch (e) {
            console.log("error while getting price history :(");
            return null;
        }
    });
}
function getRelatedStocks(ticker, sector) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/stock-screener?sector=" +
                sector +
                "&limit=100&apikey=" +
                process.env.STOCK_API_KEY);
            //get all tickers from screener
            //cannot be same as current ticker page stock
            //company name cannot be more than 25 characters
            let tickers = data.data.filter((stock) => {
                return (stock.symbol !== ticker.toUpperCase() && stock.companyName.length < 27);
            });
            let ticks = tickers.map((x) => {
                return x.symbol;
            });
            shuffleArray(ticks);
            //only search for 8 company profiles
            ticks.length = 8;
            let allTickersString = ticks.join(",").slice(0, -1);
            let ALLCOMPANYDATA = yield axios.get("https://financialmodelingprep.com/api/v3/profile/" +
                allTickersString +
                "?apikey=" +
                process.env.STOCK_API_KEY);
            ALLCOMPANYDATA = ALLCOMPANYDATA.data.filter((x) => {
                return x !== null;
            });
            //only send back company profile data needed (related_stock interface)
            const returnData = ALLCOMPANYDATA.map((stock) => {
                return {
                    name: stock.companyName,
                    ticker: stock.symbol,
                    price: stock.price,
                    logo: stock.image,
                    number_change: stock.changes.toFixed(2),
                    percent_change: Number(((stock.changes / stock.price) * 100).toFixed(2)),
                    exchange: stock.exchangeShortName,
                };
            });
            return returnData;
        }
        catch (e) {
            console.log("error while getting related stocks");
            return null;
        }
    });
}
function getStockNews(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/stock_news?tickers=" +
                ticker.toUpperCase() +
                "&limit=10&apikey=" +
                process.env.STOCK_API_KEY);
            return data.data;
        }
        catch (e) {
            console.log("cannot get stock news :(");
            return null;
        }
    });
}
function getCompanyCoreData(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v4/company-core-information?symbol=" +
                ticker.toUpperCase() +
                "&apikey=" +
                process.env.STOCK_API_KEY);
            let y = {
                sicCode: data.data[0].sicCode,
                taxID: data.data[0].taxIdentificationNumber,
            };
            return y;
        }
        catch (e) {
            console.log("could not get company core data :(");
            return null;
        }
    });
}
function isStockMarketOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=" +
                process.env.STOCK_API_KEY);
            return data.data.isTheStockMarketOpen;
        }
        catch (e) {
            console.log("Could not get stock market hours :(");
            return null;
        }
    });
}
function getImportantPeople(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/key-executives/" +
                ticker.toUpperCase() +
                "?apikey=" +
                process.env.STOCK_API_KEY);
            return data.data;
        }
        catch (e) {
            console.log("Could not get important poeple :(");
            return null;
        }
    });
}
//
//PROCESS QUERY FUNCTION
//
function PROCESS_QUERY(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const COMPANYPROFILE = yield getCompanyProfile(ticker);
            const COMPANYQUOTE = yield getCompanyQuote(ticker);
            const PRICEHISTORY = yield getPriceHistory(ticker);
            const RELATEDSTOCKS = yield getRelatedStocks(ticker, COMPANYPROFILE.sector);
            const STOCKNEWS = yield getStockNews(ticker);
            const COMPANYCOREINFO = yield getCompanyCoreData(ticker);
            const STOCKMARKETHOURS = yield isStockMarketOpen();
            const IMPORTANTPEOPLE = yield getImportantPeople(ticker);
            //type ALL_DATA in interface folder
            const returnData = {
                companyProfile: COMPANYPROFILE,
                companyQuote: COMPANYQUOTE,
                historicalPrices: PRICEHISTORY,
                relatedStocks: RELATEDSTOCKS,
                stockNews: STOCKNEWS,
                companyCoreInfo: COMPANYCOREINFO,
                isStockMarketOpen: STOCKMARKETHOURS,
                importantPeople: IMPORTANTPEOPLE,
            };
            return returnData;
        }
        catch (e) {
            console.log("error getting stock data :(");
            return null;
        }
    });
}
exports.default = PROCESS_QUERY;
