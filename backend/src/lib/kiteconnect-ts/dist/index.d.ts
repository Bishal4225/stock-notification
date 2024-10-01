/**
 * @enum Exchanges.
 */
declare const Exchange: {
  readonly NSE: "NSE";
  readonly BSE: "BSE";
  readonly NFO: "NFO";
  readonly CDS: "CDS";
  readonly BCD: "BCD";
  readonly BFO: "BFO";
  readonly MCX: "MCX";
};
type Exchange = keyof typeof Exchange;
/**
 * @enum Transaction types.
 */
declare const TransactionType: {
  readonly BUY: "BUY";
  readonly SELL: "SELL";
};
type TransactionType = keyof typeof TransactionType;
/**
 * @enum Product types.
 */
declare const ProductType: {
  readonly NRML: "NRML";
  readonly MIS: "MIS";
  readonly CNC: "CNC";
  readonly CO: "CO";
  readonly BO: "BO";
};
type ProductType = keyof typeof ProductType;
/**
 * @enum Order types.
 */
declare const OrderType: {
  readonly LIMIT: "LIMIT";
  readonly MARKET: "MARKET";
  readonly SL: "SL";
  readonly "SL-M": "SL-M";
};
type OrderType = keyof typeof OrderType;
/**
 * @enum Varieties.
 */
declare const Variety: {
  readonly amo: "amo";
  readonly auction: "auction";
  readonly bo: "bo";
  readonly co: "co";
  readonly iceberg: "iceberg";
  readonly regular: "regular";
};
type Variety = keyof typeof Variety;
/**
 * @enum Validities.
 */
declare const Validity: {
  readonly DAY: "DAY";
  readonly IOC: "IOC";
  readonly TTL: "TTL";
};
type Validity = keyof typeof Validity;
/**
 * @enum Trigger Types
 */
declare const TriggerType: {
  readonly "two-leg": "two-leg";
  readonly single: "single";
};
type TriggerType = keyof typeof TriggerType;
/**
 * Response after successful authentication.
 */
interface SessionData {
  /**
   * The unique, permanent user id registered with the broker and the exchanges
   */
  user_id: string;
  /**
   * User's real name
   */
  user_name: string;
  /**
   * Shortened version of the user's real name
   */
  user_shortname: string;
  /**
   * User's email
   */
  email: string;
  /**
   * User's registered role at the broker. This will be `individual` for all retail users
   */
  user_type: string;
  /**
   * The broker ID
   */
  broker: string;
  /**
   * Exchanges enabled for trading on the user's account
   */
  exchanges: string[];
  /**
   * Margin product types enabled for the user
   */
  products: string[];
  /**
   * Order types enabled for the user
   */
  order_types: string[];
  /**
   * The API key for which the authentication was performed
   */
  api_key: string;
  /**
   * The authentication token that's used with every subsequent request
   * Unless this is invalidated using the API, or invalidated by a master-logout
   * from the Kite Web trading terminal, it'll expire at `6 AM` on the next day (regulatory requirement)
   */
  access_token: string;
  /**
   * A token for public session validation where requests may be exposed to the public
   */
  public_token: string;
  /**
   * A token for getting long standing read permissions.
   * This is only available to certain approved platforms
   */
  refresh_token: string;
  /**
   * User's last login time
   */
  login_time: string;
  /**
   * A token for public session validation where requests may be exposed to the public
   */
  meta: {
    /**
     * empty, consent or physical
     */
    demat_consent: string;
  };
  /**
   * Full URL to the user's avatar (PNG image) if there's one
   */
  avatar_url: string;
}
/**
 * Single GTT response.
 */
interface Trigger {
  id: number;
  user_id: string;
  parent_trigger: any;
  type: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  status:
    | "active"
    | "triggered"
    | "disabled"
    | "expired"
    | "cancelled"
    | "rejected"
    | "deleted";
  condition: {
    exchange: string;
    last_price: number;
    tradingsymbol: string;
    trigger_values: number[];
    instrument_token: number;
  };
  orders: {
    exchange: string;
    tradingsymbol: string;
    product: string;
    order_type: string;
    transaction_type: string;
    quantity: number;
    price: number;
    result: null | {
      account_id: string;
      exchange: string;
      tradingsymbol: string;
      validity: string;
      product: string;
      order_type: string;
      transaction_type: string;
      quantity: number;
      price: number;
      meta: string;
      timestamp: string;
      triggered_at: number;
      order_result: {
        status: string;
        order_id: string;
        rejection_reason: string;
      };
    };
  }[];
  meta: any;
}
/**
 * Single holdings response.
 */
interface PortfolioHolding {
  /**
   * Exchange tradingsymbol of the instrument
   */
  tradingsymbol: string;
  /**
   * Exchange
   */
  exchange: string;
  /**
   * Unique instrument identifier (used for WebSocket subscriptions)
   */
  instrument_token: number;
  /**
   * The standard ISIN representing stocks listed on multiple exchanges
   */
  isin: string;
  /**
   * Margin product applied to the holding
   */
  product: string;
  price: number;
  /**
   * Net quantity (T+1 + realised)
   */
  quantity: number;
  /**
   * Quantity sold from the net holding quantity
   */
  used_quantity: number;
  /**
   * Quantity on T+1 day after order execution. Stocks are usually delivered into DEMAT accounts on T+2
   */
  t1_quantity: number;
  /**
   * Quantity delivered to Demat
   */
  realised_quantity: number;
  /**
   * Quantity authorised at the depository for sale
   */
  authorised_quantity: number;
  /**
   * Date on which user can sell required holding stock
   */
  authorised_date: string;
  /**
   * Quantity carried forward over night
   */
  opening_quantity: number;
  /**
   * Quantity used as collateral
   */
  collateral_quantity: number;
  /**
   * Type of collateral
   */
  collateral_type: string;
  /**
   * Indicates whether holding has any price discrepancy
   */
  discrepancy: boolean;
  /**
   * Average price at which the net holding quantity was acquired
   */
  average_price: number;
  /**
   * Last traded market price of the instrument
   */
  last_price: number;
  /**
   * Closing price of the instrument from the last trading day
   */
  close_price: number;
  /**
   * Net returns on the stock; Profit and loss
   */
  pnl: number;
  /**
   * Day's change in absolute value for the stock
   */
  day_change: number;
  /**
   * Day's change in percentage for the stock
   */
  day_change_percentage: number;
}
/**
 * Single Instrument response.
 */
interface Instrument {
  /**
   * Numerical identifier used for subscribing to live market quotes with the WebSocket API.
   */
  instrument_token: string;
  /**
   * The numerical identifier issued by the exchange representing the instrument.
   */
  exchange_token: string;
  /**
   * Exchange tradingsymbol of the instrument
   */
  tradingsymbol: string;
  /**
   * Name of the company (for equity instruments)
   */
  name: string;
  /**
   * Last traded market price
   */
  last_price: number;
  /**
   * Expiry date (for derivatives)
   */
  expiry: Date;
  /**
   * Strike (for options)
   */
  strike: number;
  /**
   * Value of a single price tick
   */
  tick_size: number;
  /**
   * Quantity of a single lot
   */
  lot_size: number;
  /**
   * EQ, FUT, CE, PE
   */
  instrument_type: "EQ" | "FUT" | "CE" | "PE";
  /**
   * Segment the instrument belongs to
   */
  segment: string;
  /**
   * Exchange
   */
  exchange: Exchange;
}
/**
 * User margins for a segment.
 */
