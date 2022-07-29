require("dotenv").config();

import express from "express";
const app = express();
import path from "path";
import ALL_DATA from "./interfaces/ALL_DATA";
import getMarketOverviewData from "./functions/getMarketOverviewData";
import getTickerPageData from "./functions/getTickerPageData";
import compression from "compression";
import getInsiderInfo from "./functions/getInsiderInfo";
import ALL_INSIDER_DATA from "./interfaces/ALL_INSIDER_DATA";
import getInsiderHomepageInfo from "./functions/getInsiderHomepageInfo";
import market_overview from "./interfaces/market_overview";

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
    const data: market_overview | null = await getMarketOverviewData();
    res.status(200).render("marketPage", {
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
    if (
      StockData == null ||
      StockData.companyProfile == null ||
      StockData.companyQuote == null
    ) {
      res.status(404).send("could not get stock data :(");
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

app.get("/insider", async (req, res) => {
  try {
    const data = await getInsiderHomepageInfo();

    res.status(200).render("insiderHomepage", {
      insider_data: data,
    });
  } catch (e) {
    res.status(500).send("could not get insider data :(");
  }
});

app.get("/insider/:ticker", async (req, res) => {
  const data: ALL_INSIDER_DATA | null = await getInsiderInfo(req.params.ticker);

  if (data == null) {
    res.status(404).send("error getting insider information :(");
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
