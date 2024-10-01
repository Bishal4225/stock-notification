import { UserModel } from "../model/user";
import { kite } from "../kite/kite";
export const notifyVWAP = async () => {
  const users = await UserModel.find({});
  const user = users[0];

  if (!user) {
    return;
  }

  const { zerodha_settings } = user;

  if (!zerodha_settings) {
    return;
  }

  const ticker = kite.ticker(zerodha_settings);

  if (!ticker) {
    return;
  }

  ticker.on("connect", () => {
    ticker.subscribe([738561]);
    console.log("Connected to Zerodha Ticker");
  });

  ticker.on("ticks", async (ticks) => {
    console.log("Ticks", ticks);
  });

  ticker.on("error", (error) => {
    console.log("Error", error);
  });

  // ticker.connect();

  try {
    // const historyData = await kite
    //   .connect(zerodha_settings)
    //   .getHistoricalData(
    //     "738561",
    //     "5minute",
    //     "2024-02-10T00:00:00+0530",
    //     "2024-03-10T00:00:00+0530"
    //   );

    const data = await kite.connect(zerodha_settings).getTrades();

    console.log("Data", data);

    // console.log("History Data", historyData);
  } catch (error) {
    console.log("Error", error);
  }
};
