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
function getGainersAndLosers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const gainers = yield axios.get("https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=" +
                process.env.STOCK_API_KEY);
            const losers = yield axios.get("https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=" +
                process.env.STOCK_API_KEY);
            return {
                gainers: gainers.data,
                losers: losers.data,
            };
        }
        catch (e) {
            console.log("cannot get gainers/losers data :(");
            return null;
        }
    });
}
function getMostActive() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield axios.get("https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=" +
                process.env.STOCK_API_KEY);
            //tally up all the stock symbols to make one massive company profile request
            let tickers = data.data.map((x) => {
                return x.symbol;
            });
            let allTickersString = tickers.join(",").slice(0, -1);
            const ALLCOMPANYDATA = yield axios.get("https://financialmodelingprep.com/api/v3/profile/" +
                allTickersString +
                "?apikey=" +
                process.env.STOCK_API_KEY);
            return ALLCOMPANYDATA.data;
        }
        catch (e) {
            console.log("cannot get most active stocks :(");
            return null;
        }
    });
}
function PROCESS_DATA() {
    return __awaiter(this, void 0, void 0, function* () {
        const GAINLOSSDATA = yield getGainersAndLosers();
        const MOSTACTIVE = yield getMostActive();
        //show the most active stocks by highest volume to lowest on frontend
        MOSTACTIVE.sort((a, b) => {
            return b.volAvg - a.volAvg;
        });
        return {
            gainLoss: GAINLOSSDATA,
            mostActive: MOSTACTIVE,
        };
    });
}
exports.default = PROCESS_DATA;