interface UserMargin {
  /**
   * Indicates whether the segment is enabled for the user
   */
  enabled: boolean;
  /**
   * Net cash balance available for trading (`intraday_payin` + `adhoc_margin` + `collateral`)
   */
  net: number;
  /**
   * Available margins for the segment
   */
  available: {
    /**
     * Additional margin provided by the broker
     */
    adhoc_margin: number;
    /**
     * Raw cash balance in the account available for trading (also includes `intraday_payin`)
     */
    cash: number;
    /**
     * Opening balance at the day start
     */
    opening_balance: number;
    /**
     * Current available balance
     */
    live_balance: number;
    /**
     * Margin derived from pledged stocks
     */
    collateral: number;
    /**
     * Amount that was deposited during the day
     */
    intraday_payin: number;
  };
  /**
   * Used margins for the segment
   */
  utilised: {
    /**
     * Sum of all utilised margins (unrealised M2M + realised M2M + SPAN + Exposure + Premium + Holding sales)
     */
    debits: number;
    /**
     * Exposure margin blocked for all open F&O positions
     */
    exposure: number;
    /**
     * Booked intraday profits and losses
     */
    m2m_realised: number;
    /**
     * Un-booked (open) intraday profits and losses
     */
    m2m_unrealised: number;
    /**
     * Value of options premium received by shorting
     */
    option_premium: number;
    /**
     * Funds paid out or withdrawn to bank account during the day
     */
    payout: number;
    /**
     * SPAN margin blocked for all open F&O positions
     */
    span: number;
    /**
     * Value of holdings sold during the day
     */
    holding_sales: number;
    /**
     * Utilised portion of the maximum turnover limit (only applicable to certain clients)
     */
    turnover: number;
    /**
     * Margin utilised against pledged liquidbees ETFs and liquid mutual funds
     */
    liquid_collateral: number;
    /**
     * Margin utilised against pledged stocks/ETFs
     */
    stock_collateral: number;
    /**
     * Margin blocked when you sell securities (20% of the value of stocks sold) from your demat or T1 holdings
     */
    delivery: number;
  };
}
/**
 * Single Mutual Fund holding.
 */
interface MFHolding {
  /**
   * Folio number generated by AMC for the completed purchase order (null incase of SELL order)
   */
  folio: null | string;
  /**
   * Allotted NAV price for a completed BUY order; Selling NAV price for completed SELL order
   */
  average_price: number;
  /**
   * Last available NAV price of the fund
   */
  last_price: number;
  /**
   * Date for which last NAV is available
   */
  last_price_date: string;
  pledged_quantity: number;
  /**
   * Name of the fund
   */
  fund: string;
  /**
   * ISIN of the fund.
   */
  tradingsymbol: string;
  /**
   * Net returns of the holding. Based on the last available NAV price.
   */
  pnl: number;
  /**
   * Quantity available in the client's holding for this ISIN.
   */
  quantity: number;
}
/**
 * Single Mutual Fund instrument response.
 */
interface MFInstrument {
  /**
   * ISIN of the fund
   */
  tradingsymbol: string;
  /**
   * AMC code as per the exchange
   */
  amc: string;
  /**
   * Fund name
   */
  name: string;
  purchase_allowed: boolean;
  redemption_allowed: boolean;
  /**
   * Minimum purchase amount for the first BUY
   */
  minimum_purchase_amount: number;
  /**
   * Buy amount should be in multiple of this value
   */
  purchase_amount_multiplier: number;
  /**
   * Minimum additional BUY amount
   */
  minimum_additional_purchase_amount: number;
  /**
   * Minimum SELL quantity
   */
  minimum_redemption_quantity: number;
  /**
   * SELL quantity multiple
   */
  redemption_quantity_multiplier: number;
  /**
   * `growth` or `payout`
   */
  dividend_type: string;
  /**
   * `equity`, `debt`, `elss`
   */
  scheme_type: string;
  /**
   * `direct` or `regular`
   */
  plan: string;
  /**
   * Settlement type of the fund (`T1`, `T2` etc.)
   */
  settlement_type: string;
  /**
   * Last available NAV price of the fund
   */
  last_price: number;
  /**
   * Last available NAV's date
   */
  last_price_date: Date;
}
/**
 * Single Mutual Fund order response.
 */
interface MFOrder {
  /**
   * Unique order id
   */
  order_id: string;
  /**
   * Exchange generated order id
   */
  exchange_order_id: null | string;
  /**
   * ISIN of the fund
   */
  tradingsymbol: string;
  /**
   * Current status of the order.
   * Most common values or COMPLETE, REJECTED, CANCELLED, and OPEN. There may be other values as well
   */
  status: null | string;
  /**
   * Textual description of the order's status. Failed orders come with human readable explanation
   */
  status_message: null | string;
  /**
   * Folio number generated by AMC for the completed purchase order
   */
  folio: null | string;
  /**
   * FRESH or ADDITIONAL (null incase of SELL order)
   */
  /**
   * Name of the fund
   */
  fund: string;
  /**
   * Date at which the order was registered by the API
   */
  order_timestamp: Date;
  /**
   * Date on which the order was registered by the exchange. Orders that don't reach the exchange have null timestamps
   */
  exchange_timestamp: Date;
  /**
   * Exchange settlement ID
   */
  settlement_id: string;
  /**
   * BUY or SELL
   */
  transaction_type: string;
  /**
   * Amount placed for purchase of units
   */
  amount: number;
  /**
   * Order variety (regular, sip)
   */
  variety: string;
  /**
   * FRESH or ADDITIONAL (null incase of SELL order)
   */
  purchase_type: null | string;
  /**
   * Number of units allotted or sold
   */
  quantity: number;
  /**
   * Buy or sell price
   */
  price: number;
  /**
   * Last available NAV price of the fund
   */
  last_price: number;
  /**
   * Allotted or sold NAV price
   */
  average_price: number;
  /**
   * Id of the user that placed the order
   */
  placed_by: string;
  /**
   * Date for which last NAV is available
   */
  last_price_date: string;
  /**
   * Tag that was sent with an order to identify it (alphanumeric, max 8 chars)
   */
  tag: any;
}
/**
 * Single Mutual Fund SIP response.
 */
interface MFSIP {
  /**
   * Unique SIP id
   */
  sip_id: string;
  /**
   * ISIN of the fund.
   */
  tradingsymbol: string;
  /**
   * Name of the fund
   */
  fund: string;
  /**
   * Dividend type (growth, payout)
   */
  dividend_type: string;
  /**
   * BUY or SELL
   */
  transaction_type: string;
  /**
   * ACTIVE, PAUSED or CANCELLED
   */
  status: string;
  /**
   * Date at which the SIP was registered by the API
   */
  created: Date;
  /**
   * Frequency at which order is triggered (monthly, weekly, or quarterly)
   */
  frequency: string;
  /**
   * Upcoming instalment date
   */
  next_instalment: string;
  /**
   * Amount worth of units to purchase in each instalment
   */
  instalment_amount: number;
  /**
   * Number of instalments (-1 in case of SIPs active until cancelled)
   */
  instalments: number;
  /**
   * Date at which the last instalment was triggered
   */
  last_instalment: Date;
  /**
   * Number of instalments pending (-1 in case of SIPs active until cancelled)
   */
  pending_instalments: number;
  /**
   * Calendar day in a month on which SIP order to be triggered (valid only incase of frequency monthly, else 0)
   */
  instalment_day: number;
  /**
   * Total number of completed instalments from the start
   */
  completed_instalments: number;
  /**
   * Tag that was sent with an order to identify it (alphanumeric, max 8 chars)
   */
  tag: string;
  sip_reg_num: null | string;
  trigger_price: number;
  step_up: Record<string, number>;
  sip_type: string;
}
/**
 * Single Order response.
 */
