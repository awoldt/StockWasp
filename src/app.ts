require("dotenv").config();

import express from "express";
const app = express();
import path from "path";
import axios from "axios";
import ALL_DATA from "./interfaces/ALL_DATA";

app.set("view engine", "ejs");

app.use(
  express.static(path.join(__dirname, "..", "/node_modules/bootstrap/dist/css"))
);
app.use(
  express.static(path.join(__dirname, "..", "/node_modules/bootstrap/dist/js"))
);

app.use(express.static(path.join(__dirname, "..", "/public")));

app.listen(8080, () => {
  console.log(">APP LISTENING ON PORT 8080");
});

app.get("/", (req, res) => {
  res.render("homepage");
});

// GET /STOCK
app.get("/stock", async (req, res) => {
  try {
    const data = await axios.get(
      process.env.STOCK_PAGE_CLOUD_FUNCTION_ENDPOINT +
        "?key=" +
        process.env.CLOUD_FUNCTION_SECRET_KEY
    );
    res.status(200).render("stockPage", {
      stock_data: data.data,
    });
  } catch (e) {
    console.log("could not get stockpage data :(");
    res.status(500).send("server error :(");
  }
});

app.get("/stock/:ticker", async (req, res) => {
  try {
    let x = await axios.get(
      process.env.STOCKS_CLOUD_FUNCTION_ENPOINT +
        "?ticker=" +
        req.params.ticker.toUpperCase() +
        "&key=" +
        process.env.CLOUD_FUNCTION_SECRET_KEY
    );
    const StockData: ALL_DATA | null = x.data;

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

app.get("/privacy", (req, res) => {
  res.status(200).render("privacy");
});

app.get("/sitemap.xml", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "/sitemap.xml"));
});
