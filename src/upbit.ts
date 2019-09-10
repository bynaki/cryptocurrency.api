import axios from 'axios'
import * as I from './upbit.interface'
import {
  v4 as uuidv4,
} from 'uuid'
import {
  sign,
} from 'jsonwebtoken'
import * as crypto from 'crypto'
import {
  stringify
} from 'querystring'
import {
  isArray,
} from 'util'



export class UPbit {
  private _url: string = 'https://api.upbit.com/v1'
  private _opts: {
    accessKey: string
    secretKey: string
  }

  constructor(options: {
    accessKey: string
    secretKey: string
  }) {
    this._opts = Object.assign({}, options)
  }

  getMarket(): Promise<I.Response<I.MarketType[]>> {
    return this._quotation('/market/all')
  }

  getCandlesMinutes(min: number, params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleMinuteType[]>> {
    return this._quotation(`/candles/minutes/${min}`, params)
  }

  getCandlesDays(params: {
    market: string
    to?: string
    count?: number
    convertingPriceUnit?: string
  }): Promise<I.Response<I.CandleDayType[]>> {
    return this._quotation('/candles/days', params)
  }

  getCandlesWeeks(params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleWeekType[]>> {
    return this._quotation('/candles/weeks', params)
  }

  getCandlesMonths(params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleMonthType[]>> {
    return this._quotation('/candles/months', params)
  }

  getTradesTicks(params: {
    market: string
    to?: string
    count?: number
    cursor?: string
  }): Promise<I.Response<I.TradeTickType[]>> {
    return this._quotation('/trades/ticks', params)
  }

  getTicker(params: {
    markets: string
  }): Promise<I.Response<I.TickerType[]>> {
    return this._quotation('/ticker', params)
  }

  getOrderbook(params: {
    markets: string
  }): Promise<I.Response<I.OrderbookType[]>> {
    return this._quotation('/orderbook', params)
  }

  getAccounts(): Promise<I.Response<I.AccountType[]>> {
    return this._exchange('/accounts', 'GET')
  }

  getOrdersChance(params: {
    market: string
  }): Promise<I.Response<I.OrderChanceType>> {
    return this._exchange('/orders/chance', 'GET', {params})
  }

  getOrder(params: {
    uuid: string
    identifier?: string
  }): Promise<I.Response<I.OrderDetailType>> {
    return this._exchange('/order', 'GET', {params})
  }

  getOrderList(params: {
    market: string
    state?: string
    uuids?: string[]
    identifiers?: string[]
    page?: number
    order_by?: 'desc'|'asc'
  }): Promise<I.Response<I.OrderType[]>> {
    return this._exchange('/orders', 'GET', {params})
  }

  cancel(params: {
    uuid: string
  }): Promise<I.Response<I.OrderType>> {
    return this._exchange('/order', 'DELETE', {params})
  }

  order(params: {
    market: string
    side: 'bid'|'ask'
    volume?: number
    price: number
    ord_type: 'limit'|'price'|'market'
    identifier?: string
  }): Promise<I.Response<I.OrderExType>> {
    return this._exchange('/orders', 'POST', {data: params})
  }

  private async _quotation(endPoint: string, params?: any): Promise<I.Response<any>> {
    const res = await axios({method: 'GET', url: `${this._url}${endPoint}`, params})
    return {
      status: res.status,
      remainingReq: this._extractRemainingReq(res.headers),
      data: res.data,
    }
  }

  private async _exchange(endPoint: string, method: string, {params, data}: {
    params?: any
    data?: any
  } = {}): Promise<I.Response<any>> {
    const payload = {
      access_key: this._opts.accessKey,
      nonce: uuidv4(),
    }
    let pp: any 
    if(params) {
      pp = {}
      for(let key in params) {
        if(isArray(params[key])) {
          pp[`${key}[]`] = params[key]
        } else {
          pp[key] = params[key]
        }
      }
      const query = stringify(pp)
      const hash = crypto.createHash('sha512')
      const queryHash = hash.update(query, 'utf8').digest('hex')
      Object.assign(payload, {
        query_hash: queryHash,
        query_hash_alg: 'SHA512',
      })
    }
    const token = sign(payload, this._opts.secretKey)
    const res = await axios({
      method,
      url: `${this._url}${endPoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: pp,
      data,
    })
    return {
      status: res.status,
      remainingReq: this._extractRemainingReq(res.headers),
      data: res.data,
    }
  }

  private _extractRemainingReq(headers: any) {
    return headers['remaining-req'].split(';').map(a => a.trim())
    .reduce((o, a) => {
      const c = a.split('=')
      o[c[0]] = isNaN(parseInt(c[1]))? c[1] : parseInt(c[1])
      return o
    }, {})
  }
}