interface Order {
  /**
   * Unique order ID
   */
  order_id: string;
  /**
   * Order ID of the parent order (only applicable in case of multi-legged orders like CO)
   */
  parent_order_id: null | string;
  /**
   * Exchange generated order ID. Orders that don't reach the exchange have null IDs
   */
  exchange_order_id: null | string;
  /**
   * ID of the user that placed the order. This may different from the user's ID for orders placed outside of Kite, for instance, by dealers at the brokerage using dealer terminals
   */
  placed_by: string;
  /**
   * Order variety (regular, amo, co etc.)
   */
  variety: string;
  /**
   * Current status of the order. Most common values or COMPLETE, REJECTED, CANCELLED, and OPEN. There may be other values as well.
   */
  status: string;
  /**
   * Exchange tradingsymbol of the of the instrument
   */
  tradingsymbol: string;
  /**
   * Exchange
   */
  exchange: string;
  /**
   * The numerical identifier issued by the exchange representing the instrument. Used for subscribing to live market data over WebSocket
   */
  instrument_token: number;
  /**
   * BUY or SELL
   */
  transaction_type: string;
  /**
   * Order type (MARKET, LIMIT etc.)
   */
  order_type: string;
  /**
   * Margin product to use for the order (margins are blocked based on this) ?
   */
  product: string;
  /**
   * Order validity
   */
  validity: string;
  /**
   * Price at which the order was placed (LIMIT orders)
   */
  price: number;
  /**
   * Quantity ordered
   */
  quantity: number;
  /**
   * Trigger price (for SL, SL-M, CO orders)
   */
  trigger_price: number;
  /**
   * Average price at which the order was executed (only for COMPLETE orders)
   */
  average_price: number;
  /**
   * Pending quantity to be filled
   */
  pending_quantity: number;
  /**
   * Quantity that's been filled
   */
  filled_quantity: number;
  /**
   * Quantity to be disclosed (may be different from actual quantity) to the public exchange orderbook. Only for equities
   */
  disclosed_quantity: number;
  /**
   * Date at which the order was registered by the API
   */
  order_timestamp: Date;
  /**
   * Date at which the order was registered by the exchange. Orders that don't reach the exchange have null timestamps
   */
  exchange_timestamp: null | Date;
  /**
   * Timestamp at which an order's state changed at the exchange
   */
  exchange_update_timestamp: null | string;
  /**
   * Textual description of the order's status. Failed orders come with human readable explanation
   */
  status_message: null | string;
  /**
   * Raw textual description of the failed order's status, as received from the OMS
   */
  status_message_raw: null | string;
  /**
   * Quantity that's cancelled
   */
  cancelled_quantity: number;
  /**
   * Map of arbitrary fields that the system may attach to an order.
   */
  meta: object | string;
  /**
   * An optional tag to apply to an order to identify it (alphanumeric, max 20 chars)
   */
  tag: null | string;
  tags?: string[];
  /**
   * Unusable request id to avoid order duplication
   */
  guid: string;
  /**
   * 0 or 1
   */
  market_protection: number;
}
/**
 * Single Trade response.
 */
interface Trade {
  /**
   * Exchange generated trade ID
   */
  trade_id: string;
  /**
   * Unique order ID
   */
  order_id: string;
  /**
   * Exchange generated order ID
   */
  exchange_order_id: null | string;
  /**
   * Exchange tradingsymbol of the of the instrument
   */
  tradingsymbol: string;
  /**
   * Exchange
   */
  exchange: string;
  /**
   * The numerical identifier issued by the exchange representing the instrument.
   * Used for subscribing to live market data over WebSocket
   */
  instrument_token: number;
  /**
   * BUY or SELL
   */
  transaction_type: string;
  /**
   * Margin product to use for the order (margins are blocked based on this) ?
   */
  product: string;
  /**
   * Price at which the quantity was filled
   */
  average_price: number;
  /**
   * Filled quantity
   */
  filled: number;
  quantity: number;
  /**
   * Date at which the trade was filled at the exchange
   */
  fill_timestamp: Date;
  /**
   * Date at which the order was registered by the API
   */
  order_timestamp: Date;
  /**
   * Date at which the order was registered by the exchange
   */
  exchange_timestamp: Date;
}
/**
 * Single Position response.
 */
interface Position {
  /**
   * Exchange tradingsymbol of the instrument
   */
  tradingsymbol: string;
  /**
   * Exchange
   */
  exchange: string;
  /**
   * The numerical identifier issued by the exchange representing the instrument. Used for subscribing to live market data over WebSocket
   */
  instrument_token: number;
  /**
   * Margin product applied to the position
   */
  product: string;
  /**
   * Quantity held
   */
  quantity: number;
  /**
   * Quantity held previously and carried forward over night
   */
  overnight_quantity: number;
  /**
   * The quantity/lot size multiplier used for calculating P&Ls.
   */
  multiplier: number;
  /**
   * Average price at which the net position quantity was acquired
   */
  average_price: number;
  /**
   * Closing price of the instrument from the last trading day
   */
  close_price: number;
  /**
   * Last traded market price of the instrument
   */
  last_price: number;
  /**
   * Net value of the position
   */
  value: number;
  /**
   * Net returns on the position; Profit and loss
   */
  pnl: number;
  /**
   * Mark to market returns (computed based on the last close and the last traded price)
   */
  m2m: number;
  /**
   * Unrealised intraday returns
   */
  unrealised: number;
  /**
   * Realised intraday returns
   */
  realised: number;
  /**
   * Quantity bought and added to the position
   */
  buy_quantity: number;
  /**
   * Average price at which quantities were bought
   */
  buy_price: number;
  /**
   * Net value of the bought quantities
   */
  buy_value: number;
  /**
   * Mark to market returns on the bought quantities
   */
  buy_m2m: number;
  /**
   * Quantity bought and added to the position during the day
   */
  day_buy_quantity: number;
  /**
   * Average price at which quantities were bought during the day
   */
  day_buy_price: number;
  /**
   * Net value of the quantities bought during the day
   */
  day_buy_value: number;
  /**
   * Quantity sold off from the position
   */
  sell_quantity: number;
  /**
   * Average price at which quantities were sold
   */
  sell_price: number;
  /**
   * Net value of the sold quantities
   */
  sell_value: number;
  /**
   * Mark to market returns on the sold quantities
   */
  sell_m2m: number;
  /**
   * Quantity sold off from the position during the day
   */
  day_sell_quantity: number;
  /**
   * Average price at which quantities were sold during the day
   */
  day_sell_price: number;
  /**
   * Net value of the quantities sold during the day
   */
  day_sell_value: number;
}
/**
 * Compact response from the Margin API calculator.
 */
interface CompactMargin {
  /**
   * equity/commodity
   */
  type: string;
  /**
   * Trading symbol of the instrument
   */
  tradingsymbol: string;
  /**
   * Name of the exchange
   */
  exchange: string;
  /**
   * Total margin block
   */
  total: number;
}
/**
 * Full response from the Margin API calculator.
 */
interface Margin extends CompactMargin {
  /**
   * SPAN margins
   */
  span: number;
  /**
   * Exposure margins
   */
  exposure: number;
  /**
   * Option premium
   */
  option_premium: number;
  /**
   * Additional margins
   */
  additional: number;
  /**
   * BO margins
   */
  bo: number;
  /**
   * Cash credit
   */
  cash: number;
  /**
   * VAR
   */
  var: number;
  pnl: {
    /**
     * Realised profit and loss
     */
    realised: number;
    /**
     * Unrealised profit and loss
     */
    unrealised: number;
  };
  /**
   * Margin leverage allowed for the trade
   */
  leverage: number;
  /**
   * The breakdown of the various charges that will be applied to an order
   */
  charges: {
    /**
     * Total charges
     */
    total: number;
    /**
     * Tax levied for each transaction on the exchanges
     */
    transaction_tax: number;
    /**
     * Type of transaction tax
     */
    transaction_tax_type: string;
    /**
     * Charge levied by the exchange on the total turnover of the day
     */
    exchange_turnover_charge: number;
    /**
     * Charge levied by SEBI on the total turnover of the day
     */
    sebi_turnover_charge: number;
    /**
     * The brokerage charge for a particular trade
     */
    brokerage: number;
    /**
     * Duty levied on the transaction value by Government of India
     */
    stamp_duty: number;
    gst: {
      /**
       * Integrated Goods and Services Tax levied by the government
       */
      igst: number;
      /**
       * Central Goods and Services Tax levied by the government
       */
      cgst: number;
      /**
       * State Goods and Services Tax levied by the government
       */
      sgst: number;
      /**
       * Total GST
       */
      total: number;
    };
  };
}
/**
 * An order in the Margin API calculator.
 */
