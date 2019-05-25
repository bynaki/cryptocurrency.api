
/**
 * bithumb response interface
 */

export interface IBithumbTickerType {
  opening_price       : number
  closing_price       : number
  min_price           : number
  max_price           : number
  average_price       : number
  units_traded        : number
  volume_1day         : number
  volume_7day         : number
  buy_price           : number
  sell_price          : number
  '24H_fluctate'      : number
  '24H_fluctate_rate' : number
  t24H_fluctate       : number
  t24H_fluctate_rate  : number
  date                : number
}

export interface IBithumbTickerResponse {
  status: string
  data: {
    opening_price       : string
    closing_price       : string
    min_price           : string
    max_price           : string
    average_price       : string
    units_traded        : string
    volume_1day         : string
    volume_7day         : string
    buy_price           : string
    sell_price          : string
    "24H_fluctate"      : string
    "24H_fluctate_rate" : string
    date                : string
  }
  transType: () => {
    status: string
    data: IBithumbTickerType
  }
}

export interface IBithumbAllTickerResponse {
  status: string
  data: {
    [currency: string]: {
      opening_price       : string
      closing_price       : string
      min_price           : string
      max_price           : string
      average_price       : string
      units_traded        : string
      volume_1day         : string
      volume_7day         : string
      buy_price           : string
      sell_price          : string
      "24H_fluctate"      : string
      "24H_fluctate_rate" : string
      date                : string
    }
  }
  transType: () => {
    status: string
    data: {
      [currency: string]: IBithumbTickerType
    }
  }
}

export interface IBithumbOrderBookResponse {
  status    : string
  data      : {
    timestamp         : string
    order_currency    : string
    payment_currency  : string
    bids: [
      {
        quantity  : string
        price     : string
      }
    ],
    asks: [
      {
        quantity  : string
        price     : string
      }
    ]
  },
  transType: () => {
    status    : string
    data      : {
      timestamp         : number
      order_currency    : string
      payment_currency  : string
      bids: [
        {
          quantity  : number
          price     : number
        }
      ],
      asks: [
        {
          quantity  : number
          price     : number
        }
      ]
    }
  }
}

export interface IBithumbOrderBookParams {
  group_orders?: number
  count?: number
}

export interface IBithumbTransactionType {
  cont_no           : string
  transaction_date  : string
  type              : string
  units_traded      : string
  price             : string
  total             : string
}

export interface IBithumbTransactionTransType {
  cont_no           : number
  transaction_date  : string
  type              : string
  units_traded      : number
  price             : number
  total             : number
}

export interface IBithumbTransactionResponse {
  status    : string
  // message   : string
  data      : IBithumbTransactionType[]
  transType: () => {
    status    : string
    data      : IBithumbTransactionTransType[]
  }
}

export interface IBithumbTransactionParams {
  cont_no?: number
  count?: number
}

/**
 * Account Info Type
 */
export interface IBithumbAccountInfoType {
  created: string
  account_id: string
  trade_fee: number
  balance: number
}

/**
 * Account Info Response
 */
export interface IBithumbAccountInfoResponse {
  status: string
  data: {
    created: string
    account_id: string
    trade_fee: string
    balance: string
  }
  transType: () => {
    status: string
    data: IBithumbAccountInfoType
  }
}
// ---------------------------------------------------------------------



/**
 * Balance Info Type
 */
export interface IBithumbBalanceInfoType {
  currency: string
  total: number
  in_use: number
  available: number
  xcoin_last: number
}

/**
 * Balance Info Response
 */
export interface IBithumbBalanceInfoResponse {
  status: string
  data: {
    currency: string
    total: string
    in_use: string
    available: string
    xcoin_last: number
  }[]
  transType: () => {
    status: string
    data: IBithumbBalanceInfoType[]
  }
}
// -----------------------------------------------------------------------



/**
 * Wallet Address Info Type
 */
export interface IBithumbtWalletAddressInfoType {
  wallet_address: string
  currency: string
}

/**
 * Wallet Address Info Response
 */
export interface IBithumbWalletAddressInfoResponse {
  status: string
  data: IBithumbtWalletAddressInfoType
  transType: () => {
    status: string
    data: IBithumbtWalletAddressInfoType
  }
}
// --------------------------------------------------------------------



/**
 * Ticker Info Type
 */
export interface IBithumbTickerInfoType {
  opening_price: number
  closing_price: number
  min_price: number
  max_price: number
  average_price: number
  units_traded: number
  volume_1day: number
  volume_7day: number
  buy_price: number
  sell_price: number
  t24H_fluctate: number
  t24H_fluctate_rate: number
  date: number
}

