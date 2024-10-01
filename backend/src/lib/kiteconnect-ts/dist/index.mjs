var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// lib/connect/index.ts
import axios from "axios";
import { createHash } from "crypto";
import querystring from "querystring";
import csvParse from "papaparse";

// package.json
var package_default = {
  name: "kiteconnect-ts",
  author: "Anurag Roy",
  description:
    "Unofficial library for the Kite Connect trading APIs, written in TypeScript.",
  license: "MIT",
  version: "1.1.0",
  main: "dist/index.js",
  module: "dist/index.mjs",
  types: "dist/index.d.ts",
  files: ["dist"],
  repository: {
    type: "git",
    url: "git+https://github.com/anurag-roy/kiteconnect-ts.git",
  },
  homepage: "https://kiteconnect.anuragroy.dev",
  bugs: {
    url: "https://github.com/anurag-roy/kiteconnect-ts/issues",
  },
  keywords: ["Zerodha", "KiteConnect", "KiteTicker", "TypeScript"],
  scripts: {
    lint: "tsc",
    build: "tsup lib/index.ts --format cjs,esm --dts",
    release: "pnpm run build && pnpm changeset publish",
    generateDocs: "tsx typedoc/generateDocs.ts",
    "test:kiteconnect": "tsx tests/kiteconnect.test.ts",
    "test:kiteticker": "tsx tests/kiteticker.test.ts",
    test: "pnpm run test:kiteconnect && pnpm run test:kiteticker",
  },
  devDependencies: {
    "@changesets/cli": "^2.27.1",
    "@types/papaparse": "^5.3.14",
    "@types/ws": "^8.5.10",
    nock: "14.0.0-beta.3",
    tsup: "^8.0.2",
    tsx: "^4.7.1",
    typedoc: "^0.25.8",
    "typedoc-plugin-markdown": "^3.17.1",
    typescript: "^5.3.3",
  },
  dependencies: {
    axios: "^1.6.7",
    papaparse: "^5.4.1",
    ws: "^8.16.0",
  },
  publishConfig: {
    access: "public",
    provenance: true,
  },
};

// lib/utils.ts
function getUserAgent() {
  return "kiteconnect-ts/" + package_default.version;
}

// lib/connect/types.ts
var Exchange = {
  NSE: "NSE",
  BSE: "BSE",
  NFO: "NFO",
  CDS: "CDS",
  BCD: "BCD",
  BFO: "BFO",
  MCX: "MCX",
};
var TransactionType = {
  BUY: "BUY",
  SELL: "SELL",
};
var ProductType = {
  NRML: "NRML",
  MIS: "MIS",
  CNC: "CNC",
  CO: "CO",
  BO: "BO",
};
var OrderType = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
  SL: "SL",
  "SL-M": "SL-M",
};
var Variety = {
  amo: "amo",
  auction: "auction",
  bo: "bo",
  co: "co",
  iceberg: "iceberg",
  regular: "regular",
};
var Validity = {
  DAY: "DAY",
  IOC: "IOC",
  TTL: "TTL",
};
var TriggerType = {
  "two-leg": "two-leg",
  single: "single",
};