interface MarginOrder {
  /**
   * Name of the exchange(eg. NSE, BSE, NFO, CDS, MCX)
   */
  exchange: Exchange;
  /**
   * Trading symbol of the instrument
   */
  tradingsymbol: string;
  /**
   * eg. BUY, SELL
   */
  transaction_type: TransactionType;
  /**
   * Order variety (regular, amo, bo, co etc.)
   */
  variety: Variety;
  /**
   * Margin product to use for the order
   */
  product: ProductType;
  /**
   * Order type (MARKET, LIMIT etc.)
   */
  order_type: OrderType;
  /**
   * Quantity of the order
   */
  quantity: number;
  /**
   * Price at which the order is going to be placed (LIMIT orders)
   */
  price?: number;
  /**
   * Trigger price (for SL, SL-M, CO orders)
   */
  trigger_price?: number;
}
/**
 * Params for placing a GTT.
 */
interface GTTParams {
  /**
   * GTT type, its either KiteConnect.GTT_TYPE_OCO or KiteConnect.GTT_TYPE_SINGLE.
   */
  trigger_type: TriggerType;
  /**
   * Tradingsymbol of the instrument (ex. RELIANCE, INFY).
   */
  tradingsymbol: string;
  /**
   * Exchange in which instrument is listed (NSE, BSE, NFO, BFO, CDS, MCX).
   */
  exchange: Exchange;
  /**
   * List of trigger values, number of items depends on trigger type.
   */
  trigger_values: number[];
  /**
   * Price at which trigger is created. This is usually the last price of the instrument.
   */
  last_price: number;
  orders: {
    /**
     * Transaction type (BUY or SELL).
     */
    transaction_type: TransactionType;
    /**
     * Order quantity
     */
    quantity: number;
    /**
     * Product code (NRML, MIS, CNC).
     */
    product: ProductType;
    /**
     * Order type (LIMIT, SL, SL-M, MARKET).
     */
    order_type: OrderType;
    /**
     * Order price.
     */
    price: number;
  }[];
}
/**
 * Params to construct a KiteConnect class.
 */
interface KiteConnectParams {
  /**
   * API key issued to you.
   */
  api_key: string;
  /**
   * Token obtained after the login flow in exchange for the `request_token`.
   * Pre-login, this will default to null, but once you have obtained it, you
   * should persist it in a database or session to pass to the Kite Connect
   * class initialisation for subsequent requests.
   *
   * @defaultValue `null`
   */
  access_token?: string;
  /**
   * API end point root. Unless you explicitly want to send API requests to a
   * non-default endpoint, this can be ignored.
   *
   * @defaultValue "https://api.kite.trade"
   */
  root?: string;
  /**
   * Kite connect login url
   *
   * @defaultValue "https://kite.trade/connect/login"
   */
  login_uri?: string;
  /**
   * If set to true, will console log requests and responses.
   *
   * @defaultValue `false`
   */
  debug?: boolean;
  /**
   * Time (milliseconds) for which the API client will wait for a request to complete before it fails.
   *
   * @defaultValue `7000`
   */
  timeout?: number;

  enc_token?: string;
  user_id?: string;
}
/**
 * Params to convert a position.
 */
interface ConvertPositionParams {
  /**
   * Exchange in which instrument is listed (NSE, BSE, NFO, BFO, CDS, MCX).
   */
  exchange: Exchange;
  /**
   * Tradingsymbol of the instrument (ex. RELIANCE, INFY).
   */
  tradingsymbol: string;
  /**
   * Transaction type (BUY or SELL).
   */
  transaction_type: TransactionType;
  /**
   * Position type (overnight, day).
   */
  position_type: "overnight" | "day";
  /**
   * Position quantity
   */
  quantity: string;
  /**
   * Current product code (NRML, MIS, CNC).
   */
  old_product: ProductType;
  /**
   * New Product code (NRML, MIS, CNC).
   */
  new_product: ProductType;
}
/**
 * User prodile response.
 */
interface UserProfile {
  /**
   * The unique, permanent user id registered with the broker and the exchanges
   */
  user_id: string;
  /**
   * User's real name
   */
  user_name: string;
  /**
   * Shortened version of the user's real name
   */
  user_shortname: string;
  /**
   * User's email
   */
  email: string;
  /**
   * User's registered role at the broker. This will be individual for all retail users
   */
  user_type: string;
  /**
   * The broker ID
   */
  broker: string;
  /**
   * Exchanges enabled for trading on the user's account
   */
  exchanges: string[];
  /**
   * Margin product types enabled for the user
   */
  products: string[];
  /**
   * Order types enabled for the user
   */
  order_types: string[];
  meta: {
    /**
     * demat_consent: empty, consent or physical
     */
    demat_consent: string;
  };
  /**
   * Full URL to the user's avatar (PNG image) if there's one
   */
  avatar_url: null | string;
}
/**
 * Single Quote response.
 */
interface Quote {
  /**
   * The numerical identifier issued by the exchange representing the instrument.
   */
  instrument_token: number;
  /**
   * The exchange timestamp of the quote packet
   */
  timestamp: string;
  /**
   * Last trade timestamp
   */
  last_trade_time: null | string;
  /**
   * Last traded market price
   */
  last_price: number;
  /**
   * Volume traded today
   */
  volume: number;
  /**
   * The volume weighted average price of a stock at a given time during the day?
   */
  average_price: number;
  /**
   * Total quantity of buy orders pending at the exchange
   */
  buy_quantity: number;
  /**
   * Total quantity of sell orders pending at the exchange
   */
  sell_quantity: number;
  /**
   * Total number of outstanding contracts held by market participants exchange-wide (only F&O)
   */
  open_interest?: number;
  /**
   * Last traded quantity
   */
  last_quantity: number;
  ohlc: {
    /**
     * Price at market opening
     */
    open: number;
    /**
     * Highest price today
     */
    high: number;
    /**
     * Lowest price today
     */
    low: number;
    /**
     * Closing price of the instrument from the last trading day
     */
    close: number;
  };
  /**
   * The absolute change from yesterday's close to last traded price
   */
  net_change: number;
  /**
   * The current lower circuit limit
   */
  lower_circuit_limit: number;
  /**
   * The current upper circuit limit
   */
  upper_circuit_limit: number;
  /**
   * The Open Interest for a futures or options contract ?
   */
  oi: number;
  /**
   * The highest Open Interest recorded during the day
   */
  oi_day_high: number;
  /**
   * The lowest Open Interest recorded during the day
   */
  oi_day_low: number;
  depth: {
    buy: {
      /**
       * Price at which the depth stands
       */
      price: number;
      /**
       * Number of open BUY (bid) orders at the price
       */
      orders: number;
      /**
       * Net quantity from the pending orders
       */
      quantity: number;
    }[];
    sell: {
      /**
       * Price at which the depth stands
       */
      price: number;
      /**
       * Number of open SELL (ask) orders at the price
       */
      orders: number;
      /**
       * Net quantity from the pending orders
       */
      quantity: number;
    }[];
  };
}
/**
 * Params to place an order.
 */
