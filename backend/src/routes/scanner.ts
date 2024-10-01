import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

import { ChartPeriod, getChartData } from "../external/NSE_CHART";
import { filterStocksByNamesOrSymbols } from "../constant/equity";
import { delay } from "../utils";
import { SupportResistanceCalculator } from "../scanner/calculateSupportResistanceChannels";
import { ScannedStockModel } from "../model/scannedStocks";

export const scannerRouter = router({
  getStockBasedOnSupportResistance: publicProcedure
    .input(
      z.object({
        batchSize: z.number().int().positive().default(50),
        threshold: z.number().positive().default(0.005),
        chartPeriod: z.nativeEnum(ChartPeriod).default(ChartPeriod.Daily),
        interval: z.number().int().positive().default(1),
        scanMode: z.boolean().default(false),
        fromDate: z.date().optional(),
        toDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const {
          batchSize,

          threshold,
          chartPeriod,
          interval,
          scanMode,
          fromDate,
          toDate,
        } = input;

        if (scanMode) {
          const analyzeStock = async (tradingSymbol: string) => {
            try {
              const chartInput = {
                exch: "N",
                tradingSymbol: `${tradingSymbol}-EQ`,
                fromDate: 0,
                toDate: Math.floor(new Date().getTime() / 1000) + 86400,
                timeInterval: interval,
                chartPeriod: chartPeriod,
                chartStart: 0,
              };

              const chartData = await getChartData(chartInput);
              if (!chartData) {
                console.log(`No chart data found for ${tradingSymbol}.`);
                return null;
              }

              const currentPrice = chartData.c[chartData.c.length - 1];
              const calculator = new SupportResistanceCalculator(
                chartData,
                currentPrice
              );
              const levels = calculator.calculateLevels();
              const srCheck = calculator.checkNearSupportOrResistance(
                threshold,
                levels
              );

              if (srCheck.isNear) {
                return {
                  stockSymbol: tradingSymbol,
                  currentPrice,
                };
              }

              return null;
            } catch (error) {
              console.error(`Error analyzing stock ${tradingSymbol}:`, error);
              return null;
            }
          };

          const allStocks = filterStocksByNamesOrSymbols("");
          const stocksToAnalyze = allStocks.slice(0);

          const scannedStocks: any[] = [];

          // Process stocks in batches
          for (let i = 0; i < stocksToAnalyze.length; i += batchSize) {
            const batch = stocksToAnalyze.slice(i, i + batchSize);
            const batchPromises = batch.map((stock) =>
              analyzeStock(stock.symbol)
            );
            const batchResults = await Promise.all(batchPromises);

            scannedStocks.push(
              ...batchResults.filter((result) => result !== null)
            );

            console.log(
              `Progress: ${(
                ((i + batchSize) / stocksToAnalyze.length) *
                100
              ).toFixed(2)}%`
            );

            if (i + batchSize < stocksToAnalyze.length) {
              await delay(50);
            }
          }

          // Update or insert scanned stocks
          for (const stock of scannedStocks) {
            await ScannedStockModel.findOneAndUpdate(
              { stockSymbol: stock.stockSymbol },
              {
                ...stock,
                scanDate: new Date(),
                scanPeriod: chartPeriod,
                scanInterval: interval,
              },
              { upsert: true, new: true }
            );
          }

          return scannedStocks.map((stock) => stock.stockSymbol);
        } else {
          // Return saved stock data based on chartPeriod, interval, and date range
          const query: any = {
            scanPeriod: chartPeriod,
            scanInterval: interval,
          };

          if (fromDate) {
            query.scanDate = { $gte: fromDate };
          }

          if (toDate) {
            query.scanDate = { ...query.scanDate, $lte: toDate };
          }

          const savedStocks = await ScannedStockModel.find(query).sort({
            scanDate: -1,
          });

          return savedStocks.map((stock) => stock.stockSymbol);
        }
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while analyzing stocks",
        });
      }
    }),
});
