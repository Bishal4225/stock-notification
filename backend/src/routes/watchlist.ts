import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { IWatchlist, WatchlistModel } from "../model/watchlist";
import { filterStocksByNamesOrSymbols } from "../constant/equity";
const searchSchema = z.object({
  query: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});
export const watchlistRouter = router({
  create: privateProcedure
    .input(
      z.object({
        name: z.string({
          required_error: "Watchlist name is required",
        }),
      })
    )
    .mutation(async (opts): Promise<IWatchlist> => {
      const userId = opts.ctx.user.id;
      const { name } = opts.input;

      const watchlist = await WatchlistModel.create({
        name,
        dateCreated: new Date(),
        user: userId,
      });

      return watchlist.toObject() as IWatchlist;
    }),

  getAll: privateProcedure
    .input(searchSchema)
    .query(
      async (opts): Promise<{ watchlists: IWatchlist[]; total: number }> => {
        const { query, limit, offset } = opts.input;
        const userId = opts.ctx.user.id;

        const searchCriteria = {
          user: userId,
          ...(query ? { name: { $regex: query, $options: "i" } } : {}),
        };

        const [watchlists, total] = await Promise.all([
          WatchlistModel.find(searchCriteria)
            .sort({ dateCreated: -1 })
            .skip(offset)
            .limit(limit)
            .lean(),
          WatchlistModel.countDocuments(searchCriteria),
        ]);

        return {
          watchlists: watchlists as unknown as IWatchlist[],
          total,
        };
      }
    ),

  getById: privateProcedure
    .input(
      z.string({
        required_error: "Watchlist ID is required",
      })
    )
    .query(async (opts): Promise<IWatchlist> => {
      const watchlistId = opts.input;
      const userId = opts.ctx.user.id;

      const watchlist = await WatchlistModel.findOne({
        _id: watchlistId,
        user: userId,
      });
      if (!watchlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return watchlist.toObject() as IWatchlist;
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string({
          required_error: "Watchlist ID is required",
        }),
        name: z.string().optional(),
        stockSymbols: z
          .array(z.string())
          .min(1, "At least one stock symbol is required")
          .optional(),
      })
    )
    .mutation(async (opts): Promise<IWatchlist> => {
      const { id, name, stockSymbols } = opts.input;
      const userId = opts.ctx.user.id;

      const watchlist = await WatchlistModel.findOneAndUpdate(
        { _id: id, user: userId },
        {
          ...(name && { name }),
          ...(stockSymbols && { stockSymbols }),
          lastUpdated: new Date(),
        },
        { new: true }
      );

      if (!watchlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return watchlist.toObject() as IWatchlist;
    }),

  delete: privateProcedure
    .input(
      z.string({
        required_error: "Watchlist ID is required",
      })
    )
    .mutation(async (opts): Promise<{ message: string }> => {
      const watchlistId = opts.input;
      const userId = opts.ctx.user.id;

      const result = await WatchlistModel.deleteOne({
        _id: watchlistId,
        user: userId,
      });

      if (result.deletedCount === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return { message: "Watchlist deleted successfully" };
    }),

  addStock: privateProcedure
    .input(
      z.object({
        watchlistId: z.string({
          required_error: "Watchlist ID is required",
        }),
        stockSymbol: z.string({
          required_error: "Stock symbol is required",
        }),
      })
    )
    .mutation(async (opts): Promise<IWatchlist> => {
      const { watchlistId, stockSymbol } = opts.input;
      const userId = opts.ctx.user.id;

      const watchlist = await WatchlistModel.findOneAndUpdate(
        { _id: watchlistId, user: userId },
        {
          $addToSet: { stockSymbols: stockSymbol },
          lastUpdated: new Date(),
        },
        { new: true }
      );

      if (!watchlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return watchlist.toObject() as IWatchlist;
    }),

  removeStock: privateProcedure
    .input(
      z.object({
        watchlistId: z.string({
          required_error: "Watchlist ID is required",
        }),
        stockSymbol: z.string({
          required_error: "Stock symbol is required",
        }),
      })
    )
    .mutation(async (opts): Promise<IWatchlist> => {
      const { watchlistId, stockSymbol } = opts.input;
      const userId = opts.ctx.user.id;

      const watchlist = await WatchlistModel.findOneAndUpdate(
        { _id: watchlistId, user: userId },
        {
          $pull: { stockSymbols: stockSymbol },
          lastUpdated: new Date(),
        },
        { new: true }
      );

      if (!watchlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return watchlist.toObject() as IWatchlist;
    }),

  getStocks: privateProcedure
    .input(
      z.string({
        required_error: "Watchlist ID is required",
      })
    )
    .query(async (opts): Promise<string[]> => {
      const watchlistId = opts.input;
      const userId = opts.ctx.user.id;

      const watchlist = await WatchlistModel.findOne({
        _id: watchlistId,
        user: userId,
      });

      if (!watchlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Watchlist not found",
        });
      }

      return watchlist.stockSymbols;
    }),

  searchStockSymbols: privateProcedure
    .input(
      z.string({
        required_error: "Name is required",
      })
    )
    .mutation(async (opts) => {
      const name = opts.input;
      return filterStocksByNamesOrSymbols(name);
    }),
});