interface PlaceOrderParams {
  /**
   * Exchange in which instrument is listed (NSE, BSE, NFO, BFO, CDS, MCX).
   */
  exchange: Exchange;
  /**
   * Tradingsymbol of the instrument (ex. RELIANCE, INFY).
   */
  tradingsymbol: string;
  /**
   * Transaction type (BUY or SELL).
   */
  transaction_type: TransactionType;
  /**
   * Order quantity
   */
  quantity: number;
  /**
   * Product code (NRML, MIS, CNC).
   */
  product: ProductType;
  /**
   * Order type (LIMIT, SL, SL-M, MARKET).
   */
  order_type: OrderType;
  /**
   * Order validity (DAY, IOC).
   */
  validity?: Validity;
  /**
   * Order Price
   */
  price?: number;
  /**
   * Disclosed quantity
   */
  disclosed_quantity?: number;
  /**
   * Trigger price
   */
  trigger_price?: number;
  /**
   * Square off value (only for bracket orders)
   */
  squareoff?: number;
  /**
   * Stoploss value (only for bracket orders)
   */
  stoploss?: number;
  /**
   * Trailing stoploss value (only for bracket orders)
   */
  trailing_stoploss?: number;
  /**
   * Order validity in minutes for TTL validity orders
   */
  validity_ttl?: number;
  /**
   * Total number of legs for iceberg order variety
   */
  iceberg_legs?: number;
  /**
   * Split quantity for each iceberg leg order
   */
  iceberg_quantity?: number;
  /**
   * A unique identifier for a particular auction
   */
  auction_number?: number;
  /**
   * An optional tag to apply to an order to identify it (alphanumeric, max 20 chars)
   */
  tag?: string;
}

/**
 * API client class. In production, you may initialise a single instance of this class per `api_key`.
 * This module provides an easy to use abstraction over the HTTP APIs.
 * The HTTP calls have been converted to methods and their JSON responses.
 * See the **[Kite Connect API documentation](https://kite.trade/docs/connect/v3/)**
 * for the complete list of APIs, supported parameters and values, and response formats.
 *
 * @example
 * Getting started
 * ------------------------
 * ```ts
 * import { KiteConnect } from "kiteconnect-ts";
 *
 * const kc = new KiteConnect({
 *   api_key: 'YOUR_API_KEY',
 * });
 *
 * // Get access token
 * try {
 *   const { access_token } = await kc.generateSession(
 *     'request_token',
 *     'YOUR_API_SECRET'
 *   );
 *   console.log('Access token:', access_token);
 * } catch (error) {
 *   console.error('Error while generating session', error);
 *   process.exit(1);
 * }
 *
 * // Get equity margins
 * try {
 *   const margins = await kc.getMargins('equity');
 *   console.log('Equity margins', margins.equity);
 * } catch (error) {
 *   console.error('Error while fetching equity margins', error);
 * }
 * ```
 *
 * @example
 * API promises
 * -------------
 * All API calls returns a promise which you can use to call methods like `.then(...)` and `.catch(...)` or `await`.
 *
 * ```ts
 * kiteConnectApiCall()
 * 	.then(function(v) {
 * 	    // On success
 * 	})
 * 	.catch(function(e) {
 * 		// On rejected
 * 	});
 *
 * try {
 *    const response = await kiteConnectAPiCall();
 *    // Do something with response
 * } catch(error) {
 *    // Handle error
 * }
 * ```
 */
