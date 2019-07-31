import * as binance from 'node-binance-api'
import * as I from './binance.interface'
import {
  clone,
} from 'lodash'
import isInteger from 'fourdollar.isinteger'
import isFloat from 'fourdollar.isfloat'



export class Binance {
  public websockets: BinanceWebsocket
  private _b = null

  constructor(options: {
    APIKEY: string,
    APISECRET: string,
    useSeverTime?: boolean,
    reconnect?: boolean,
  }) {
    this._b = binance().options(options)
    this.websockets = new BinanceWebsocket(this._b.websockets)
  }

  async prices(): Promise<I.PriceTickerAllResponse>
  async prices(symbol: string): Promise<I.PriceTickerResponse>
  async prices(symbol?: string): Promise<I.PriceTickerResponse|I.PriceTickerAllResponse> {
    return new Promise((resolve, reject) => {
      this._b.prices(symbol, (err, res) => {
        if(err) {
          reject(err)
          return
        }
        const rs: I.PriceTickerType[] = []
        for(let r in res) {
          rs.push({
            symbol: r,
            price: res[r],
          })
        }
        if(rs.length == 1) {
          resolve(this._bindTransType({
            data: rs[0],
          }))
        } else {
          resolve(this._bindTransType({
            data: rs,
          }))
        }
      })
    })
  }

  candlesticks(symbol: string, interval: string, options: I.CandleStickOptions)
  : Promise<I.CandleStickResponse> {
    return new Promise((resolve, reject) => {
      this._b.candlesticks(symbol, interval, (err, ticks, symbol) => {
        if(err) {
          reject(err)
          return
        }
        const data = ticks.map(t => {
          const [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = t
          return {
            time,
            open,
            high,
            low,
            close,
            volume,
            closeTime,
            assetVolume,
            trades,
            buyBaseVolume,
            buyAssetVolume,
            ignored,
          }
        })
        resolve(this._bindTransType({
          data,
        }))
      }, options)
    })
  }

  private _bindTransType(res: any) {
    res.transType = transType.bind(res)
    return res
  }
}



class BinanceWebsocket {
  constructor(private readonly _ws) {
  }

  candlesticks(symbol: string[]|string, interval: string, callback: (candlesticks: I.WsCandleStickResponse) => void): void {
    return this._ws.candlesticks(symbol, interval, (candlesticks) => {
      const {
        e: eventType,
        E: eventTime,
        s: symbol,
        k: data,
      } = candlesticks
      const {
        t: startTime,
        T: endTime,
        i: interval,
        f: firstTradeID,
        L: lastTradeID,
        o: open,
        h: high,
        l: low,
        c: close,
        v: volume,
        n: trades,
        x: isFinal,
        q: quoteVolume,
        V: buyVolume,
        Q: quoteBuyVolume,
        B: ignore,
      } = data
      return callback(this._bindTransType({
        eventType,
        eventTime,
        symbol,
        data: {
          startTime,
          endTime,
          symbol,
          interval,
          firstTradeID,
          lastTradeID,
          open,
          close,
          high,
          low,
          volume,
          trades,
          isFinal,
          quoteVolume,
          buyVolume,
          quoteBuyVolume,
          ignore,
        }
      }))
    })
  }

  terminate(id: string) {
    return this._ws.terminate(id)
  }

  private _bindTransType(res: any) {
    res.transType = transType.bind(res)
    return res
  }
}


/**
 * bithumb에서 받은 데이터의 숫자형 데이터를 number형으로 변환
 * @param data bithumb에서 받은 데이터
 */
function transType(data) {
  if(!data) {
    data = this
  }
  let cpData = clone(data)
  cpData && cpData.transType && delete cpData.transType
  if(cpData) {
    for(let key in cpData) {
      if(cpData[key] !== null && cpData[key] !== undefined) {
        if(typeof cpData[key] === 'object') {
          cpData[key] = transType(cpData[key])
        } else {
          if(isInteger(cpData[key])) {
            cpData[key] = parseInt(cpData[key])
          } else if(isFloat(cpData[key])) {
            cpData[key] = parseFloat(cpData[key])
          }
        }
      }
    }
  }
  return cpData
}