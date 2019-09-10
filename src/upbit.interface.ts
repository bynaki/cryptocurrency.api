

export interface Response<T> {
  status: number
  remainingReq: {
    market: string
    min: number
    sec: number
  }
  data: T
}

export interface MarketType {
  // market 업비트에서 제공중인 시장 정보. String
  market: string
  korean_name: string
  english_name: string
}

export interface CandleType {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
}

export interface CandleMinuteType extends CandleType {
  unit: number
}

export interface CandleDayType extends CandleType {
  prev_closing_price: number
  change_price: number
  change_rate: number
  converted_trade_price?: number
}

export interface CandleWeekType extends CandleType {
  first_day_of_period: string
}

export interface CandleMonthType extends CandleType {
  first_day_of_period: string
}

export interface TradeTickType {
  market: string
  trade_date_utc: string
  trade_time_utc: string
  timestamp: number
  trade_price: number
  trade_volume: number
  prev_closing_price: number
  change_price: number
  ask_bid: 'BID'|'ASK'
  sequential_id: number
}

export interface TickerType {
  market: string
  trade_date: string
  trade_time: string
  trade_date_kst: string
  trade_time_kst: string
  trade_timestamp: number
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: 'RISE'|'EVEN'|'FALL'
  change_price: number
  change_rate: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}

export interface OrderbookType {
  market: string
  timestamp: number
  total_ask_size: number
  total_bid_size: number
  orderbook_units: [{
    ask_price: number
    bid_price: number
    ask_size: number
    bid_size: number
  }]
}

export interface AccountType {
  currency: string
  balance: string
  locked: string
  avg_buy_price: string
  avg_buy_price_modified: boolean
  unit_currency: string
}

export interface OrderChanceType {
  bid_fee: string
  ask_fee: string
  market: {
    id: string
    name: string
    order_types: string[]
    order_sides: string[]
    bid: {
      currency: string
      price_unit: string
      min_total: number
    },
    ask: {
      currency: string
      price_unit: string
      min_total: number
    },
    max_total: string
    state: string
  },
  bid_account: {
    currency: string
    balance: string
    locked: string
    avg_buy_price: string
    avg_buy_price_modified: boolean
    unit_currency: string
  },
  ask_account: {
    currency: string
    balance: string
    locked: string
    avg_buy_price: string
    avg_buy_price_modified: boolean
    unit_currency: string
  }
}

export interface OrderType {
  uuid: string
  side: 'bid'|'ask'
  ord_type: 'limit'|'price'|'market'
  price: string
  state: 'wait'|'done'
  market: string
  created_at: string
  volume: string
  remaining_volume: string
  reserved_fee: string
  remaining_fee: string
  paid_fee: string
  locked: string
  executed_volume: string
  trades_count: number
}

export interface OrderDetailType extends OrderType {
  trades: [
    {
      market: string
      uuid: string
      price: string
      volume: string
      funds: string
      side: 'bid'|'ask'
    }
  ]
}

export interface OrderExType extends OrderType {
  avg_price: string
}

export interface CandleParam {
  market: string
  to?: string
  count?: number
}

export interface CandleParamEx extends CandleParam {
  convertingPriceUnit?: string
}

export interface TradeTickParam {
  market: string
  to?: string
  count?: number
  cursor?: string
}

export interface OrderDetailParam {
  uuid: string
  identifier?: string
}

export interface OrderListParam {
  market: string
  state?: string
  uuids?: string[]
  identifiers?: string[]
  page?: number
  order_by?: 'desc'|'asc'
}

export interface OrderParam {
  market: string
  side: 'bid'|'ask'
  volume?: number
  price: number
  ord_type: 'limit'|'price'|'market'
  identifier?: string
}

export interface CancelParam {
  uuid: string
}