declare class KiteConnect {
  readonly PRODUCT_MIS: "MIS";
  readonly PRODUCT_CNC: "CNC";
  readonly PRODUCT_NRML: "NRML";
  readonly PRODUCT_CO: "CO";
  readonly PRODUCT_BO: "BO";
  readonly ORDER_TYPE_MARKET: "MARKET";
  readonly ORDER_TYPE_LIMIT: "LIMIT";
  readonly ORDER_TYPE_SLM: "SL-M";
  readonly ORDER_TYPE_SL: "SL";
  readonly VARIETY_REGULAR: "regular";
  readonly VARIETY_BO: "bo";
  readonly VARIETY_CO: "co";
  readonly VARIETY_AMO: "amo";
  readonly VARIETY_ICEBERG: "iceberg";
  readonly VARIETY_AUCTION: "auction";
  readonly TRANSACTION_TYPE_BUY: "BUY";
  readonly TRANSACTION_TYPE_SELL: "SELL";
  readonly VALIDITY_DAY: "DAY";
  readonly VALIDITY_IOC: "IOC";
  readonly VALIDITY_TTL: "TTL";
  readonly EXCHANGE_NSE: "NSE";
  readonly EXCHANGE_BSE: "BSE";
  readonly EXCHANGE_NFO: "NFO";
  readonly EXCHANGE_CDS: "CDS";
  readonly EXCHANGE_BCD: "BCD";
  readonly EXCHANGE_BFO: "BFO";
  readonly EXCHANGE_MCX: "MCX";
  readonly MARGIN_EQUITY = "equity";
  readonly MARGIN_COMMODITY = "commodity";
  readonly STATUS_CANCELLED = "CANCELLED";
  readonly STATUS_REJECTED = "REJECTED";
  readonly STATUS_COMPLETE = "COMPLETE";
  readonly GTT_TYPE_OCO: "two-leg";
  readonly GTT_TYPE_SINGLE: "single";
  readonly GTT_STATUS_ACTIVE = "active";
  readonly GTT_STATUS_TRIGGERED = "triggered";
  readonly GTT_STATUS_DISABLED = "disabled";
  readonly GTT_STATUS_EXPIRED = "expired";
  readonly GTT_STATUS_CANCELLED = "cancelled";
  readonly GTT_STATUS_REJECTED = "rejected";
  readonly GTT_STATUS_DELETED = "deleted";
  readonly POSITION_TYPE_DAY = "day";
  readonly POSITION_TYPE_OVERNIGHT = "overnight";
  private api_key;
  private root;
  private timeout;
  private debug;
  private access_token;
  private default_login_uri;
  private session_expiry_hook;
  private requestInstance;
  private readonly kiteVersion;
  private readonly userAgent;
  private readonly routes;
  constructor(params: KiteConnectParams);
  /**
   * Set access_token received after a successful authentication.
   *
   * @param access_token Token obtained in exchange for `request_token`.
   * Once you have obtained `access_token`, you should persist it in a database or session to pass
   * to the Kite Connect class initialisation for subsequent requests.
   */
  setAccessToken(access_token: string): void;
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
  setSessionExpiryHook(cb: Function): void;
  /**
   * Get the remote login url to which a user should be redirected to initiate the login flow.
   */
  getLoginURL(): string;
  /**
   * Do the token exchange with the `request_token` obtained after the login flow,
   * and retrieve the `access_token` required for all subsequent requests. The response
   * contains not just the `access_token`, but metadata for the user who has authenticated.
   *
   * @param request_token Token obtained from the GET parameters after a successful login redirect.
   * @param api_secret API secret issued with the API key.
   */
  generateSession(
    request_token: string,
    api_secret: string
  ): Promise<SessionData>;
  /**
   * Kill the session by invalidating the access token.
   * If access_token is passed then it will be set as current access token and get in validated.
   *
   * @param access_token Token to invalidate. Default is the active `access_token`.
   */
  invalidateAccessToken(access_token?: string): Promise<boolean>;
  /**
   * Renew access token by active refresh token. Renewed access token is implicitly set.
   *
   * @param refresh_token Token obtained from previous successful login.
   * @param api_secret API secret issued with the API key.
   */
  renewAccessToken(
    refresh_token: string,
    api_secret: string
  ): Promise<SessionData>;
  /**
   * Invalidate the refresh token.
   *
   * @param refresh_token Token to invalidate.
   */
  invalidateRefreshToken(refresh_token: string): Promise<boolean>;
  /**
   * Get user profile details.
   */
  getProfile(): Promise<UserProfile>;
  /**
   * Get account balance and cash margin details for a particular segment.
   *
   * @param segment trading segment (eg: equity or commodity).
   */
  getMargins(segment?: "equity" | "commodity"): Promise<{
    equity?: UserMargin;
    commodity?: UserMargin;
  }>;
  /**
   * Place an order.
   *
   * @param variety Order variety (ex. bo, co, amo, regular).
   * @param params Order params.
   */
  placeOrder(
    variety: Variety,
    params: PlaceOrderParams
  ): Promise<{
    order_id: string;
  }>;
  /**
   * Modify an order
   *
   * @param variety Order variety (ex. bo, co, amo, regular).
   * @param order_id ID of the order.
   * @param params Order modify params.
   */
  modifyOrder(
    variety: Variety,
    order_id: string,
    params: {
      /**
       * Order quantity
       */
      quantity?: number;
      /**
       * Order Price
       */
      price?: number;
      /**
       * Order type (NRML, SL, SL-M, MARKET).
       */
      order_type?: OrderType;
      /**
       * Order validity (DAY, IOC).
       */
      validity?: Validity;
      /**
       * Disclosed quantity
       */
      disclosed_quantity?: number;
      /**
       * Trigger price
       */
      trigger_price?: number;
      /**
       * Parent order id incase of multilegged orders.
       */
      parent_order_id?: string;
    }
  ): Promise<{
    order_id: string;
  }>;
  /**
   * Cancel an order
   *
   * @param variety Order variety (ex. bo, co, amo)
   * @param order_id ID of the order.
   * @param params Order params. regular).
   */
  cancelOrder(
    variety: Variety,
    order_id: string,
    params?: {
      /**
       * Parent order id incase of multilegged orders.
       */
      parent_order_id?: string;
    }
  ): Promise<{
    order_id: string;
  }>;
  /**
   * Exit an order
   *
   * @param variety Order variety (ex. bo, co, amo)
   * @param order_id ID of the order.
   * @param params Order params.
   */
  exitOrder(
    variety: Variety,
    order_id: string,
    params?: {
      /**
       * Parent order id incase of multilegged orders.
       */
      parent_order_id?: string;
    }
  ): Promise<{
    order_id: string;
  }>;
  /**
   * Get list of orders.
   */
  getOrders(): Promise<Order[]>;
  /**
   * Get list of order history.
   *
   * @param order_id ID of the order whose order details to be retrieved.
   */
  getOrderHistory(order_id: string): Promise<Order[]>;
  /**
   * Retrieve the list of trades executed.
   */
  getTrades(): Promise<Trade[]>;
  /**
   * Retrieve the list of trades a particular order).
   * An order can be executed in tranches based on market conditions.
   * These trades are individually recorded under an order.
   *
   * @param order_id ID of the order whose trades are to be retrieved.
   */
  getOrderTrades(order_id: string): Promise<Trade[]>;
  /**
   * Fetch required margin for order/list of orders
   *
   * @param orders Margin fetch orders.
   * @param mode (optional) Compact mode will only give the total margins
   */
  orderMargins(orders: MarginOrder[]): Promise<Margin[]>;
  orderMargins(
    orders: MarginOrder[],
    mode: "compact"
  ): Promise<CompactMargin[]>;
  /**
   * Fetch basket margin for list of orders
   *
   * @param orders Margin fetch orders.
   * @param consider_positions Boolean to consider users positions while calculating margins. Defauls to true
   * @param mode (optional) Compact mode will only give the total margins
   */
  orderBasketMargins(orders: MarginOrder[]): Promise<{
    initial: Margin;
    final: Margin;
    orders: Margin[];
  }>;
  orderBasketMargins(
    orders: MarginOrder[],
    consider_positions: boolean
  ): Promise<{
    initial: Margin;
    final: Margin;
    orders: Margin[];
  }>;
  orderBasketMargins(
    orders: MarginOrder[],
    consider_positions: boolean,
    mode: "compact"
  ): Promise<{
    initial: CompactMargin;
    final: CompactMargin;
    orders: CompactMargin[];
  }>;
  /**
   * Retrieve the list of equity holdings.
   */
  getHoldings(): Promise<PortfolioHolding[]>;
  getAuctionInstruments(): Promise<any>;
  /**
   * Retrieve positions.
   */
  getPositions(): Promise<{
    net: Position[];
    day: Position[];
  }>;
  /**
   * Modify an open position's product type.
   *
   * @param params params.
   */
  convertPosition(params: ConvertPositionParams): Promise<boolean>;
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
  getInstruments(exchange?: Exchange[]): Promise<Instrument[]>;
  /**
   * Retrieve quote and market depth for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getQuote(instruments: string | string[]): Promise<Record<string, Quote>>;
  /**
   * Retrieve OHLC for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getOHLC(instruments: string | string[]): Promise<
    Record<
      string,
      {
        /**
         * The numerical identifier issued by the exchange representing the instrument.
         */
        instrument_token: number;
        /**
         * Last traded market price
         */
        last_price: number;
        ohlc: {
          /**
           * Price at market opening
           */
          open: number;
          /**
           * Highest price today
           */
          high: number;
          /**
           * Lowest price today
           */
          low: number;
          /**
           * Closing price of the instrument from the last trading day
           */
          close: number;
        };
      }
    >
  >;
  /**
   * Retrieve LTP for list of instruments.
   *
   * @param instruments is a single instrument or a list of instruments, Instrument are in the format of `exchange:tradingsymbol`.
   * For example NSE:INFY and for list of instruments ["NSE:RELIANCE", "NSE:SBIN", ..]
   */
  getLTP(instruments: string | string[]): Promise<
    Record<
      string,
      {
        /**
         * The numerical identifier issued by the exchange representing the instrument.
         */
        instrument_token: number;
        /**
         * Last traded market price
         */
        last_price: number;
      }
    >
  >;
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
    instrument_token: string,
    interval:
      | "minute"
      | "day"
      | "3minute"
      | "5minute"
      | "10minute"
      | "15minute"
      | "30minute"
      | "60minute",
    from_date: string | Date,
    to_date: string | Date,
    continuous?: boolean,
    oi?: boolean
  ): Promise<{
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    oi?: number;
  }>;
  private _getDateTimeString;
  /**
   * Get list of mutual fund orders.
   *
   * @param order_id ID of the order (optional) whose order details are to be retrieved.
   * If no `order_id` is specified, all orders for the day are returned.
   */
  getMFOrders(order_id?: string): Promise<MFOrder | MFOrder[]>;
  /**
   * Place a mutual fund order.
   *
   * @param params MF Order params.
   */
  placeMFOrder(params: {
    /**
     * Tradingsymbol (ISIN) of the fund.
     */
    tradingsymbol: string;
    /**
     * Transaction type (BUY or SELL).
     */
    transaction_type: TransactionType;
    /**
     * Quantity to SELL. Not applicable on BUYs.
     */
    quantity?: number;
    /**
     * Amount worth of units to purchase. Not applicable on SELLs
     */
    amount?: number;
    /**
     * An optional tag to apply to an order to identify it (alphanumeric, max 20 chars)
     */
    tag?: string;
  }): Promise<{
    order_id: number;
  }>;
  /**
   * Cancel a mutual fund order.
   *
   * @param order_id ID of the order.
   */
  cancelMFOrder(order_id: string): Promise<{
    order_id: string;
  }>;
  /**
   * Get list of mutual fund SIPS.
   * If no `sip_id` is specified, all active and paused SIPs are returned.
   *
   * @param sip_id ID of the SIP (optional) whose details are to be retrieved.
   */
  getMFSIPS(sip_id?: string): Promise<MFSIP | MFSIP[]>;
  /**
   * Place a mutual fund SIP.
   *
   * @param params SIP params.
   */
  placeMFSIP(params: {
    /**
     * Tradingsymbol (ISIN) of the fund.
     */
    tradingsymbol: string;
    /**
     * Amount worth of units to purchase.
     */
    amount: number;
    /**
     * Number of instalments to trigger.
     * If set to -1, instalments are triggered at fixed intervals until the SIP is cancelled
     */
    instalments: number;
    /**
     * Order frequency. weekly, monthly, or quarterly.
     */
    frequency: "weekly" | "monthly" | "quarterly";
    /**
     * Amount worth of units to purchase before the SIP starts.
     */
    initial_amount?: number;
    /**
     * If frequency is monthly, the day of the month (1, 5, 10, 15, 20, 25) to trigger the order on.
     */
    instalment_day?: string;
    /**
     * An optional tag to apply to an order to identify it (alphanumeric, max 20 chars)
     */
    tag?: string;
  }): Promise<{
    sip_id: number;
  }>;
  /**
   * Modify a mutual fund SIP.
   *
   * @param sip_id ID of the SIP.
   * @param params Modify params.
   */
  modifyMFSIP(
    sip_id: string,
    params: {
      /**
       * Number of instalments to trigger.
       * If set to -1, instalments are triggered at fixed intervals until the SIP is cancelled
       */
      instalments?: number;
      /**
       * Order frequency. weekly, monthly, or quarterly.
       */
      frequency?: "weekly" | "monthly" | "quarterly";
      /**
       * If frequency is monthly, the day of the month (1, 5, 10, 15, 20, 25) to trigger the order on.
       */
      instalment_day?: string;
      /**
       * Pause or unpause an SIP (active or paused).
       */
      status?: "active" | "paused";
    }
  ): Promise<{
    sip_id: number;
  }>;
  /**
   * Cancel a mutual fund SIP.
   *
   * @param sip_id ID of the SIP.
   */
  cancelMFSIP(sip_id: string): Promise<{
    sip_id: string;
  }>;
  /**
   * Get list of mutual fund holdings.
   */
  getMFHoldings(): Promise<MFHolding[]>;
  /**
   * Get list of mutual fund instruments.
   */
  getMFInstruments(): Promise<MFInstrument[]>;
  /**
   * Get GTTs list
   */
  getGTTs(): Promise<Trigger[]>;
  /**
   * Get list of order history.
   * @param trigger_id GTT trigger ID
   */
  getGTT(trigger_id: string): Promise<Trigger>;
  private _getGTTPayload;
  /**
   * Place GTT.
   *
   * @param params Place GTT params
   */
  placeGTT(params: GTTParams): Promise<{
    trigger_id: number;
  }>;
  /**
   * Modify GTT.
   *
   * @param trigger_id GTT trigger ID.
   * @param params Modify params
   */
  modifyGTT(
    trigger_id: string,
    params: GTTParams
  ): Promise<{
    trigger_id: number;
  }>;
  /**
   * Get list of order history.
   *
   * @param trigger_id GTT ID
   */
  deleteGTT(trigger_id: string): Promise<{
    trigger_id: number;
  }>;
  /**
   * Validate postback data checksum
   *
   * @param postback_data Postback data received. Must be an json object with required keys order_id, checksum and order_timestamp
   * @param api_secret Api secret of the app
   */
  validatePostback(
    postback_data: {
      order_id: string;
      checksum: string;
      order_timestamp: string;
    },
    api_secret: string
  ): boolean;
  private formatGenerateSession;
  private formatQuoteResponse;
  private formatResponse;
  private parseHistorical;
  private transformInstrumentsResponse;
  private transformMFInstrumentsResponse;
  private _get;
  private _post;
  private _put;
  private _delete;
  private request;
}

