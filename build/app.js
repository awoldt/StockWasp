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
        const data = yield axios_1.default.get(String(process.env.STOCK_PAGE_CLOUD_FUNCTION_ENDPOINT));
        res.status(200).render("stockPage", {
            stock_data: data.data,
        });
    }
    catch (e) {
        console.log("could not get stockpage data :(");
        res.status(500).send("server error :(");
    }
}));
app.get("/stock/:ticker", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let x = yield axios_1.default.get(process.env.STOCKS_CLOUD_FUNCTION_ENPOINT +
            "?ticker=" +
            req.params.ticker.toUpperCase() +
            "&key=" +
            process.env.CLOUD_FUNCTION_SECRET_KEY);
        const StockData = x.data;
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
        console.log("ticker " + req.params.ticker + " does not exist");
        res.status(404).send("stock does not exist :(");
    }
}));
