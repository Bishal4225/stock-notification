import cron from "node-cron";
import { WebHook } from "../webhooks";
import { ScreenerTradingView } from "../lib/screener-tradingview";
import { CapturedStockModel, StockType } from "../model/captured-stock";
import { format } from "date-fns";
import { isMarketClosed } from "../utils";

const stv = new ScreenerTradingView();
const wh = new WebHook();
// notifyVWAP(); // call the function

const saveStocksToDB = async (
  stocks: {
    s: string;
    d: number[] | string[];
  }[],
  type: StockType
) => {
  let currentCapturedStocks = [];

  const colorType = {
    UP: 3447003,
    DOWN: 15158332,
    SIDEWAYS: 15844367,
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const filteredData = stocks.filter((stock) => stock.d[0] !== "");

  const stocksSymbols = filteredData.map((stock) => stock.d[1]);

  const capturedStocks = await CapturedStockModel.find({
    stockSymbol: { $in: stocksSymbols },
    dateCaptured: today,
  });

  const capturedStockSymbols = capturedStocks.map((stock) => stock.stockSymbol);

  for (const stock of filteredData) {
    const [_, symbol, change, change_abs] = stock.d;

    if (capturedStockSymbols.includes(symbol as string)) {
      continue;
    }

    const newCapturedStock = new CapturedStockModel({
      dateCaptured: today,
      stockSymbol: symbol,
      changeAbs: change_abs,
      change,
      stockType: type,
    });

    currentCapturedStocks.push(newCapturedStock);

    await newCapturedStock.save();
    console.log(`Stock ${type}: ${symbol} has been captured`);
  }

  const currentCapturedStocksSymbols = currentCapturedStocks.map(
    (stock) => stock.stockSymbol
  );

  // For discord notification
  const capturedStockTable = currentCapturedStocks.map(
    (stock) => `${stock.stockSymbol}: ${stock.change.toFixed(2)}%`
  );

  if (
    currentCapturedStocksSymbols !== capturedStockSymbols &&
    currentCapturedStocksSymbols.length > 0
  ) {
    await wh.sendScreenerNotification({
      embeds: [
        {
          title: `${type}trend`,
          description: `${type} Stocks has been captured - ${today}`,
          color: colorType[type], // You can change this to any color you want
          fields: [
            {
              name: "Stocks",
              value: "```" + capturedStockTable.join("\n") + "```",
              inline: true,
            },
          ],
          timestamp: new Date(),
        },
      ],
    });
  }
};

export const getUptrendStocks = cron.schedule(
  "*/59 * * * * *",
  async () => {
    if (isMarketClosed()) {
      console.log("Market is closed");
      return;
    }
    const { data } = await stv.getIntradayTrendingStocks();
    await saveStocksToDB(data, StockType.UP);
    console.log("Uptrend Stocks");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

export const getDowntrendStocks = cron.schedule(
  "*/59 * * * * *",
  async () => {
    if (isMarketClosed()) {
      console.log("Market is closed");
      return;
    }

    const { data } = await stv.getIntradayDowntrendStocks();
    await saveStocksToDB(data, StockType.DOWN);
    console.log("Downtrend Stocks");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
// export const getSidewaysStocks = cron.schedule("*/90 * * * * *", async () => {
//   const { data } = await stv.getSidewaysStocks();
//   await saveStocksToDB(data, StockType.SIDEWAYS);
// });
