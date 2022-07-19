require("dotenv").config();

import express from "express";
const app = express();
import path from "path";
import axios from "axios";
import ALL_DATA from "./interfaces/ALL_DATA";
import getMarketOverviewData from "./functions/getMarketOverviewData";
import getTickerPageData from "./functions/getTickerPageData";
import compression from "compression";
import getInsiderInfo from "./functions/getInsiderInfo";
import ALL_INSIDER_DATA from "./interfaces/ALL_INSIDER_DATA";

app.set("view engine", "ejs");

// Compress all HTTP responses
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "/public")));

app.listen(8080, () => {
  console.log(">APP LISTENING ON PORT 8080");
});

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/stock", async (req, res) => {
  try {
    const data = await getMarketOverviewData();
    res.status(200).render("stockPage", {
      stock_data: data,
    });
  } catch (e) {
    console.log("could not get stockpage data :(");
    res.status(500).send("server error :(");
  }
});

app.get("/stock/:ticker", async (req, res) => {
  try {
    const StockData: ALL_DATA | null = await getTickerPageData(
      req.params.ticker.toUpperCase()
    );

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
  } catch (e) {
    res.status(404).send("stock does not exist :(");
  }
});

app.get("/random", async (req, res) => {
  try {
    const data = await axios.get(
      "https://financialmodelingprep.com/api/v3/stock-screener?sector=" +
        req.query.sector +
        "&limit=500&apikey=" +
        process.env.STOCK_API_KEY
    );
    res.redirect(
      "/stock/" +
        data.data[
          Math.floor(Math.random() * data.data.length)
        ].symbol.toLowerCase()
    );
  } catch (e) {
    console.log("error fetching random stock by sector :(");
    res.redirect("/stock");
  }
});

app.get("/insider", async (req, res) => {
  res.status(200).render("insiderHomepage");
});

app.get("/insider/:ticker", async (req, res) => {
  const data: ALL_INSIDER_DATA | null = await getInsiderInfo(req.params.ticker);

  if (data == null) {
    res
      .status(404)
      .send("Stock does not exist or does not have any insider information :(");
  } else {
    res.render("insider", {
      insider_data: data,
    });
  }
});

app.get("/privacy", (req, res) => {
  res.status(200).render("privacy");
});

app.get("/sitemap.xml", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "/sitemap.xml"));
});
