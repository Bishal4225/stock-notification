import { router } from "../trpc";
import { authRouter } from "./auth";
import { nseRouter } from "./nse";
import { scannerRouter } from "./scanner";
import { stockScreenerRouter } from "./stock-screener";
import { userRouter } from "./user";
import { watchlistRouter } from "./watchlist";

const appRouter = router({
  auth: authRouter,
  user: userRouter,
  stockScreener: stockScreenerRouter,
  nse: nseRouter,
  scanner: scannerRouter,
  watchlist: watchlistRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
