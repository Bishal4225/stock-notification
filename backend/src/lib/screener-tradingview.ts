import axios from "axios";

const END_POINT = "https://scanner.tradingview.com/india/scan";

type GetIntradayTrendingStocksResponseType = {
  data: {
    s: string;
    d: string[] | number[];
  }[];
};

export class ScreenerTradingView {
  constructor() {}
  public async getIntradayTrendingStocks() {
    const body = {
      filter: [
        { left: "market_cap_basic", operation: "egreater", right: 300000000 },
        { left: "volume", operation: "egreater", right: 500000 },
        { left: "exchange", operation: "equal", right: "NSE" },
        {
          left: "average_volume_10d_calc",
          operation: "egreater",
          right: 100000,
        },
        {
          left: "average_volume_30d_calc",
          operation: "egreater",
          right: 50000,
        },
        { left: "change", operation: "in_range", right: [6, 14] },
      ],
      options: { lang: "en" },
      markets: ["india"],
      symbols: { query: { types: [] }, tickers: [] },
      columns: ["logoid", "name", "change", "change_abs"],
      sort: { sortBy: "change", sortOrder: "desc" },
      price_conversion: { to_symbol: false },
      range: [0, 150],
    };

    const response = await axios.post(END_POINT, body);
    return response.data as GetIntradayTrendingStocksResponseType;
  }
  public async getIntradayDowntrendStocks() {
    const body = {
      filter: [
        { left: "market_cap_basic", operation: "egreater", right: 300000000 },
        { left: "volume", operation: "egreater", right: 500000 },
        { left: "exchange", operation: "equal", right: "NSE" },
        {
          left: "average_volume_10d_calc",
          operation: "egreater",
          right: 100000,
        },
        {
          left: "average_volume_30d_calc",
          operation: "egreater",
          right: 50000,
        },
        { left: "change", operation: "in_range", right: [-11, -5] },
      ],
      options: { lang: "en" },
      markets: ["india"],
      symbols: { query: { types: [] }, tickers: [] },
      columns: ["logoid", "name", "change", "change_abs"],
      sort: { sortBy: "change", sortOrder: "desc" },
      price_conversion: { to_symbol: false },
      range: [0, 150],
    };

    const response = await axios.post(END_POINT, body);
    return response.data as GetIntradayTrendingStocksResponseType;
  }

  public async getSidewaysStocks() {
    const body = {
      filter: [
        { left: "market_cap_basic", operation: "egreater", right: 300000000 },
        { left: "volume", operation: "egreater", right: 500000 },
        { left: "exchange", operation: "equal", right: "NSE" },
        {
          left: "average_volume_10d_calc",
          operation: "egreater",
          right: 100000,
        },
        {
          left: "average_volume_30d_calc",
          operation: "egreater",
          right: 50000,
        },
        { left: "change", operation: "in_range", right: [-0.5, 0.5] },
      ],
      options: { lang: "en" },
      markets: ["india"],
      symbols: { query: { types: [] }, tickers: [] },
      columns: ["logoid", "name", "change", "change_abs"],
      sort: { sortBy: "change", sortOrder: "desc" },
      price_conversion: { to_symbol: false },
      range: [0, 150],
    };

    const response = await axios.post(END_POINT, body);
    return response.data as GetIntradayTrendingStocksResponseType;
  }
}
