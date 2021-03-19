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


/**
 * UPbit
**/
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

  /**
   * 마켓 코드 조회
   * 업비트에서 거래 가능한 마켓 목록
   * https://docs.upbit.com/reference#%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C
   * isDetails: 유의종목 필드과 같은 상세 정보 노출 여부(선택 파라미터)
  **/
  getMarket(isDetails: boolean = false): Promise<I.Response<I.MarketType[]>> {
    return this._quotation('/market/all', {isDetails})
  }

  /**
   * 분(Minute) 캔들
   * https://docs.upbit.com/reference#%EB%B6%84minute-%EC%BA%94%EB%93%A4-1
   * min: 분 단위. 가능한 값 : 1, 3, 5, 15, 10, 30, 60, 240 (필수)
   * CandleParam.market: 마켓 코드 (ex. KRW-BTC) (필수)
   * CandleParam.to: 마지막 캔들 시각 (exclusive). 포맷 : yyyy-MM-dd'T'HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss. 비워서 요청시 가장 최근 캔들
   * CandleParam.cout: 캔들 개수(최대 200개까지 요청 가능)
  **/
  getCandlesMinutes(min: number, params: I.CandleParam): Promise<I.Response<I.CandleMinuteType[]>> {
    return this._quotation(`/candles/minutes/${min}`, params)
  }

  /**
   * 일(Day) 캔들
   * https://docs.upbit.com/reference#%EC%9D%BCday-%EC%BA%94%EB%93%A4-1
   * CandleParamEx.market: 마켓 코드 (ex. KRW-BTC, BTC-BCC) (필수)
   * CandleParamEx.to: 마지막 캔들 시각 (exclusive). 포맷 : yyyy-MM-dd'T'HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss. 비워서 요청시 가장 최근 캔들
   * CandleParamEx.count: 캔들 개수
   * CandleParamEx.convertingPriceUnit: 종가 환산 화폐 단위 (생략 가능, KRW로 명시할 시 원화 환산 가격을 반환.)
  **/
  getCandlesDays(params: I.CandleParamEx): Promise<I.Response<I.CandleDayType[]>> {
    return this._quotation('/candles/days', params)
  }

  /**
   * 주(Week) 캔들
   * https://docs.upbit.com/reference#%EC%A3%BCweek-%EC%BA%94%EB%93%A4-1
   * CandleParam.market: string 마켓 코드 (ex. KRW-BTC, BTC-BCC) (필수)
   * CandleParam.to: string 마지막 캔들 시각 (exclusive). 포맷 : yyyy-MM-dd'T'HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss. 비워서 요청시 가장 최근 캔들
   * CandleParam.count: int32 캔들 개수
  **/
  getCandlesWeeks(params: I.CandleParam): Promise<I.Response<I.CandleWeekType[]>> {
    return this._quotation('/candles/weeks', params)
  }

  /**
   * 월(Month) 캔들
   * https://docs.upbit.com/reference#%EC%9B%94month-%EC%BA%94%EB%93%A4-1
   * CandleParam.market: string 마켓 코드 (ex. KRW-BTC, BTC-BCC) (필수)
   * CandleParam.to: string 마지막 캔들 시각 (exclusive). 포맷 : yyyy-MM-dd'T'HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss. 비워서 요청시 가장 최근 캔들
   * CandleParam.count: int32 캔들 개수
  **/
  getCandlesMonths(params: I.CandleParam): Promise<I.Response<I.CandleMonthType[]>> {
    return this._quotation('/candles/months', params)
  }

  /**
   * 최근 체결 내역
   * https://docs.upbit.com/reference#%EC%B5%9C%EA%B7%BC-%EC%B2%B4%EA%B2%B0-%EB%82%B4%EC%97%AD
   * TradeTickParam.market*: string 마켓 코드 (ex. KRW-BTC, BTC-BCC)
   * TradeTickParam.to: string 마지막 체결 시각. 형식 : [HHmmss 또는 HH:mm:ss]. 비워서 요청시 가장 최근 데이터
   * TradeTickParam.count: int32 체결 개수
   * TradeTickParam.cursor: string 페이지네이션 커서 (sequentialId)
   * TradeTickParam.daysAgo: int32 최근 체결 날짜 기준 7일 이내의 이전 데이터 조회 가능. 비워서 요청 시 가장 최근 체결 날짜 반환. (범위: 1 ~ 7))
  **/
  getTradesTicks(params: I.TradeTickParam): Promise<I.Response<I.TradeTickType[]>> {
    return this._quotation('/trades/ticks', params)
  }

  /**
   * 현재가 정보
   * 요청 당시 종목의 스냅샷을 반환한다.
   * https://docs.upbit.com/reference#ticker%ED%98%84%EC%9E%AC%EA%B0%80-%EB%82%B4%EC%97%AD
   * market*: string 마켓 코드 (ex. KRW-BTC, BTC-BCC)
  **/
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

  /**
   * 전체 계좌 조회
   * 내가 보유한 자산 리스트를 보여줍니다.
   * https://docs.upbit.com/reference#%EC%9E%90%EC%82%B0-%EC%A1%B0%ED%9A%8C
  **/
  getAccounts(): Promise<I.Response<I.AccountType[]>> {
    return this._exchange('/accounts', 'GET')
  }

  getOrdersChance(params: {
    market: string
  }): Promise<I.Response<I.OrderChanceType>> {
    return this._exchange('/orders/chance', 'GET', {params})
  }

  getOrderDetail(params: I.OrderDetailParam): Promise<I.Response<I.OrderDetailType>> {
    return this._exchange('/order', 'GET', {params})
  }

  getOrderList(params: I.OrderListParam): Promise<I.Response<I.OrderType[]>> {
    return this._exchange('/orders', 'GET', {params})
  }

  cancel(params: I.CancelParam): Promise<I.Response<I.OrderType>> {
    return this._exchange('/order', 'DELETE', {params})
  }

  order(params: I.OrderParam): Promise<I.Response<I.OrderExType>> {
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
