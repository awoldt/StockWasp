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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const getMarketOverviewData_1 = __importDefault(require("./functions/getMarketOverviewData"));
const getTickerPageData_1 = __importDefault(require("./functions/getTickerPageData"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "/node_modules/bootstrap/dist/css")));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "/node_modules/bootstrap/dist/js")));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "/public")));
app.listen(8080, () => {
    console.log(">APP LISTENING ON PORT 8080");
});
app.get("/", (req, res) => {
    res.render("homepage");
});
app.get("/stock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, getMarketOverviewData_1.default)();
        res.status(200).render("stockPage", {
            stock_data: data,
        });
    }
    catch (e) {
        console.log("could not get stockpage data :(");
        res.status(500).send("server error :(");
    }
}));
app.get("/stock/:ticker", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const StockData = yield (0, getTickerPageData_1.default)(req.params.ticker.toUpperCase());
        //if stock data or companyprofile are null, 404
        //only need companyProfile to send back data
        //send 404
        if (StockData == null || StockData.companyProfile == null) {
            res.status(404).send("page not found :(");
        }
        //200
        else {
            res.status(200).render("tickerPage", {
                stock_data: StockData,
            });
        }
    }
    catch (e) {
        res.status(404).send("stock does not exist :(");
    }
}));
app.get("/random", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield axios_1.default.get("https://financialmodelingprep.com/api/v3/stock-screener?sector=" +
            req.query.sector +
            "&limit=500&apikey=" +
            process.env.STOCK_API_KEY);
        res.redirect("/stock/" +
            data.data[Math.floor(Math.random() * data.data.length)].symbol.toLowerCase());
    }
    catch (e) {
        console.log("error fetching random stock by sector :(");
        res.redirect("/stock");
    }
}));
app.get("/privacy", (req, res) => {
    res.status(200).render("privacy");
});
app.get("/sitemap.xml", (req, res) => {
    res.status(200).sendFile(path_1.default.join(__dirname, "..", "/sitemap.xml"));
});