/**
 * LTP Packet
 */
interface TickLtp {
  /**
   * Whether the instrument is tradable or not. `false` for Indices
   */
  tradable: boolean;
  /**
   * Packet mode is 'ltp'
   */
  mode: "ltp";
  /**
   * Instrument token
   */
  instrument_token: number;
  /**
   * Last traded price
   */
  last_price: number;
}
/**
 * Index Quote packet
 */
interface TickIndexQuote extends Omit<TickLtp, "mode"> {
  /**
   * Packet mode is 'quote'
   */
  mode: "quote";
  /**
   * Open, High, Low and Close data
   */
  ohlc: {
    /**
     * High of the day
     */
    high: number;
    /**
     * Low of the day
     */
    low: number;
    /**
     * Open of the day
     */
    open: number;
    /**
     * Close of the day
     */
    close: number;
  };
  /**
   * Price change
   */
  change: number;
}
/**
 * Index Full packet
 */
interface TickIndexFull extends Omit<TickIndexQuote, "mode"> {
  /**
   * Packet mode is 'full'
   */
  mode: "full";
  /**
   * Exchange timestamp
   */
  timestamp: Date;
}
/**
 * Quote packet
 */
interface TickQuote extends Omit<TickLtp, "mode"> {
  /**
   * Packet mode is 'quote'
   */
  mode: "quote";
  /**
   * Last traded quantity
   */
  last_traded_quantity: number;
  /**
   * Average traded price
   */
  average_traded_price: number;
  /**
   * Volume traded for the day
   */
  volume_traded: number;
  /**
   * Total buy quantity
   */
  total_buy_quantity: number;
  /**
   * Total sell quantity
   */
  total_sell_quantity: number;
  /**
   * Open, High, Low and Close data
   */
  ohlc: {
    /**
     * Open price of the day
     */
    open: number;
    /**
     * High price of the day
     */
    high: number;
    /**
     * Low price of the day
     */
    low: number;
    /**
     * Close price of the day
     */
    close: number;
  };
  /**
   * Price change
   */
  change: number;
}
/**
 * Full packet with Market Depth data
 */
interface TickFull extends Omit<TickQuote, "mode"> {
  /**
   * Packet mode is 'full'
   */
  mode: "full";
  /**
   * Last traded timestamp
   */
  last_trade_time: Date;
  /**
   * Exchange timestamp
   */
  exchange_timestamp: Date;
  /**
   * Open Interest
   */
  oi: number;
  /**
   * Open Interest Day High
   */
  oi_day_high: number;
  /**
   * Open Interest Day Low
   */
  oi_day_low: number;
  /**
   * Market depth entries
   *
   * There are ten entries in succession — five bid entries and five offer entries.
   */
  depth: {
    /**
     * Bid entries
     */
    buy: {
      /**
       * Bid Quantity
       */
      quantity: number;
      /**
       * Bid Price
       */
      price: number;
      /**
       * Number of Bid Orders
       */
      orders: number;
    }[];
    /**
     * Offer entries
     */
    sell: {
      /**
       * Offer Quantity
       */
      quantity: number;
      /**
       * Offer Price
       */
      price: number;
      /**
       * Number of Offer Orders
       */
      orders: number;
    }[];
  };
}
/**
 * Data returned on `order_update` event
 */
interface OrderUpdatePostback extends Order {}
/**
 * Types of possible tick packet structures
 */
type Tick = TickLtp | TickIndexQuote | TickIndexFull | TickQuote | TickFull;
/**
 * All Ticker events and their corresponding callback functon signatures.
 */
type TickerEvents = {
  /**
   * When connection is successfully established.
   */
  connect: () => void | Promise<void>;
  /**
   * When ticks are available (Arrays of {@link Tick} object as the first argument).
   *
   * The type has been purposefully kept as `any` because the structure of the tick packet is not known
   * and there can be multiple types of tick packets.
   */
  ticks: (ticks: any[]) => void | Promise<void>;
  /**
   * When socket connection is disconnected. Error is received as a first param.
   */
  disconnect: (error: Error) => void | Promise<void>;
  /**
   * When socket connection is closed with error. Error is received as a first param.
   */
  error: (error: Error) => void | Promise<void>;
  /**
   * When socket connection is closed cleanly.
   */
  close: () => void | Promise<void>;
  /**
   * When reconnecting (current re-connection count and reconnect interval as arguments respectively).
   */
  reconnect: (retries: number, interval: number) => void | Promise<void>;
  /**
   * When re-connection fails after n number times.
   */
  noreconnect: () => void | Promise<void>;
  /**
   * When order update (postback) is received for the connected user ({@link Order} is received as first argument).
   */
  order_update: (order: Order) => void | Promise<void>;
  /**
   * When binary message is received from the server.
   */
  message: (data: ArrayBuffer) => void | Promise<void>;
};
/**
 * All Ticker events
 */
