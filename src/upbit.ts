import axios, {
  Method,
  AxiosError,
} from 'axios'
import * as I from './upbit.types'
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
  toNumbers,
} from './utils'
import {
  stop,
} from 'fourdollar'


function reference<T>(obj: any, ...datums: string[]): T {
  return datums.reduce((obj, d) => {
    if(!obj) {
      return obj
    }
    return obj[d]
  }, obj)
}


export class RequestError extends Error {
  readonly code: string|number
  readonly url: string
  readonly method: string
  readonly params: unknown
  readonly status: number
  readonly statusText: string

  constructor(axiosError: AxiosError) {
    const message = reference<string>(axiosError, 'response', 'data', 'error', 'message')
    if(message) {
      super(message)
    } else {
      super(axiosError.message)
    }
    const code = reference<string>(axiosError, 'response', 'data', 'error', 'name')
    if(code) {
      this.code = code
    }
    this.url = reference<string>(axiosError, 'config', 'url')
    this.method = reference<string>(axiosError, 'config', 'method')
    this.params = reference<unknown>(axiosError, 'config', 'params')
    this.status = reference<number>(axiosError, 'response', 'status')
    this.statusText = reference<string>(axiosError, 'response', 'statusText')
  }
}


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
  getCandlesMinutes(min: 1|3|5|15|10|30|60|240, params: I.CandleParam): Promise<I.Response<I.CandleMinuteType[]>> {
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
   * markets*: string 반점으로 구분되는 마켓 코드 (ex. KRW-BTC, BTC-BCC)
  **/
  getTicker(params: {
    markets: string[]
  }): Promise<I.Response<I.TickerType[]>> {
    const pp = {markets: params.markets.join(', ')}
    return this._quotation('/ticker', pp)
  }

  /**
   * 호가 정보 조회
   * https://docs.upbit.com/reference#%ED%98%B8%EA%B0%80-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C
   * markets*: array of strings 마켓 코드 목록 (ex. KRW-BTC,KRW-ADA)
  **/
  getOrderbook(params: {
    markets: string[]
  }): Promise<I.Response<I.OrderbookType[]>> {
    const pp = {markets: params.markets.join(', ')}
    return this._quotation('/orderbook', pp)
  }

  /**
   * 전체 계좌 조회
   * 내가 보유한 자산 리스트를 보여줍니다.
   * https://docs.upbit.com/reference#%EC%9E%90%EC%82%B0-%EC%A1%B0%ED%9A%8C
  **/
  async getAccounts(): Promise<I.Response<I.AccountType[]>> {
    const res = await this._exchange('/accounts', 'GET')
    res.data = toNumbers(res.data)
    return res
  }

  /**
   * 주문 가능 정보
   * https://docs.upbit.com/reference#%EC%A3%BC%EB%AC%B8-%EA%B0%80%EB%8A%A5-%EC%A0%95%EB%B3%B4
   * market *:	마켓ID	String
  **/
  async getOrdersChance(params: {
    market: string
  }): Promise<I.Response<I.OrderChanceType>> {
    const res = await this._exchange('/orders/chance', 'GET', {params})
    res.data = toNumbers(res.data)
    return res
  }

  /**
   * 개별 주문 조회
   * 주문 UUID 를 통해 개별 주문건을 조회한다.
   * https://docs.upbit.com/reference#%EA%B0%9C%EB%B3%84-%EC%A3%BC%EB%AC%B8-%EC%A1%B0%ED%9A%8C
   * uuid: 주문 UUID	String
   * identifier: 조회용 사용자 지정 값	String
  **/
  async getOrderDetail(params: I.OrderDetailParam): Promise<I.Response<I.OrderDetailType>> {
    const res =  await this._exchange('/order', 'GET', {params})
    res.data = toNumbers(res.data)
    return res
  }

  /**
   * 주문 리스트 조회
   * 주문 리스트를 조회한다.
   * https://docs.upbit.com/reference#%EC%A3%BC%EB%AC%B8-%EB%A6%AC%EC%8A%A4%ED%8A%B8-%EC%A1%B0%ED%9A%8C
   * market: 마켓 아이디 String
   * uuids: 주문 UUID의 목록 Array
   * identifiers: 주문 identifier의 목록 Array
   * state: 주문 상태 String
   *   - wait : 체결 대기 (default)
   *   - watch : 예약주문 대기
   *   - done : 전체 체결 완료
   *   - cancel : 주문 취소
   * states: 주문 상태의 목록 Array
   * * 미체결 주문(wait, watch)과 완료 주문(done, cancel)은 혼합하여 조회하실 수 없습니다.
   * page: 페이지 수, default: 1 Number
   * limit: 요청 개수, default: 100 Number
   * order_by: 정렬 방식
   *   - asc : 오름차순
   *   - desc : 내림차순 (default) String
  **/
  async getOrderList(params?: I.OrderListParam): Promise<I.Response<I.OrderType[]>> {
    const res = await this._exchange('/orders', 'GET', {params})
    res.data = toNumbers(res.data)
    return res
  }

  /**
   * 주문 취소 접수
   * 주문 UUID를 통해 해당 주문에 대한 취소 접수를 한다.
   * https://docs.upbit.com/reference#주문-취소
   * uuid:	취소할 주문의 UUID	String
   * identifier:	조회용 사용자 지정값	String
  **/
  async cancel(params: I.CancelParam): Promise<I.Response<I.OrderType>> {
    const res = await this._exchange('/order', 'DELETE', {params})
    res.data = toNumbers(res.data)
    return res
  }

  /**
   * 주문하기
   * 주문 요청을 한다. 
   * https://docs.upbit.com/reference#%EC%A3%BC%EB%AC%B8%ED%95%98%EA%B8%B0
   * market *	마켓 ID (필수)	String
   * side *	주문 종류 (필수)
   *   - bid : 매수
   *   - ask : 매도	String
   * volume *	주문량 (지정가, 시장가 매도 시 필수)	NumberString
   * price *	주문 가격. (지정가, 시장가 매수 시 필수)
   *   ex) KRW-BTC 마켓에서 1BTC당 1,000 KRW로 거래할 경우, 값은 1000 이 된다.
   *   ex) KRW-BTC 마켓에서 1BTC당 매도 1호가가 500 KRW 인 경우, 시장가 매수 시 값을 1000으로 세팅하면 2BTC가 매수된다.
   *   (수수료가 존재하거나 매도 1호가의 수량에 따라 상이할 수 있음)	NumberString
   * ord_type *	주문 타입 (필수)
   *   - limit : 지정가 주문
   *   - price : 시장가 주문(매수)
   *   - market : 시장가 주문(매도)	String
   * identifier	조회용 사용자 지정값 (선택)	String (Uniq 값 사용)
   * --
   * 원화 마켓 가격 단위를 확인하세요.
   * 원화 마켓에서 주문을 요청 할 경우, 원화 마켓 주문 가격 단위 를 확인하여 값을 입력해주세요.
   * --
   * identifier 파라미터 사용
   * identifier는 서비스에서 발급하는 uuid가 아닌 이용자가 직접 발급하는 키값으로, 주문을 조회하기 위해 할당하는 값입니다. 해당 값은 사용자의 전체 주문 내 유일한 값을 전달해야하며, 비록 주문 요청시 오류가 발생하더라도 같은 값으로 다시 요청을 보낼 수 없습니다.
   * 주문의 성공 / 실패 여부와 관계없이 중복해서 들어온 identifier 값에서는 중복 오류가 발생하니, 매 요청시 새로운 값을 생성해주세요.
   * --
   * 시장가 주문
   * 시장가 주문은 ord_type 필드를 price or market 으로 설정해야됩니다.
   * 매수 주문의 경우 ord_type을 price로 설정하고 volume을 null 혹은 제외해야됩니다.
   * 매도 주문의 경우 ord_type을 market로 설정하고 price을 null 혹은 제외해야됩니다.
  **/
  async order(params: I.OrderLimitParam | I.OrderPriceParam | I.OrderMarketParam): Promise<I.Response<I.OrderExType>> {
    const res = await this._exchange('/orders', 'POST', {params})
    res.data = toNumbers(res.data)
    return res
  }

  private async _quotation(endPoint: string, params?: any): Promise<I.Response<any>> {
    try {
      const res = await axios({method: 'GET', url: `${this._url}${endPoint}`, params})
      return {
        status: res.status,
        remainingReq: this._extractRemainingReq(res.headers),
        data: res.data,
      }
    } catch(e) {
      if(e.isAxiosError) {
        const err = new RequestError(e)
        if(err.status === 429) {
          await stop(100)
          return this._quotation(endPoint, params)
        } else {
          throw err
        }
      } else {
        throw e
      }
    }
  }

  private async _exchange(endPoint: string, method: Method, {params, data}: {
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
        if(Array.isArray(params[key])) {
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
    try {
      const res = await axios({
        method,
        url: `${this._url}${endPoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: pp,
        //data: params,
      })
      return {
        status: res.status,
        remainingReq: this._extractRemainingReq(res.headers),
        data: res.data,
      }
    } catch(e) {
      if(e.isAxiosError) {
        const err = new RequestError(e)
        if(err.status === 429) {
          await stop(100)
          return this._exchange(endPoint, method, {params, data})
        } else {
          throw err
        }
      } else {
        throw e
      }
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

