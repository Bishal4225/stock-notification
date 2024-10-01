import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { ApiList, NseIndia } from "../external/NSE_API";
import {
  getGainersAndLosersByIndex,
  getMostActiveEquities,
} from "../external/helpers";
import {
  ChartDataInputSchema,
  getChartData,
  getTransformedChartData,
} from "../external/NSE_CHART";

const nse = new NseIndia();

export const nseRouter = router({
  // Endpoint to get market status
  getMarketStatus: publicProcedure.query(async () => {
    try {
      const marketStatus = await nse.getDataByEndpoint(ApiList.MARKET_STATUS);
      return marketStatus;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching market status",
      });
    }
  }),

  // Endpoint to get glossary
  getGlossary: publicProcedure.query(async () => {
    try {
      const glossary = await nse.getDataByEndpoint(ApiList.GLOSSARY);
      return glossary;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching glossary",
      });
    }
  }),

  // Endpoint to get market turnover
  getMarketTurnover: publicProcedure.query(async () => {
    try {
      const marketTurnover = await nse.getDataByEndpoint(
        ApiList.MARKET_TURNOVER
      );
      return marketTurnover;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching market turnover",
      });
    }
  }),

  // Endpoint to get equity master
  getEquityMaster: publicProcedure.query(async () => {
    try {
      const equityMaster = await nse.getDataByEndpoint(ApiList.EQUITY_MASTER);
      return equityMaster;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching equity master",
      });
    }
  }),

  // Endpoint to get holidays
  getHolidays: publicProcedure
    .input(
      z.object({
        type: z.enum(["trading", "clearing"], {
          required_error: "Type is required",
        }),
      })
    )
    .query(async (opts) => {
      const { type } = opts.input;
      try {
        const holidays = await nse.getDataByEndpoint(
          type === "clearing"
            ? ApiList.HOLIDAY_CLEARING
            : ApiList.HOLIDAY_TRADING
        );
        return holidays;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching holidays",
        });
      }
    }),

  // Endpoint to get circulars
  getCirculars: publicProcedure
    .input(
      z.object({
        isLatest: z.boolean().optional(),
      })
    )
    .query(async (opts) => {
      const { isLatest } = opts.input;
      try {
        const circulars = await nse.getDataByEndpoint(
          isLatest ? ApiList.LATEST_CIRCULARS : ApiList.CIRCULARS
        );
        return circulars;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching circulars",
        });
      }
    }),

  // Endpoint to get merged daily reports
  getMergedDailyReports: publicProcedure
    .input(
      z.object({
        key: z.enum(["capital", "derivatives", "debt"], {
          required_error: "Key is required",
        }),
      })
    )
    .query(async (opts) => {
      const { key } = opts.input;
      try {
        const endpointMap = {
          capital: ApiList.MERGED_DAILY_REPORTS_CAPITAL,
          derivatives: ApiList.MERGED_DAILY_REPORTS_DERIVATIVES,
          debt: ApiList.MERGED_DAILY_REPORTS_DEBT,
        };
        const reports = await nse.getDataByEndpoint(endpointMap[key]);
        return reports;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching merged daily reports",
        });
      }
    }),

  // Endpoint to get all indices
  getAllIndices: publicProcedure.query(async () => {
    try {
      const allIndices = await nse.getDataByEndpoint(ApiList.ALL_INDICES);
      return allIndices;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching all indices",
      });
    }
  }),

  // Endpoint to get all index names
  getIndexNames: publicProcedure.query(async () => {
    try {
      const indexNames = await nse.getDataByEndpoint(ApiList.INDEX_NAMES);
      return indexNames;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching index names",
      });
    }
  }),

  // Endpoint to get all symbols
  getAllSymbols: publicProcedure.query(async () => {
    try {
      const symbols = await nse.getAllStockSymbols();
      return symbols;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong while fetching all symbols",
      });
    }
  }),

  // Endpoint to get equity details
  getEquityDetails: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { symbol } = opts.input;
      try {
        const equityDetails = await nse.getEquityDetails(symbol);
        return equityDetails;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity details",
        });
      }
    }),

  // Endpoint to get equity series
  getEquitySeries: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { symbol } = opts.input;
      try {
        const equitySeries = await nse.getEquitySeries(symbol);
        return equitySeries;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity series",
        });
      }
    }),

  // Endpoint to get equity trade info
  getEquityTradeInfo: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { symbol } = opts.input;
      try {
        const tradeInfo = await nse.getEquityTradeInfo(symbol);
        return tradeInfo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity trade info",
        });
      }
    }),

  // Endpoint to get equity corporate info
  getEquityCorporateInfo: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { symbol } = opts.input;
      try {
        const corporateInfo = await nse.getEquityCorporateInfo(symbol);
        return corporateInfo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity corporate info",
        });
      }
    }),

  // Endpoint to get equity intraday data
  getEquityIntraday: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
        preOpen: z.boolean().optional(),
      })
    )
    .query(async (opts) => {
      const { symbol, preOpen } = opts.input;
      try {
        const intradayData = await nse.getEquityIntradayData(symbol, preOpen);
        return intradayData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity intraday data",
        });
      }
    }),

  // Endpoint to get equity historical data
  getEquityHistorical: publicProcedure
    .input(
      z.object({
        symbol: z.string({
          required_error: "Symbol is required",
        }),
        dateStart: z.string().optional(),
        dateEnd: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const { symbol, dateStart, dateEnd } = opts.input;
      try {
        if (dateStart && dateEnd) {
          const start = new Date(dateStart);
          const end = new Date(dateEnd);
          if (start.getTime() > 0 && end.getTime() > 0) {
            const range = {
              start,
              end,
            };
            return await nse.getEquityHistoricalData(symbol, range);
          } else {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Invalid date format. Please use the format (YYYY-MM-DD)",
            });
          }
        } else {
          return await nse.getEquityHistoricalData(symbol);
        }
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching equity historical data",
        });
      }
    }),

  // Endpoint to get index details
  getStockIndices: publicProcedure
    .input(
      z.object({
        indexName: z.string({
          required_error: "Index name is required",
        }),
      })
    )
    .query(async (opts) => {
      const { indexName } = opts.input;
      try {
        const stockIndices = await nse.getEquityStockIndices(indexName);
        return stockIndices;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching stock indices",
        });
      }
    }),

  // Endpoint to get index intraday data
  getIndexIntraday: publicProcedure
    .input(
      z.object({
        indexSymbol: z.string({
          required_error: "Index symbol is required",
        }),
        preOpen: z.boolean().optional(),
      })
    )
    .query(async (opts) => {
      const { indexSymbol, preOpen } = opts.input;
      try {
        const intradayData = await nse.getIndexIntradayData(
          indexSymbol,
          preOpen
        );
        return intradayData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching index intraday data",
        });
      }
    }),

  // Endpoint to get index historical data
  getIndexHistorical: publicProcedure
    .input(
      z.object({
        indexSymbol: z.string({
          required_error: "Index symbol is required",
        }),
        dateStart: z.string(),
        dateEnd: z.string(),
      })
    )
    .query(async (opts) => {
      const { indexSymbol, dateStart, dateEnd } = opts.input;
      try {
        const start = new Date(dateStart);
        const end = new Date(dateEnd);
        if (start.getTime() > 0 && end.getTime() > 0) {
          const range = {
            start,
            end,
          };
          return await nse.getIndexHistoricalData(indexSymbol, range);
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid date format. Please use the format (YYYY-MM-DD)",
          });
        }
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching index historical data",
        });
      }
    }),

  // Endpoint to get option chain data
  getOptionChain: publicProcedure
    .input(
      z.object({
        indexSymbol: z.string({
          required_error: "Index symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { indexSymbol } = opts.input;
      try {
        const optionChain = await nse.getOptionChain(indexSymbol);
        return optionChain;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching option chain data",
        });
      }
    }),

  // Endpoint to get gainers and losers by index
  getGainersAndLosers: publicProcedure
    .input(
      z.object({
        indexSymbol: z.string({
          required_error: "Index symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { indexSymbol } = opts.input;
      try {
        const gainersAndLosers = await getGainersAndLosersByIndex(indexSymbol);
        return gainersAndLosers;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching gainers and losers",
        });
      }
    }),

  // Endpoint to get most active equities by index
  getMostActiveEquities: publicProcedure
    .input(
      z.object({
        indexSymbol: z.string({
          required_error: "Index symbol is required",
        }),
      })
    )
    .query(async (opts) => {
      const { indexSymbol } = opts.input;
      try {
        const mostActive = await getMostActiveEquities(indexSymbol);
        return mostActive;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching most active equities",
        });
      }
    }),
  getChartData: publicProcedure
    .input(ChartDataInputSchema)
    .query(async (opts) => {
      const input = opts.input;
      try {
        const chartData = await getChartData(input);
        return chartData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching chart data",
        });
      }
    }),
  getTransformedChartData: publicProcedure
    .input(ChartDataInputSchema)
    .query(async (opts) => {
      const input = opts.input;
      try {
        const chartData = await getTransformedChartData(input);
        return chartData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching chart data",
        });
      }
    }),
});
