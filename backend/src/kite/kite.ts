import { TRPCError } from "@trpc/server";
import { KiteConnect, KiteTicker } from "../lib/kiteconnect-ts/dist";
import { ZerodhaSettings } from "../model/user";

const kiteTicker = (settings: ZerodhaSettings) => {
  try {
    const { enc_token, zerodha_id } = settings || {};

    if (!enc_token || !zerodha_id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Zerodha settings not found",
      });
    }

    const ticker = new KiteTicker({
      api_key: "kitefront",
      access_token: "random_token",
      enc_token: enc_token,
      user_id: zerodha_id,
      root: "wss://ws.zerodha.com/",
    });

    if (!ticker) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Zeroda Ticker Not found",
      });
    }

    return ticker;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};

const kiteConnect = (settings: ZerodhaSettings) => {
  try {
    const { enc_token, zerodha_id } = settings || {};

    if (!enc_token || !zerodha_id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Zerodha settings not found",
      });
    }

    const connect = new KiteConnect({
      api_key: "kitefront",
      access_token: "random_token",
      enc_token: enc_token,
      user_id: zerodha_id,
    });

    if (!connect) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Zeroda Connect Not found",
      });
    }

    return connect;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    });
  }
};

export const kite = {
  ticker: kiteTicker,
  connect: kiteConnect,
};