type TickerEvent = keyof TickerEvents;
/**
 * Params to construct a KiteTicker class
 */
interface KiteTickerParams {
  /**
   * API key issued to you.
   */
  api_key: string;
  /**
   * Access token obtained after successful login flow.
   */
  access_token?: string;
  /**
   * Enable/Disable auto reconnect. Enabled by default.
   *
   * @defaultValue `true`
   */
  reconnect?: boolean;
  /**
   * The maximum number of re-connection attempts. Defaults to 50 attempts and maximum up to 300 attempts.
   *
   * @defaultValue 50
   */
  max_retry?: number;
  /**
   * The maximum delay in seconds after which subsequent re-connection interval will become constant. Defaults to 60s and minimum acceptable value is 5s.
   *
   * @defaultValue 60
   */
  max_delay?: number;
  /**
   * Kite websocket root.
   *
   * @defaultValue "wss://ws.kite.trade/"
   */
  root?: string;

  user_id?: string;

  enc_token?: string;
}

/**
 * The WebSocket client for connecting to Kite connect streaming quotes service.
 *
 * @example
 * Getting started:
 * ----
 * ```ts
 * import { KiteTicker } from "kiteconnect";
 * const ticker = new KiteTicker({
 * 	api_key: "api_key",
 * 	access_token: "access_token"
 * });
 *
 * ticker.connect();
 * ticker.on("ticks", onTicks);
 * ticker.on("connect", subscribe);
 *
 * function onTicks(ticks) {
 * 	console.log("Ticks", ticks);
 * }
 *
 * function subscribe() {
 * 	const items = [738561];
 * 	ticker.subscribe(items);
 * 	ticker.setMode(ticker.modeFull, items);
 * }
 * ```
 *
 * Auto reconnection
 * -----------------
 * Auto reconnection is enabled by default and it can be disabled by passing `reconnect` param while initialising `KiteTicker`.
 *
 * Auto reconnection mechanism is based on [Exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff) algorithm in which
 * next retry interval will be increased exponentially. `max_delay` and `max_tries` params can be used to tweak
 * the alogrithm where `max_delay` is the maximum delay after which subsequent reconnection interval will become constant and
 * `max_tries` is maximum number of retries before it quits reconnection.
 *
 * For example if `max_delay` is 60 seconds and `max_tries` is 50 then the first reconnection interval starts from
 * minimum interval which is 2 seconds and keep increasing up to 60 seconds after which it becomes constant and when reconnection attempt
 * is reached upto 50 then it stops reconnecting.
 *
 * Callback `reconnect` will be called with current reconnect attempt and next reconnect interval and
 * `on_noreconnect` is called when reconnection attempts reaches max retries.
 *
 * @example
 * Here is an example demonstrating auto reconnection.
 * ```ts
 * import { KiteTicker } from "kiteconnect-ts";
 * const ticker = new KiteTicker({
 * 	api_key: "api_key",
 * 	access_token: "access_token"
 * });
 *
 * // set autoreconnect with 10 maximum reconnections and 5 second interval
 * ticker.autoReconnect(true, 10, 5)
 * ticker.connect();
 * ticker.on("ticks", onTicks);
 * ticker.on("connect", subscribe);
 *
 * ticker.on("noreconnect", () => {
 * 	console.log("noreconnect");
 * });
 *
 * ticker.on("reconnect", (reconnect_count, reconnect_interval) => {
 * 	console.log("Reconnecting: attempt - ", reconnect_count, " interval - ", reconnect_interval);
 * });
 *
 * ticker.on("message", (binary_msg) => {
 *	console.log("Binary message", binary_msg);
 * });
 *
 * function onTicks(ticks) {
 * 	console.log("Ticks", ticks);
 * }
 *
 * function subscribe() {
 * 	const items = [738561];
 * 	ticker.subscribe(items);
 * 	ticker.setMode(ticker.modeFull, items);
 * }
 * ```
 */
declare class KiteTicker {
  private root;
  private api_key;
  private access_token;
  private read_timeout;
  private reconnect_max_delay;
  private reconnect_max_tries;
  private mSubscribe;
  private mUnSubscribe;
  private mSetMode;
  private readonly mAlert;
  private readonly mMessage;
  private readonly mLogout;
  private readonly mReload;
  private readonly mClearCache;
  /**
   * Set mode full
   */
  readonly modeFull = "full";
  /**
   * Set mode quote
   */
  readonly modeQuote = "quote";
  /**
   * Set mode LTP
   */
  readonly modeLTP = "ltp";
  private ws;
  private triggers;
  private read_timer;
  private last_read;
  private reconnect_timer;
  private auto_reconnect;
  private current_reconnection_count;
  private last_reconnect_interval;
  private current_ws_url;
  private readonly defaultReconnectMaxDelay;
  private readonly defaultReconnectMaxRetries;
  private readonly maximumReconnectMaxRetries;
  private readonly minimumReconnectMaxDelay;
  private readonly NseCM;
  private readonly NseFO;
  private readonly NseCD;
  private readonly BseCM;
  private readonly BseFO;
  private readonly BseCD;
  private readonly McxFO;
  private readonly McxSX;
  private readonly Indices;
  /**
   * KiteTicker constructor
   *
   * @param params KiteTicker parameters
   * @returns An instance of The KiteTicker class
   */
  constructor(params: KiteTickerParams);
  /**
   * Auto reconnect settings
   *
   * @param t Enable or disable auto disconnect, defaults to false
   * @param max_retry is maximum number re-connection attempts. Defaults to 50 attempts and maximum up to 300 attempts.
   * @param max_delay in seconds is the maximum delay after which subsequent re-connection interval will become constant. Defaults to 60s and minimum acceptable value is 5s.
   */
  autoReconnect(t: boolean, max_retry?: number, max_delay?: number): void;
  /**
   * Initiate a websocket connection
   */
  connect(): void;
  /**
   * Close the websocket connection
   */
  disconnect(): void;
  /**
   * Check if the ticker is connected
   *
   * @returns `true` if the ticker is connected or `false` otherwise.
   */
  connected(): boolean;
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
  on<K extends TickerEvent>(e: K, callback: TickerEvents[K]): void;
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
  subscribe(tokens: number[]): number[];
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
  unsubscribe(tokens: number[]): number[];
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
  setMode(mode: "ltp" | "quote" | "full", tokens: number[]): number[];
  private triggerDisconnect;
  private send;
  private trigger;
  private parseTextMessage;
  private parseBinary;
  private splitPackets;
  private attemptReconnection;
  private buf2long;
}

export {
  type CompactMargin,
  type ConvertPositionParams,
  Exchange,
  type GTTParams,
  type Instrument,
  KiteConnect,
  type KiteConnectParams,
  KiteTicker,
  type KiteTickerParams,
  type MFHolding,
  type MFInstrument,
  type MFOrder,
  type MFSIP,
  type Margin,
  type MarginOrder,
  type Order,
  OrderType,
  type OrderUpdatePostback,
  type PlaceOrderParams,
  type PortfolioHolding,
  type Position,
  ProductType,
  type Quote,
  type SessionData,
  type Tick,
  type TickFull,
  type TickIndexFull,
  type TickIndexQuote,
  type TickLtp,
  type TickQuote,
  type TickerEvent,
  type TickerEvents,
  type Trade,
  TransactionType,
  type Trigger,
  TriggerType,
  type UserMargin,
  type UserProfile,
  Validity,
  Variety,
};