/**
 * Ticker Info Response
 */
export interface IBithumbTickerInfoResponse {
  status: string
  data: {
    opening_price: string
    closing_price: string
    min_price: string
    max_price: string
    average_price: string
    units_traded: number
    volume_1day: number
    volume_7day: number
    buy_price: string
    sell_price: string
    '24H_fluctate': string
    '24H_fluctate_rate': number
    date: string
  }
  transType: () => {
    status: string
    data: IBithumbTickerInfoType
  }
}
// -------------------------------------------------------------------------



/**
 * Orders Info Params
 */
export interface IBithumbOrdersInfoParams {
  order_id?: number
  type?: string
  count?: number
  after?: number
}

/**
 * Orders Info Type
 */
export interface IBithumbOrdersInfoType {
  order_id: number
  order_currency: string
  payment_currency: string
  order_date: number
  type: string
  status: string
  units: number
  units_remaining: number
  price: number
  fee: number
  total: number
  date_completed: number
}

/**
 * Orders Info Response
 */
export interface IBithumbOrdersInfoResponse {
  status: string
  data: {
    order_id: string
    order_currency: string
    payment_currency: string
    order_date: number
    type: string
    status: string
    units: string
    units_remaining: string
    price: string
    fee: string
    total: string
    date_completed: number
  }[]
  transType: () => {
    status: string
    data: IBithumbOrdersInfoType[]
  }
}
// -------------------------------------------------------------------------


/**
 * Orders Detail Info Params
 */
export interface IBithumbOrdersDetailInfoParams {
  order_id: number
  type: string
}

/**
 * Orders Detail Info Type
 */
export interface IBithumbOrdersDetailInfoType {
  transaction_date: number
  type: string
  order_currency: string
  payment_currency: string
  units_traded: number
  price: number
  fee: number
  total: number
}

/**
 * Orders Detail Info Response
 */
export interface IBithumbOrdersDetailInfoResponse {
  status: string
  data: {
    transaction_date: string
    type: string
    order_currency: string
    payment_currency: string
    units_traded: string
    price: string
    fee: string
    total: string
  }
  transType: () => {
    status: string
    data: IBithumbOrdersDetailInfoType
  }
}
// ------------------------------------------------------------------------------



/**
 * Transactions Info Params
 */
export interface IBithumbTransactionsInfoParams {
  offset?: number
  count?: number
  searchGb?: number
}

/**
 * Transactions Info Type
 */
export interface IBithumbTransactionsInfoType {
  currency      : string
  search        : number
  transfer_date : number
  units         : number
  price         : number
  one_krw       : number
  fee           : string
  remain        : number
  krw_remain    : number
}

/**
 * Transactions Info Response
 */
export interface IBithumbTransactionsInfoResponse {
  status: string
  data: {
    currency      : string
    search        : string
    transfer_date : number
    units         : string
    price         : string
    one_krw       : string
    fee           : string
    remain        : string
    krw_remain    : string
  }[]
  transType: () => {
    status: string
    data: IBithumbTransactionsInfoType[]
  }
}
// ----------------------------------------------------------------------



/**
 * Place Params
 */
export interface IBithumbPlaceParams {
  units: number
  price: number
  type : string
}

/**
 * Trade Type
 */
export interface IBithumbTradeType {
  cont_id    : number
  units      : number
  price      : number
  total      : number
  fee        : number
}

/**
 * Trade Response
 */
export interface IBithumbTradeResponse {
  status       : string
  order_id     : string
  data: {
    cont_id    : string
    units      : string
    price      : string
    total      : number
    fee        : string
  }[]
  transType    : () => {
    status     : string
    order_id   : number
    data       : IBithumbTradeType[]
  }
}
// ----------------------------------------------------------------------



/**
 * Cancel Params
 */
export interface IBithumbCancelParams {
  order_id: number
  type    : string
}

/**
 * Cancel Response
 */
export interface IBithumbCancelResponse {
  status: string
}
// -------------------------------------------------------------------



/**
 * Withdrawal (Coin) Params
 */
export interface IBithumbWithdrawalCoinParams {
  units: number
  address?: string
  destination?: number|string
}

/**
 * Withdrawal (Coin) Response
 */
export interface IBithumbWithdrawalCoinResponse {
  status: string
}
// ---------------------------------------------------------------------



/**
 * Withdrawal (KRW) Params
 */
export interface IBithumbWithdrawalKrwParams {
  bank: string
  account: string
  price: number
}

/**
 * Withdrawal (KRW) Response
 */
export interface IBithumbWithdrawalKrwResponse {
  status: string
}
// ---------------------------------------------------------------------