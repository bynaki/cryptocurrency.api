import axios from 'axios'
import * as I from './upbit.interface'


export class UPbit {
  private _url: string = 'https://api.upbit.com/v1'
  private _opts: {
    accessKey: string
    secretKey: string
  } = null

  constructor(options: {
    accessKey: string
    secretKey: string
  }) {
    this._opts = Object.assign({}, options)
  }

  market(): Promise<I.Response<I.MarketType[]>> {
    return this._quotation('/market/all')
  }

  candlesMinutes(min: number, params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleMinuteType[]>> {
    return this._quotation(`/candles/minutes/${min}`, params)
  }

  candlesDays(params: {
    market: string
    to?: string
    count?: number
    convertingPriceUnit?: string
  }): Promise<I.Response<I.CandleDayType[]>> {
    return this._quotation('/candles/days', params)
  }

  candlesWeeks(params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleWeekType[]>> {
    return this._quotation('/candles/weeks', params)
  }

  candlesMonths(params: {
    market: string
    to?: string
    count?: number
  }): Promise<I.Response<I.CandleMonthType[]>> {
    return this._quotation('/candles/months', params)
  }

  tradesTicks(params: {
    market: string
    to?: string
    count?: number
    cursor?: string
  }): Promise<I.Response<I.TradeTickType[]>> {
    return this._quotation('/trades/ticks', params)
  }

  ticker(params: {
    markets: string
  }): Promise<I.Response<I.TickerType[]>> {
    return this._quotation('/ticker', params)
  }

  orderbook(params: {
    markets: string
  }): Promise<I.Response<I.OrderbookType[]>> {
    return this._quotation('/orderbook', params)
  }

  private async _quotation(endPoint: string, params?: any): Promise<I.Response<any>> {
    const res = await axios({method: 'GET', url: `${this._url}${endPoint}`, params})
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