// lib/connect/index.ts
var KiteConnect = class {
  constructor(params) {
    // Constants
    // Products
    this.PRODUCT_MIS = ProductType.MIS;
    this.PRODUCT_CNC = ProductType.CNC;
    this.PRODUCT_NRML = ProductType.NRML;
    this.PRODUCT_CO = ProductType.CO;
    this.PRODUCT_BO = ProductType.BO;
    // Order types
    this.ORDER_TYPE_MARKET = OrderType.MARKET;
    this.ORDER_TYPE_LIMIT = OrderType.LIMIT;
    this.ORDER_TYPE_SLM = OrderType["SL-M"];
    this.ORDER_TYPE_SL = OrderType.SL;
    // Varieties
    this.VARIETY_REGULAR = Variety.regular;
    this.VARIETY_BO = Variety.bo;
    this.VARIETY_CO = Variety.co;
    this.VARIETY_AMO = Variety.amo;
    this.VARIETY_ICEBERG = Variety.iceberg;
    this.VARIETY_AUCTION = Variety.auction;
    // Transaction types
    this.TRANSACTION_TYPE_BUY = TransactionType.BUY;
    this.TRANSACTION_TYPE_SELL = TransactionType.SELL;
    // Validities
    this.VALIDITY_DAY = Validity.DAY;
    this.VALIDITY_IOC = Validity.IOC;
    this.VALIDITY_TTL = Validity.TTL;
    // Exchanges
    this.EXCHANGE_NSE = Exchange.NSE;
    this.EXCHANGE_BSE = Exchange.BSE;
    this.EXCHANGE_NFO = Exchange.NFO;
    this.EXCHANGE_CDS = Exchange.CDS;
    this.EXCHANGE_BCD = Exchange.BCD;
    this.EXCHANGE_BFO = Exchange.BFO;
    this.EXCHANGE_MCX = Exchange.MCX;
    // Margins segments
    this.MARGIN_EQUITY = "equity";
    this.MARGIN_COMMODITY = "commodity";
    this.STATUS_CANCELLED = "CANCELLED";
    this.STATUS_REJECTED = "REJECTED";
    this.STATUS_COMPLETE = "COMPLETE";
    this.GTT_TYPE_OCO = TriggerType["two-leg"];
    this.GTT_TYPE_SINGLE = TriggerType.single;
    this.GTT_STATUS_ACTIVE = "active";
    this.GTT_STATUS_TRIGGERED = "triggered";
    this.GTT_STATUS_DISABLED = "disabled";
    this.GTT_STATUS_EXPIRED = "expired";
    this.GTT_STATUS_CANCELLED = "cancelled";
    this.GTT_STATUS_REJECTED = "rejected";
    this.GTT_STATUS_DELETED = "deleted";
    this.POSITION_TYPE_DAY = "day";
    this.POSITION_TYPE_OVERNIGHT = "overnight";
    this.kiteVersion = 3;
    // Kite version to send in header
    this.userAgent = getUserAgent();
    // User agent to be sent with every request
    this.routes = {
      "api.token": "/session/token",
      "api.token.invalidate": "/session/token",
      "api.token.renew": "/session/refresh_token",
      "user.profile": "/user/profile",
      "user.margins": "/user/margins",
      "user.margins.segment": "/user/margins/{segment}",
      orders: "/orders",
      trades: "/trades",
      "order.info": "/orders/{order_id}",
      "order.place": "/orders/{variety}",
      "order.modify": "/orders/{variety}/{order_id}",
      "order.cancel": "/orders/{variety}/{order_id}",
      "order.trades": "/orders/{order_id}/trades",
      "order.margins": "/margins/orders",
      "order.margins.basket": "/margins/basket",
      "portfolio.positions": "/portfolio/positions",
      "portfolio.holdings": "/portfolio/holdings",
      "portfolio.holdings.auction": "/portfolio/holdings/auctions",
      "portfolio.positions.convert": "/portfolio/positions",
      "mf.orders": "/mf/orders",
      "mf.order.info": "/mf/orders/{order_id}",
      "mf.order.place": "/mf/orders",
      "mf.order.cancel": "/mf/orders/{order_id}",
      "mf.sips": "/mf/sips",
      "mf.sip.info": "/mf/sips/{sip_id}",
      "mf.sip.place": "/mf/sips",
      "mf.sip.modify": "/mf/sips/{sip_id}",
      "mf.sip.cancel": "/mf/sips/{sip_id}",
      "mf.holdings": "/mf/holdings",
      "mf.instruments": "/mf/instruments",
      "market.instruments.all": "/instruments",
      "market.instruments": "/instruments/{exchange}",
      "market.historical":
        "/instruments/historical/{instrument_token}/{interval}",
      "market.quote": "/quote",
      "market.quote.ohlc": "/quote/ohlc",
      "market.quote.ltp": "/quote/ltp",
      "gtt.triggers": "/gtt/triggers",
      "gtt.trigger_info": "/gtt/triggers/{trigger_id}",
      "gtt.place": "/gtt/triggers",
      "gtt.modify": "/gtt/triggers/{trigger_id}",
      "gtt.delete": "/gtt/triggers/{trigger_id}",
    };
    const defaults = {
      root: "https://api.kite.trade",
      login: "https://kite.zerodha.com/connect/login",
      debug: false,
      timeout: 7e3,
    };
    this.api_key = params.api_key;
    this.root = params.root || defaults.root;
    this.timeout = params.timeout || defaults.timeout;
    this.debug = params.debug || defaults.debug;
    this.access_token = params.access_token || null;
    this.default_login_uri = defaults.login;
    this.session_expiry_hook = null;
    this.requestInstance = axios.create({
      baseURL: this.root,
      timeout: this.timeout,
      headers: {
        "X-Kite-Version": this.kiteVersion,
        "User-Agent": this.userAgent,
      },
      paramsSerializer: {
        indexes: null,
      },
    });
    this.requestInstance.interceptors.request.use((request) => {
      if (this.debug) return request;
    });
    this.requestInstance.interceptors.response.use(
      (response) => {
        const contentType = response.headers["content-type"];
        if (
          contentType === "application/json" &&
          typeof response.data === "object"
        ) {
          if (response.data.error_type) throw response.data;
          return response.data.data;
        } else if (contentType === "text/csv") {
          return response.data;
        } else {
          return {
            error_type: "DataException",
            message:
              "Unknown content type (" +
              contentType +
              ") with response: (" +
              response.data +
              ")",
          };
        }
      },
      (error) => {
        let resp = {
          message: "Unknown error",
          error_type: "GeneralException",
          data: null,
        };
        if (error.response) {
          if (error.response.data && error.response.data.error_type) {
            if (
              error.response.data.error_type === "TokenException" &&
              this.session_expiry_hook
            ) {
              this.session_expiry_hook();
            }
            resp = error.response.data;
          } else {
            resp.error_type = "NetworkException";
            resp.message = error.response.statusText;
          }
        } else if (error.request) {
          resp.error_type = "NetworkException";
          resp.message =
            "No response from server with error code: " + error.code;
        } else if (error.message) {
          resp = error;
        }
        return Promise.reject(resp);
      }
    );
  }
  /**
   * Set access_token received after a successful authentication.
   *
   * @param access_token Token obtained in exchange for `request_token`.
   * Once you have obtained `access_token`, you should persist it in a database or session to pass
   * to the Kite Connect class initialisation for subsequent requests.
   */
  setAccessToken(access_token) {
    this.access_token = access_token;
  }
  /**
   * Set a callback hook for session (`TokenException` -- timeout, expiry etc.) errors.
   * `access_token` (login session) can become invalid for a number of
   * reasons, but it doesn't make sense for the client to try and catch it during every API call.
   *
   * A callback method that handles session errors can be set here and when the client encounters
   * a token error at any point, it'll be called.
   *
   * This callback, for instance, can log the user out of the UI,
   * clear session cookies, or initiate a fresh login.
   *
   * @param cb Callback
   */
  setSessionExpiryHook(cb) {
    this.session_expiry_hook = cb;
  }
  /**
   * Get the remote login url to which a user should be redirected to initiate the login flow.
   */
  getLoginURL() {
    return (
      this.default_login_uri +
      "?api_key=" +
      this.api_key +
      "&v=" +
      this.kiteVersion
    );
  }
  /**
   * Do the token exchange with the `request_token` obtained after the login flow,
   * and retrieve the `access_token` required for all subsequent requests. The response
   * contains not just the `access_token`, but metadata for the user who has authenticated.
   *
   * @param request_token Token obtained from the GET parameters after a successful login redirect.
   * @param api_secret API secret issued with the API key.
   */
  generateSession(request_token, api_secret) {
    return new Promise((resolve, reject) => {
      const checksum = createHash("sha256")
        .update(this.api_key + request_token + api_secret)
        .digest("hex");
      const p = this._post(
        "api.token",
        {
          api_key: this.api_key,
          request_token,
          checksum,
        },
        null,
        this.formatGenerateSession
      );
      p.then((resp) => {
        if (resp && resp.access_token) {
          this.setAccessToken(resp.access_token);
        }
        return resolve(resp);
      }).catch((err) => {
        return reject(err);
      });
    });
  }
  /**
   * Kill the session by invalidating the access token.
   * If access_token is passed then it will be set as current access token and get in validated.
   *
   * @param access_token Token to invalidate. Default is the active `access_token`.
   */
  invalidateAccessToken(access_token) {
    return this._delete("api.token.invalidate", {
      api_key: this.api_key,
      access_token: access_token || this.access_token,
    });
  }
  /**
   * Renew access token by active refresh token. Renewed access token is implicitly set.
   *
   * @param refresh_token Token obtained from previous successful login.
   * @param api_secret API secret issued with the API key.
   */
  renewAccessToken(refresh_token, api_secret) {
    return new Promise((resolve, reject) => {
      const checksum = createHash("sha256")
        .update(this.api_key + refresh_token + api_secret)
        .digest("hex");
      const p = this._post("api.token.renew", {
        api_key: this.api_key,
        refresh_token,
        checksum,
      });
      p.then((resp) => {
        if (resp && resp.access_token) {
          this.setAccessToken(resp.access_token);
        }
        return resolve(resp);
      }).catch((err) => {
        return reject(err);
      });
    });
  }
  /**
   * Invalidate the refresh token.
   *
   * @param refresh_token Token to invalidate.
   */
  invalidateRefreshToken(refresh_token) {
    return this._delete("api.token.invalidate", {
      api_key: this.api_key,
      refresh_token,
    });
  }
  /**
   * Get user profile details.
   */
  getProfile() {
    return this._get("user.profile");
  }
  /**
   * Get account balance and cash margin details for a particular segment.
   *
   * @param segment trading segment (eg: equity or commodity).
   */
  getMargins(segment) {
    if (segment) {
      return this._get("user.margins.segment", { segment });
    } else {
      return this._get("user.margins");
    }
  }
  /**
   * Place an order.
   *
   * @param variety Order variety (ex. bo, co, amo, regular).
   * @param params Order params.
   */
  placeOrder(variety, params) {
    return this._post("order.place", __spreadValues({ variety }, params));
  }
  /**
   * Modify an order
   *
   * @param variety Order variety (ex. bo, co, amo, regular).
   * @param order_id ID of the order.
   * @param params Order modify params.
   */
  modifyOrder(variety, order_id, params) {
    return this._put(
      "order.modify",
      __spreadValues({ variety, order_id }, params)
    );
  }
  /**
   * Cancel an order
   *
   * @param variety Order variety (ex. bo, co, amo)
   * @param order_id ID of the order.
   * @param params Order params. regular).
   */
  cancelOrder(variety, order_id, params) {
    const mergedParams = params || {};
    mergedParams.variety = variety;
    mergedParams.order_id = order_id;
    return this._delete("order.cancel", mergedParams);
  }
  /**
   * Exit an order
   *
   * @param variety Order variety (ex. bo, co, amo)
   * @param order_id ID of the order.
   * @param params Order params.
   */
  exitOrder(variety, order_id, params) {
    return this.cancelOrder(variety, order_id, params);
  }
  /**
   * Get list of orders.
   */
  getOrders() {
    return this._get("orders", null, null, this.formatResponse);
  }
  /**
   * Get list of order history.
   *
   * @param order_id ID of the order whose order details to be retrieved.
   */
  getOrderHistory(order_id) {
    return this._get("order.info", { order_id }, null, this.formatResponse);
  }
  /**
   * Retrieve the list of trades executed.
   */
  getTrades() {
    return this._get("trades", null, null, this.formatResponse);
  }
  /**
   * Retrieve the list of trades a particular order).
   * An order can be executed in tranches based on market conditions.
   * These trades are individually recorded under an order.
   *
   * @param order_id ID of the order whose trades are to be retrieved.
   */
  getOrderTrades(order_id) {
    return this._get("order.trades", { order_id }, null, this.formatResponse);
  }
  orderMargins(orders, mode = null) {
    return this._post("order.margins", orders, null, null, true, {
      mode,
    });
  }
  orderBasketMargins(orders, consider_positions = true, mode = null) {
    return this._post("order.margins.basket", orders, null, null, true, {
      consider_positions,
      mode,
    });
  }
  /**
   * Retrieve the list of equity holdings.
   */
  getHoldings() {
    return this._get("portfolio.holdings");
  }
  getAuctionInstruments() {
    return this._get("portfolio.holdings.auction");
  }
  /**
   * Retrieve positions.
   */
  getPositions() {
    return this._get("portfolio.positions");
  }
  /**
   * Modify an open position's product type.
   *
   * @param params params.
   */
  convertPosition(params) {
    return this._put("portfolio.positions.convert", params);
  }
  /**
   * Retrieve the list of market instruments available to trade.
   * Note that the results could be large, several hundred KBs in size,
   * with tens of thousands of entries in the list.
   * Response is array for objects.
   *
   * @example
   * ```
   * 	{
   * 		instrument_token: '131098372',
   *		exchange_token: '512103',
   *		tradingsymbol: 'NIDHGRN',
   *		name: 'NIDHI GRANITES',
   *		last_price: '0.0',
   *		expiry: '',
   *		strike: '0.0',
   *		tick_size: '0.05',
   *		lot_size: '1',
   *		instrument_type: 'EQ',
   *		segment: 'BSE',
   *		exchange: 'BSE' }, ...]
   * ```
   *
   * @param exchange Filter instruments based on exchange (NSE, BSE, NFO, BFO, CDS, MCX). If no `segment` is specified, all instruments are returned.
   */
  getInstruments(exchange) {
    if (exchange) {
      return this._get(
        "market.instruments",
        {
          exchange,
        },
        null,
        this.transformInstrumentsResponse
      );
    } else {
      return this._get(
        "market.instruments.all",
        null,
        null,
        this.transformInstrumentsResponse
      );
    }
  }
  /**
   * Retrieve quote and market depth for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getQuote(instruments) {
    return this._get(
      "market.quote",
      { i: instruments },
      null,
      this.formatQuoteResponse
    );
  }
  /**
   * Retrieve OHLC for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getOHLC(instruments) {
    return this._get("market.quote.ohlc", { i: instruments });
  }
  /**
   * Retrieve LTP for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getLTP(instruments) {
    return this._get("market.quote.ltp", { i: instruments });
  }
  /**
   * Retrieve historical data (candles) for an instrument.
   * Although the actual response JSON from the API does not have field
   * names such has 'open', 'high' etc., this functin call structures
   * the data into an array of objects with field names.
   *
   * @example
   * ```
   * [{
   * 	date: '2015-02-10T00:00:00+0530',
   * 	open: 277.5,
   * 	high: 290.8,
   * 	low: 275.7,
   * 	close: 287.3,
   * 	volume: 22589681
   * }, ....]
   * ```
   *
   * @param instrument_token Instrument identifier (retrieved from the instruments()) call.
   * @param interval candle interval (minute, day, 5 minute etc.)
   * @param from_date From date (String in format of 'yyyy-mm-dd HH:MM:SS' or Date object).
   * @param to_date To date (String in format of 'yyyy-mm-dd HH:MM:SS' or Date object).
   * @param continuous is a bool flag to get continuous data for futures and options instruments. Defaults to false.
   * @param oi is a bool flag to include OI data for futures and options instruments. Defaults to false.
   */
  getHistoricalData(
    instrument_token,
    interval,
    from_date,
    to_date,
    continuous,
    oi
  ) {
    return this._get(
      "market.historical",
      {
        instrument_token,
        interval,
        from:
          typeof from_date === "object"
            ? this._getDateTimeString(from_date)
            : from_date,
        to:
          typeof to_date === "object"
            ? this._getDateTimeString(to_date)
            : to_date,
        continuous: continuous ? 1 : 0,
        oi: oi ? 1 : 0,
      },
      null,
      this.parseHistorical
    );
  }
  // Convert Date object to string of format yyyy-mm-dd HH:MM:SS
  _getDateTimeString(date) {
    const isoString = date.toISOString();
    return isoString.replace("T", " ").split(".")[0];
  }
  /**
   * Get list of mutual fund orders.
   *
   * @param order_id ID of the order (optional) whose order details are to be retrieved.
   * If no `order_id` is specified, all orders for the day are returned.
   */
  getMFOrders(order_id) {
    if (order_id) {
      return this._get(
        "mf.order.info",
        { order_id },
        null,
        this.formatResponse
      );
    } else {
      return this._get("mf.orders", null, null, this.formatResponse);
    }
  }
  /**
   * Place a mutual fund order.
   *
   * @param params MF Order params.
   */
  placeMFOrder(params) {
    return this._post("mf.order.place", params);
  }
  /**
   * Cancel a mutual fund order.
   *
   * @param order_id ID of the order.
   */
  cancelMFOrder(order_id) {
    return this._delete("mf.order.cancel", { order_id });
  }
  /**
   * Get list of mutual fund SIPS.
   * If no `sip_id` is specified, all active and paused SIPs are returned.
   *
   * @param sip_id ID of the SIP (optional) whose details are to be retrieved.
   */
  getMFSIPS(sip_id) {
    if (sip_id) {
      return this._get("mf.sip.info", { sip_id }, null, this.formatResponse);
    } else {
      return this._get("mf.sips", null, null, this.formatResponse);
    }
  }
  /**
   * Place a mutual fund SIP.
   *
   * @param params SIP params.
   */
  placeMFSIP(params) {
    return this._post("mf.sip.place", params);
  }
  /**
   * Modify a mutual fund SIP.
   *
   * @param sip_id ID of the SIP.
   * @param params Modify params.
   */
  modifyMFSIP(sip_id, params) {
    return this._put("mf.sip.modify", __spreadValues({ sip_id }, params));
  }
  /**
   * Cancel a mutual fund SIP.
   *
   * @param sip_id ID of the SIP.
   */
  cancelMFSIP(sip_id) {
    return this._delete("mf.sip.cancel", { sip_id });
  }
  /**
   * Get list of mutual fund holdings.
   */
  getMFHoldings() {
    return this._get("mf.holdings");
  }
  /**
   * Get list of mutual fund instruments.
   */
  getMFInstruments() {
    return this._get(
      "mf.instruments",
      null,
      null,
      this.transformMFInstrumentsResponse
    );
  }
  /**
   * Get GTTs list
   */
  getGTTs() {
    return this._get("gtt.triggers", null, null, this.formatResponse);
  }
  /**
   * Get list of order history.
   * @param trigger_id GTT trigger ID
   */
  getGTT(trigger_id) {
    return this._get(
      "gtt.trigger_info",
      { trigger_id },
      null,
      this.formatResponse
    );
  }
  // Get API params from user defined GTT params.
  _getGTTPayload(params) {
    if (
      params.trigger_type !== this.GTT_TYPE_OCO &&
      params.trigger_type !== this.GTT_TYPE_SINGLE
    ) {
      throw new Error("Invalid `params.trigger_type`");
    }
    if (
      params.trigger_type === this.GTT_TYPE_OCO &&
      params.trigger_values.length !== 2
    ) {
      throw new Error("Invalid `trigger_values` for `OCO` order type");
    }
    if (
      params.trigger_type === this.GTT_TYPE_SINGLE &&
      params.trigger_values.length !== 1
    ) {
      throw new Error("Invalid `trigger_values` for `single` order type");
    }
    let condition = {
      exchange: params.exchange,
      tradingsymbol: params.tradingsymbol,
      trigger_values: params.trigger_values,
      last_price: parseFloat(String(params.last_price)),
    };
    let orders = [];
    for (let o of params.orders) {
      orders.push({
        transaction_type: o.transaction_type,
        order_type: o.order_type,
        product: o.product,
        quantity: parseInt(String(o.quantity)),
        price: parseFloat(String(o.price)),
        exchange: params.exchange,
        tradingsymbol: params.tradingsymbol,
      });
    }
    return { condition, orders };
  }
  /**
   * Place GTT.
   *
   * @param params Place GTT params
   */
  placeGTT(params) {
    let payload = this._getGTTPayload(params);
    return this._post("gtt.place", {
      condition: JSON.stringify(payload.condition),
      orders: JSON.stringify(payload.orders),
      type: params.trigger_type,
    });
  }
  /**
   * Modify GTT.
   *
   * @param trigger_id GTT trigger ID.
   * @param params Modify params
   */
  modifyGTT(trigger_id, params) {
    let payload = this._getGTTPayload(params);
    return this._put("gtt.modify", {
      trigger_id,
      type: params.trigger_type,
      condition: JSON.stringify(payload.condition),
      orders: JSON.stringify(payload.orders),
    });
  }
  /**
   * Get list of order history.
   *
   * @param trigger_id GTT ID
   */
  deleteGTT(trigger_id) {
    return this._delete("gtt.delete", { trigger_id }, null, null);
  }
  /**
   * Validate postback data checksum
   *
   * @param postback_data Postback data received. Must be an json object with required keys order_id, checksum and order_timestamp
   * @param api_secret Api secret of the app
   */
  validatePostback(postback_data, api_secret) {
    if (
      !postback_data ||
      !postback_data.checksum ||
      !postback_data.order_id ||
      !postback_data.order_timestamp ||
      !api_secret
    ) {
      throw new Error("Invalid postback data or api_secret");
    }
    const inputString =
      postback_data.order_id + postback_data.order_timestamp + api_secret;
    let checksum;
    try {
      checksum = createHash("sha256").update(inputString).digest("hex");
    } catch (e) {
      throw e;
    }
    if (postback_data.checksum === checksum) {
      return true;
    } else {
      return false;
    }
  }
  // Format generate session response
  formatGenerateSession(data) {
    if (!data.data || typeof data.data !== "object") return data;
    if (data.data.login_time) {
      data.data.login_time = new Date(data.data.login_time);
    }
    return data;
  }
  formatQuoteResponse(data) {
    if (!data.data || typeof data.data !== "object") return data;
    for (const k in data.data) {
      const item = data.data[k];
      for (const field of ["timestamp", "last_trade_time"]) {
        if (item[field] && item[field].length === 19) {
          item[field] = new Date(item[field]);
        }
      }
    }
    return data;
  }
  // Format response ex. datetime string to date
  formatResponse(data) {
    if (!data.data || typeof data.data !== "object") return data;
    let list = [];
    if (data.data instanceof Array) {
      list = data.data;
    } else {
      list = [data.data];
    }
    const results = [];
    const fields = [
      "order_timestamp",
      "exchange_timestamp",
      "created",
      "last_instalment",
      "fill_timestamp",
    ];
    for (const item of list) {
      for (const field of fields) {
        if (item[field] && item[field].length === 19) {
          item[field] = new Date(item[field]);
        }
      }
      results.push(item);
    }
    if (data.data instanceof Array) {
      data.data = results;
    } else {
      data.data = results[0];
    }
    return data;
  }
  parseHistorical(jsonData) {
    if (jsonData.error_type) return jsonData;
    const results = [];
    for (let i = 0; i < jsonData.data.candles.length; i++) {
      const d = jsonData.data.candles[i];
      const c = {
        date: new Date(d[0]),
        open: d[1],
        high: d[2],
        low: d[3],
        close: d[4],
        volume: d[5],
      };
      if (d[6]) {
        c["oi"] = d[6];
      }
      results.push(c);
    }
    return { data: results };
  }
  transformInstrumentsResponse(data, headers) {
    if (headers["content-type"] === "text/csv") {
      const parsedData = csvParse.parse(data, { header: true }).data;
      for (const item of parsedData) {
        item["last_price"] = parseFloat(item["last_price"]);
        item["strike"] = parseFloat(item["strike"]);
        item["tick_size"] = parseFloat(item["tick_size"]);
        item["lot_size"] = parseInt(item["lot_size"]);
        if (item["expiry"] && item["expiry"].length === 10) {
          item["expiry"] = new Date(item["expiry"]);
        }
      }
      return parsedData;
    }
    return data;
  }
  transformMFInstrumentsResponse(data, headers) {
    if (headers["content-type"] === "text/csv") {
      const parsedData = csvParse.parse(data, { header: true }).data;
      for (const item of parsedData) {
        item["minimum_purchase_amount"] = parseFloat(
          item["minimum_purchase_amount"]
        );
        item["purchase_amount_multiplier"] = parseFloat(
          item["purchase_amount_multiplier"]
        );
        item["minimum_additional_purchase_amount"] = parseFloat(
          item["minimum_additional_purchase_amount"]
        );
        item["redemption_quantity_multiplier"] = parseFloat(
          item["redemption_quantity_multiplier"]
        );
        item["minimum_additional_purchase_amount"] = parseFloat(
          item["minimum_additional_purchase_amount"]
        );
        item["last_price"] = parseFloat(item["last_price"]);
        item["purchase_allowed"] = Boolean(parseInt(item["purchase_allowed"]));
        item["redemption_allowed"] = Boolean(
          parseInt(item["redemption_allowed"])
        );
        if (item["last_price_date"] && item["last_price_date"].length === 10) {
          item["last_price_date"] = new Date(item["last_price_date"]);
        }
      }
      return parsedData;
    }
    return data;
  }
  _get(route, params, responseType, responseTransformer, isJSON = false) {
    return this.request(
      route,
      "GET",
      params || {},
      responseType,
      responseTransformer,
      isJSON
    );
  }
  _post(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false,
    queryParams = null
  ) {
    return this.request(
      route,
      "POST",
      params || {},
      responseType,
      responseTransformer,
      isJSON,
      queryParams
    );
  }
  _put(
    route,
    params,
    responseType,
    responseTransformer,
    isJSON = false,
    queryParams = null
  ) {
    return this.request(
      route,
      "PUT",
      params || {},
      responseType,
      responseTransformer,
      isJSON,
      queryParams
    );
  }
  _delete(route, params, responseType, responseTransformer, isJSON = false) {
    return this.request(
      route,
      "DELETE",
      params || {},
      responseType,
      responseTransformer,
      isJSON
    );
  }
  request(
    route,
    method,
    params,
    responseType,
    responseTransformer,
    isJSON,
    queryParams
  ) {
    if (!responseType) responseType = "json";
    let uri = this.routes[route];
    if (uri.indexOf("{") !== -1) {
      for (const k in params) {
        if (params.hasOwnProperty(k)) {
          uri = uri.replace("{" + k + "}", params[k]);
        }
      }
    }
    let payload = null;
    if (method === "GET" || method === "DELETE") {
      queryParams = params;
    } else {
      if (isJSON) {
        payload = JSON.stringify(params);
      } else {
        payload = querystring.stringify(params);
      }
    }
    const options = {
      method,
      url: uri,
      params: queryParams,
      data: payload,
      // Set auth header
      headers: {},
      transformResponse: void 0,
    };
    if (this.access_token) {
      const authHeader = this.api_key + ":" + this.access_token;
      options["headers"]["Authorization"] = "token " + authHeader;
    }
    if (isJSON) {
      options["headers"]["Content-Type"] = "application/json";
    } else {
      options["headers"]["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (responseTransformer) {
      if (!axios.defaults.transformResponse) {
        options.transformResponse = responseTransformer;
      }
      if (Array.isArray(axios.defaults.transformResponse)) {
        options.transformResponse =
          axios.defaults.transformResponse.concat(responseTransformer);
      } else {
        options.transformResponse = [axios.defaults.transformResponse].concat(
          responseTransformer
        );
      }
    }
    return this.requestInstance.request(options);
  }
};

// lib/ticker/index.ts
import { clearInterval } from "timers";
import ws, { WebSocket } from "ws";
var KiteTicker = class {
  /**
   * KiteTicker constructor
   *
   * @param params KiteTicker parameters
   * @returns An instance of The KiteTicker class
   */
  constructor(params) {
    this.root = "wss://ws.kite.trade/";
    this.api_key = null;
    this.access_token = null;
    this.read_timeout = 5;
    // seconds
    this.reconnect_max_delay = 0;
    this.reconnect_max_tries = 0;
    // message flags (outgoing)
    this.mSubscribe = "subscribe";
    this.mUnSubscribe = "unsubscribe";
    this.mSetMode = "mode";
    // incoming
    this.mAlert = 10;
    this.mMessage = 11;
    this.mLogout = 12;
    this.mReload = 13;
    this.mClearCache = 14;
    // public constants
    /**
     * Set mode full
     */
    this.modeFull = "full";
    // Full quote including market depth. 164 bytes.
    /**
     * Set mode quote
     */
    this.modeQuote = "quote";
    // Quote excluding market depth. 52 bytes.
    /**
     * Set mode LTP
     */
    this.modeLTP = "ltp";
    this.ws = null;
    this.triggers = {
      connect: [],
      ticks: [],
      disconnect: [],
      error: [],
      close: [],
      reconnect: [],
      noreconnect: [],
      message: [],
      order_update: [],
    };
    this.read_timer = null;
    this.last_read = 0;
    this.reconnect_timer = null;
    this.auto_reconnect = false;
    this.current_reconnection_count = 0;
    this.last_reconnect_interval = 0;
    this.current_ws_url = null;
    this.defaultReconnectMaxDelay = 60;
    this.defaultReconnectMaxRetries = 50;
    this.maximumReconnectMaxRetries = 300;
    this.minimumReconnectMaxDelay = 5;
    // segment constants
    this.NseCM = 1;
    this.NseFO = 2;
    this.NseCD = 3;
    this.BseCM = 4;
    this.BseFO = 5;
    this.BseCD = 6;
    this.McxFO = 7;
    this.McxSX = 8;
    this.Indices = 9;
    this.root = params.root || this.root;
    this.api_key = params.api_key;
    this.access_token = params.access_token;
    if (!params.reconnect) params.reconnect = true;
    this.autoReconnect(params.reconnect, params.max_retry, params.max_delay);
  }
  /**
   * Auto reconnect settings
   *
   * @param t Enable or disable auto disconnect, defaults to false
   * @param max_retry is maximum number re-connection attempts. Defaults to 50 attempts and maximum up to 300 attempts.
   * @param max_delay in seconds is the maximum delay after which subsequent re-connection interval will become constant. Defaults to 60s and minimum acceptable value is 5s.
   */
  autoReconnect(t, max_retry, max_delay) {
    this.auto_reconnect = t === true;
    max_retry = max_retry || this.defaultReconnectMaxRetries;
    max_delay = max_delay || this.defaultReconnectMaxDelay;
    this.reconnect_max_tries =
      max_retry >= this.maximumReconnectMaxRetries
        ? this.maximumReconnectMaxRetries
        : max_retry;
    this.reconnect_max_delay =
      max_delay <= this.minimumReconnectMaxDelay
        ? this.minimumReconnectMaxDelay
        : max_delay;
  }
  /**
   * Initiate a websocket connection
   */
  connect() {
    if (
      this.ws &&
      (this.ws.readyState == ws.CONNECTING || this.ws.readyState == ws.OPEN)
    )
      return;
    const url =
      this.root +
      "?api_key=" +
      this.api_key +
      "&access_token=" +
      this.access_token +
      "&uid=" +
      /* @__PURE__ */ new Date().getTime().toString();
    this.ws = new WebSocket(url, {
      headers: {
        "X-Kite-Version": "3",
        "User-Agent": getUserAgent(),
      },
    });
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      this.last_reconnect_interval = null;
      this.current_reconnection_count = 0;
      if (!this.current_ws_url) this.current_ws_url = url;
      this.trigger("connect");
      if (this.read_timer) clearInterval(this.read_timer);
      this.last_read = Date.now();
      this.read_timer = setInterval(() => {
        if ((Date.now() - this.last_read) / 1e3 >= this.read_timeout) {
          this.current_ws_url = null;
          if (this.ws) this.ws.close();
          if (this.read_timer) clearInterval(this.read_timer);
          this.triggerDisconnect();
        }
      }, this.read_timeout * 1e3);
    };
    this.ws.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        this.trigger("message", [e.data]);
        if (e.data.byteLength > 2) {
          const d = this.parseBinary(e.data);
          if (d) this.trigger("ticks", [d]);
        }
      } else {
        this.parseTextMessage(e.data);
      }
      this.last_read = Date.now();
    };
    this.ws.onerror = (e) => {
      this.trigger("error", [e]);
      if (this.ws && this.ws.readyState == ws.OPEN) this.ws.close();
    };
    this.ws.onclose = (e) => {
      this.trigger("close", [e]);
      if (this.current_ws_url && url != this.current_ws_url) return;
      this.triggerDisconnect(e);
    };
  }
  /**
   * Close the websocket connection
   */
  disconnect() {
    if (
      this.ws &&
      this.ws.readyState != ws.CLOSING &&
      this.ws.readyState != ws.CLOSED
    ) {
      this.ws.close();
    }
  }
  /**
   * Check if the ticker is connected
   *
   * @returns `true` if the ticker is connected or `false` otherwise.
   */
  connected() {
    if (this.ws && this.ws.readyState == ws.OPEN) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Register websocket event callbacks. See {@link TickerEvent} for all available events.
   *
   * @param e Event to register callback on.
   * @param callback Callback function
   *
   * @example
   * ```ts
   * ticker.on("ticks", callback);
   * ticker.on("connect", callback);
   * ticker.on("disconnect", callback);
   * ```
   *
   * Tick structure (passed to the tick callback you assign):
   * ```
   * [
   *   {
   *     tradable: true,
   *     mode: 'full',
   *     instrument_token: 208947,
   *     last_price: 3939,
   *     last_quantity: 1,
   *     average_price: 3944.77,
   *     volume: 28940,
   *     buy_quantity: 4492,
   *     sell_quantity: 4704,
   *     ohlc: { open: 3927, high: 3955, low: 3927, close: 3906 },
   *     change: 0.8448540706605223,
   *     last_trade_time: 1515491369,
   *     timestamp: 1515491373,
   *     oi: 24355,
   *     oi_day_high: 0,
   *     oi_day_low: 0,
   *     depth: {
   *       buy: [
   *         { quantity: 59, price: 3223, orders: 5 },
   *         { quantity: 164, price: 3222, orders: 15 },
   *         { quantity: 123, price: 3221, orders: 7 },
   *         { quantity: 48, price: 3220, orders: 7 },
   *         { quantity: 33, price: 3219, orders: 5 },
   *       ],
   *       sell: [
   *         { quantity: 115, price: 3224, orders: 15 },
   *         { quantity: 50, price: 3225, orders: 5 },
   *         { quantity: 175, price: 3226, orders: 14 },
   *         { quantity: 49, price: 3227, orders: 10 },
   *         { quantity: 106, price: 3228, orders: 13 },
   *       ],
   *     },
   *   },
   * ]
   * ```
   */
  on(e, callback) {
    if (this.triggers.hasOwnProperty(e)) {
      this.triggers[e].push(callback);
    }
  }
  /**
   * Subscribe to array of tokens
   *
   * @param tokens Array of tokens to be subscribed
   *
   * @example
   * ```ts
   * ticker.subscribe([738561]);
   * ```
   */
  subscribe(tokens) {
    if (tokens.length > 0) {
      this.send({ a: this.mSubscribe, v: tokens });
    }
    return tokens;
  }
  /**
   * Unsubscribe from array of tokens
   *
   * @param tokens Array of tokens to be unsubscribed
   *
   * @example
   * ```ts
   * ticker.unsubscribe([738561]);
   * ```
   */
  unsubscribe(tokens) {
    if (tokens.length > 0) {
      this.send({ a: this.mUnSubscribe, v: tokens });
    }
    return tokens;
  }
  /**
   * Set mode for an array of tokens
   *
   * @param mode mode to set
   * @param tokens Array of tokens to be subscribed
   *
   * @example
   * ```
   * ticker.setMode(ticker.modeFull, [738561]);
   * ```
   */
  setMode(mode, tokens) {
    if (tokens.length > 0) {
      this.send({ a: this.mSetMode, v: [mode, tokens] });
    }
    return tokens;
  }
  triggerDisconnect(e) {
    this.ws = null;
    this.trigger("disconnect", [e]);
    if (this.auto_reconnect) this.attemptReconnection();
  }
  // send a message via the socket
  // automatically encodes json if possible
  send(message) {
    if (!this.ws || this.ws.readyState != ws.OPEN) return;
    try {
      if (typeof message == "object") {
        message = JSON.stringify(message);
      }
      this.ws.send(message);
    } catch (e) {
      this.ws.close();
    }
  }
  // trigger event callbacks
  trigger(e, args) {
    var _a;
    if (!this.triggers[e]) return;
    for (let n = 0; n < this.triggers[e].length; n++) {
      (_a = this.triggers[e][n]) == null
        ? void 0
        : _a.apply(this.triggers[e][n], args ? args : []);
    }
  }
  parseTextMessage(dataString) {
    let data;
    try {
      data = JSON.parse(dataString);
    } catch (e) {
      return;
    }
    if (data.type === "order") {
      this.trigger("order_update", [data.data]);
    }
  }
  // parse received binary message. each message is a combination of multiple tick packets
  // [2-bytes num packets][size1][tick1][size2][tick2] ...
  parseBinary(binpacks) {
    const packets = this.splitPackets(binpacks);
    const ticks = [];
    for (let n = 0; n < packets.length; n++) {
      const bin = packets[n];
      const instrument_token = this.buf2long(bin.slice(0, 4));
      const segment = instrument_token & 255;
      let tradable = true;
      if (segment === this.Indices) tradable = false;
      let divisor = 100;
      if (segment === this.NseCD) {
        divisor = 1e7;
      } else if (segment == this.BseCD) {
        divisor = 1e4;
      }
      if (bin.byteLength === 8) {
        ticks.push({
          tradable,
          mode: this.modeLTP,
          instrument_token,
          last_price: this.buf2long(bin.slice(4, 8)) / divisor,
        });
      } else if (bin.byteLength === 28 || bin.byteLength === 32) {
        let mode = this.modeQuote;
        if (bin.byteLength === 32) mode = this.modeFull;
        const tick = {
          tradable,
          mode,
          instrument_token,
          last_price: this.buf2long(bin.slice(4, 8)) / divisor,
          ohlc: {
            high: this.buf2long(bin.slice(8, 12)) / divisor,
            low: this.buf2long(bin.slice(12, 16)) / divisor,
            open: this.buf2long(bin.slice(16, 20)) / divisor,
            close: this.buf2long(bin.slice(20, 24)) / divisor,
          },
          change: this.buf2long(bin.slice(24, 28)),
        };
        if (tick.ohlc.close != 0) {
          tick.change =
            ((tick.last_price - tick.ohlc.close) * 100) / tick.ohlc.close;
        }
        if (bin.byteLength === 32) {
          tick.exchange_timestamp = null;
          const timestamp = this.buf2long(bin.slice(28, 32));
          if (timestamp) tick.exchange_timestamp = new Date(timestamp * 1e3);
        }
        ticks.push(tick);
      } else if (bin.byteLength === 44 || bin.byteLength === 184) {
        let mode = this.modeQuote;
        if (bin.byteLength === 184) mode = this.modeFull;
        const tick = {
          tradable,
          mode,
          instrument_token,
          last_price: this.buf2long(bin.slice(4, 8)) / divisor,
          last_traded_quantity: this.buf2long(bin.slice(8, 12)),
          average_traded_price: this.buf2long(bin.slice(12, 16)) / divisor,
          volume_traded: this.buf2long(bin.slice(16, 20)),
          total_buy_quantity: this.buf2long(bin.slice(20, 24)),
          total_sell_quantity: this.buf2long(bin.slice(24, 28)),
          ohlc: {
            open: this.buf2long(bin.slice(28, 32)) / divisor,
            high: this.buf2long(bin.slice(32, 36)) / divisor,
            low: this.buf2long(bin.slice(36, 40)) / divisor,
            close: this.buf2long(bin.slice(40, 44)) / divisor,
          },
        };
        if (tick.ohlc.close != 0) {
          tick.change =
            ((tick.last_price - tick.ohlc.close) * 100) / tick.ohlc.close;
        }
        if (bin.byteLength === 184) {
          tick.last_trade_time = null;
          const last_trade_time = this.buf2long(bin.slice(44, 48));
          if (last_trade_time)
            tick.last_trade_time = new Date(last_trade_time * 1e3);
          tick.exchange_timestamp = null;
          const timestamp = this.buf2long(bin.slice(60, 64));
          if (timestamp) tick.exchange_timestamp = new Date(timestamp * 1e3);
          tick.oi = this.buf2long(bin.slice(48, 52));
          tick.oi_day_high = this.buf2long(bin.slice(52, 56));
          tick.oi_day_low = this.buf2long(bin.slice(56, 60));
          tick.depth = {
            buy: [],
            sell: [],
          };
          let s = 0;
          const depth = bin.slice(64, 184);
          for (let i = 0; i < 10; i++) {
            s = i * 12;
            tick.depth[i < 5 ? "buy" : "sell"].push({
              quantity: this.buf2long(depth.slice(s, s + 4)),
              price: this.buf2long(depth.slice(s + 4, s + 8)) / divisor,
              orders: this.buf2long(depth.slice(s + 8, s + 10)),
            });
          }
        }
        ticks.push(tick);
      }
    }
    return ticks;
  }
  // split one long binary message into individual tick packets
  splitPackets(bin) {
    const num = this.buf2long(bin.slice(0, 2));
    let j = 2;
    const packets = [];
    for (let i = 0; i < num; i++) {
      const size = this.buf2long(bin.slice(j, j + 2)),
        packet = bin.slice(j + 2, j + 2 + size);
      packets.push(packet);
      j += 2 + size;
    }
    return packets;
  }
  attemptReconnection() {
    if (this.current_reconnection_count > this.reconnect_max_tries) {
      this.trigger("noreconnect");
      process.exit(1);
    }
    if (this.current_reconnection_count > 0) {
      this.last_reconnect_interval = Math.pow(
        2,
        this.current_reconnection_count
      );
    } else if (!this.last_reconnect_interval) {
      this.last_reconnect_interval = 1;
    }
    if (this.last_reconnect_interval > this.reconnect_max_delay) {
      this.last_reconnect_interval = this.reconnect_max_delay;
    }
    this.current_reconnection_count++;
    this.trigger("reconnect", [
      this.current_reconnection_count,
      this.last_reconnect_interval,
    ]);
    this.reconnect_timer = setTimeout(() => {
      this.connect();
    }, this.last_reconnect_interval * 1e3);
  }
  // Big endian byte array to long.
  buf2long(buf) {
    const b = new Uint8Array(buf);
    let val = 0;
    const len = b.length;
    for (let i = 0, j = len - 1; i < len; i++, j--) {
      val += b[j] << (i * 8);
    }
    return val;
  }
};
export {
  Exchange,
  KiteConnect,
  KiteTicker,
  OrderType,
  ProductType,
  TransactionType,
  TriggerType,
  Validity,
  Variety,
};
