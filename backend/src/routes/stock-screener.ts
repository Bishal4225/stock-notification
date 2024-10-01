import { TRPCError } from "@trpc/server";
import { Cron } from "../crons";
import {
  CapturedStockClass,
  CapturedStockModel,
  ICapturedStock,
} from "../model/captured-stock";
import { privateProcedure, router } from "../trpc";
import { z } from "zod";
const cron = new Cron();
export const stockScreenerRouter = router({
  controlIntradayStockScreener: privateProcedure
    .input(
      z.object({
        start: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      try {
        const { start } = opts.input;
        if (start) {
          cron.getTasks().getUptrendStocks.start();
          cron.getTasks().getDowntrendStocks.start();
          // cron.getTasks().getSidewaysStocks.start();
        } else {
          cron.getTasks().getDowntrendStocks.stop();
          cron.getTasks().getUptrendStocks.stop();
          // cron.getTasks().getSidewaysStocks.stop();
        }

        return { success: true };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  getCapturedStocks: privateProcedure
    .input(
      z.object({
        type: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .query(async (opts) => {
      try {
        const { type, date } = opts.input;
        let query: {
          stockType?: string;
          dateCaptured?: Date;
        } = {};

        if (type) {
          query["stockType"] = type;
        }

        if (date) {
          query["dateCaptured"] = new Date(date);
        }

        const stocks = await CapturedStockModel.find(query);
        return stocks as ICapturedStock[];
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get captured stocks",
        });
      }
    }),

  getCapturedStocksByDate: privateProcedure.query(async (opts) => {
    const stocksSumByDate = (await CapturedStockModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCaptured" } },
          total: { $sum: 1 },
        },
      },
    ])) as {
      _id: string;
      total: number;
    }[];

    return stocksSumByDate;
  }),
});
