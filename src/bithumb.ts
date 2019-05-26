/**
 * Bithumb API
 * https://github.com/Coac/bithumb.js 참고
 */

import * as crypto from 'crypto'
import * as querystring from 'querystring'
import {
  clone,
} from 'lodash'
import isInteger from 'fourdollar.isinteger'
import isFloat from 'fourdollar.isfloat'
import toStringQuery from 'fourdollar.tostringquery'
import {
  IBithumbAllTickerResponse as IAllTickerResponse,
  IBithumbTickerResponse as ITickerResponse,
  IBithumbOrderBookParams as IOrderBookParams,
  IBithumbOrderBookResponse as IOrderBookResponse,
  IBithumbTransactionParams as ITransactionParams,
  IBithumbTransactionResponse as ITransactionResponse,
  IBithumbAccountInfoResponse as IAccountInfoResponse,
  IBithumbBalanceInfoResponse as IBalanceInfoResponse,
  IBithumbWalletAddressInfoResponse as IWalletAddressInfoResponse,
  IBithumbTickerInfoResponse as ITickerInfoResponse,
  IBithumbOrdersInfoResponse as IOrdersInfoResponse,
  IBithumbOrdersDetailInfoResponse as IOrdersDetailInfoResponse,
  IBithumbTransactionsInfoResponse as ITransactionsInfoResponse,
  IBithumbTransactionsInfoParams as ITransactionsInfoParams,
  IBithumbOrdersDetailInfoParams as IOrdersDetailInfoParams,
  IBithumbOrdersInfoParams as IOrdersInfoParams,
  IBithumbPlaceParams as IPlaceParams,
  IBithumbTradeResponse as ITradeResponse,
  IBithumbCancelParams as ICancelParams,
  IBithumbCancelResponse as ICancelResponse,
  IBithumbWithdrawalCoinParams as IWithdrawalCoinParams,
  IBithumbWithdrawalCoinResponse as IWithdrawalCoinResponse,
  IBithumbWithdrawalKrwParams as IWithdrawalKrwParams,
  IBithumbWithdrawalKrwResponse as IWithdrawalKrwResponse,
} from './bithumb.interface'
import axios from 'axios'



/**
 * Bithumb API
 */
export class Bithumb {
  public apiUrl = 'https://api.bithumb.com'
  private _connectKey: string
  private _secretKey: string

  constructor({connectKey, secretKey}
    : {connectKey: string, secretKey: string} = {connectKey: '', secretKey: ''}) {
    this._connectKey = connectKey
    this._secretKey = secretKey
  }

  // Public API
  //

  /**
   * 요청 당시 빗썸 거래소 암호화폐 현재가 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/ticker
   * 
   * GET https://api.bithumb.com/public/ticker/{currency}
   * 
   * @param currency 빗썸 거래 가능 코인, ALL(전체), 기본값 BTC
   */
  async getTicker(currency: 'ALL'): Promise<IAllTickerResponse>
  async getTicker(currency: string): Promise<ITickerResponse>
  async getTicker(currency: string): Promise<ITickerResponse|IAllTickerResponse> {
    const res = await this._publicRequest(`/public/ticker/${currency}`)
    if(res.status === '0000') {
      if(currency === 'ALL') {
        const rr: IAllTickerResponse = res
        Object.keys(rr.data).forEach(cc => {
          if(cc !== 'date') {
            rr.data[cc].date = rr.data.date as any
          }
          rr.data[cc]['t24H_fluctate'] = rr.data[cc]['24H_fluctate']
          rr.data[cc]['t24H_fluctate_rate'] = rr.data[cc]['24H_fluctate_rate']
        })
        delete res.data['date']
      } else {
        const rr: ITickerResponse = res
        rr.data['t24H_fluctate'] = rr.data['24H_fluctate']
        rr.data['t24H_fluctate_rate'] = rr.data['24H_fluctate_rate']
      }
    }
    return this._bindTransType(res)
  }

  /**
   * 요청 당시 빗썸 거래소 암호화폐 현재가 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/orderBook
   * 
   * GET https://api.bithumb.com/public/orderbook/{currency}
   * 
   * @param currency 빗썸 거래 가능 코인, ALL(전체), 기본값 BTC
   * @param params {
   *  group_orders: (0 : 주문 전체, 1: 호가 별 코인 개수 (빗썸 호가창과 동일), 기본값: 1 Integer)
   *  count: (1~50 (코인별), 1~5 (ALL), 기본값 : 5 Integer)
   * }
   **/
  async getOrderbook(currency: string, params?: IOrderBookParams)
    : Promise<IOrderBookResponse> {
    const res = await this._publicRequest(`/public/orderbook/${currency}`, params)
    return this._bindTransType(res)
  }

  /**
   * 빗썸 거래소 암호화폐 거래 체결 완료 내역을 제공합니다.
   * https://apidocs.bithumb.com/docs/transactionHistory
   * 
   * GET https://api.bithumb.com/public/transaction_history/{currency}
   * 
   * @param currency 빗썸 거래 가능 코인, 기본값 BTC
   * @param params {
   *  cont_no: 체결 번호 (입력 시 해당 체결 번호 이전의 데이터 추출 )
   *  count: 1~100 (기본값 : 20)
   * }
   */
  async getTransactionHistory(currency: string, params?: ITransactionParams)
    : Promise<ITransactionResponse> {
    return this._bindTransType(
      await this._publicRequest(`/public/transaction_history/${currency}`, params))
  }

  /**
   * 회원 정보 및 코인 거래 수수료 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/account
   * 
   * POST https://api.bithumb.com/info/account
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   */
  async getAccountInfo(currency: string): Promise<IAccountInfoResponse> {
    const params = {
      order_currency: currency,
      payment_currency: 'KRW',
    }
    return this._bindTransType(
      await this._privateRequest('/info/account', params)
    )
  }

  /**
   * 회원이 보유한 자산 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/balance
   * 
   * POST https://api.bithumb.com/info/balance
   * 
   * @param currency 암호화폐 영문 코드, ALL(전체), 기본값 : BTC
   */
  async getBalanceInfo(currency?: string): Promise<IBalanceInfoResponse> {
    const res = await this._privateRequest('/info/balance', {currency})
    if(res.status === '0000') {
      const data = res.data
      const rr: {
        status: string
        data: {
          currency: string
          total: string
          in_use: string
          available: string
          xcoin_last: number
        }[]
      } = {
        status: res.status,
        data: []
      }
      const p = /^total_(\w+)$/
      Object.keys(data).filter(key => key.search(p) === 0).forEach(key => {
        const currency = key.match(p)[1]
        rr.data.push({
          currency: currency.toUpperCase(),
          total: data[`total_${currency}`],
          in_use: data[`in_use_${currency}`],
          available: data[`available_${currency}`],
          xcoin_last: (currency === 'krw')? null : data[`xcoin_last`] || data[`xcoin_last_${currency}`],
        })
      })
      return this._bindTransType(rr)
    }
    return res
  }

  /**
   * 회원의 코인 입금 지갑 주소를 제공합니다.
   * https://apidocs.bithumb.com/docs/walletAddress
   * 
   * POST https://api.bithumb.com/info/wallet_address
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   */
  async getWalletAddressInfo(currency: string): Promise<IWalletAddressInfoResponse> {
    return this._bindTransType(
      await this._privateRequest('/info/wallet_address', {currency})
    )
  }

  /**
   * 회원의 암호화폐 거래 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/tickerUser
   * 
   * POST https://api.bithumb.com/info/ticker
   * 
   * @param orderCurrency 암호화폐 영문 코드, 기본값 : BTC
   * @param paymentCurrency 원화 (KRW)
   */
  async getTickerInfo(orderCurrency: string, paymentCurrency: string)
    : Promise<ITickerInfoResponse> {
    const res = await this._privateRequest('/info/ticker', {
      order_currency: orderCurrency,
      payment_currency: paymentCurrency,
    })
    if(res.status === '0000') {
      res.data.t24H_fluctate = res.data['24H_fluctate']
      res.data.t24H_fluctate_rate = res.data['24H_fluctate_rate']
    }
    return this._bindTransType(res)
  }

  /**
   * 회원의 매수/매도 등록 대기 또는 거래 중 내역 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/orders
   * 
   * POST https://api.bithumb.com/info/orders
   * 
   * @param order_id 매수/매도 주문 등록된 주문번호, (입력 시 해당 데이터만 추출)
   * @param type 거래유형, (bid : 매수 ask : 매도)
   * @param count 1~1000, (기본값 : 100) 
   * @param after 입력한 시간보다 나중의 데이터 추출, YYYY-MM-DD hh:mm:ss 의 UNIX Timestamp, (2014-11-28 16:40:01 = 1417160401000)
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   */
  async getOrdersInfo(currency: string, params?: IOrdersInfoParams)
  : Promise<IOrdersInfoResponse> {
    return this._bindTransType(
      await this._privateRequest('/info/orders', Object.assign({currency}, params)))
  }

  /**
   * 회원의 매수/매도 체결 내역 상세 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/ordersDetail
   * 
   * POST https://api.bithumb.com/info/order_detail
   * 
   * @param order_id 매수/매도 주문 등록된 주문번호, (입력 시 해당 데이터만 추출)
   * @param type 거래유형, (bid : 매수 ask : 매도)
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   */
  async getOrdersDetailInfo(currency: string, params: IOrdersDetailInfoParams)
  : Promise<IOrdersDetailInfoResponse> {
    return this._bindTransType(
      await this._privateRequest('/info/order_detail', Object.assign({currency}, params)))
  }

  /**
   * 회원의 거래 완료 내역 정보를 제공합니다.
   * https://apidocs.bithumb.com/docs/transactions
   * 
   * POST https://api.bithumb.com/info/user_transactions
   * 
   * @param offset 0~, (기본값 : 0)
   * @param count 1~50, (기본값 : 20)	
   * @param searchGb 0 : 전체, 1 : 매수 완료, 2 : 매도 완료, 3 : 출금 중, 4 : 입금, 5 : 출금, 9 : KRW 입금 중
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   */
  async getTransactionsInfo(currency: string, params?: ITransactionsInfoParams)
  : Promise<ITransactionsInfoResponse> {
    const res = await this._privateRequest('/info/user_transactions', Object.assign({currency}, params))
    if(res.status === '0000') {
      const data: {}[] = res.data
      const oneKrwPattern = /^(\w+)1krw$/
      const remainPattern = /^(\w+)_remain$/
      data.forEach(t => {
        Object.keys(t).forEach(key => {
          if(key.match(oneKrwPattern)) {
            t['currency'] = key.match(oneKrwPattern)[1].toUpperCase()
            t['one_krw'] = t[key]
          } else if(key.match(remainPattern)) {
            const matched = key.match(remainPattern)
            if(matched[1] !== 'krw') {
              t['currency'] = matched[1].toUpperCase()
              t['remain'] = t[key]
            }
          }
        })
      })
    }
    return this._bindTransType(res)
  }

  /**
   * 지정가 매수/매도 등록 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/place
   * 
   * POST https://api.bithumb.com/trade/place
   * 
   * @param orderCurrency 암호화폐 영문 코드, 기본값 : BTC
   * @param paymentCurrency 원화 (KRW)
   * @param units 주문 수량
   * @param price Currency 거래가 
   * @param type 거래유형, (bid : 매수 ask : 매도)
   */
  async place(orderCurrency: string, paymentCurrency: string, params: IPlaceParams)
  : Promise<ITradeResponse> {
    return this._bindTransType(await this._privateRequest('/trade/place', Object.assign({
      order_currency: orderCurrency,
      payment_currency: paymentCurrency,
    }, params)))
  }

  /**
   * 등록된 매수/매도 주문 취소 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/cancel
   * 
   * POST https://api.bithumb.com/trade/cancel
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   * @param order_id 매수/매도 주문 등록된 주문번호
   * @param type 거래유형, (bid : 매수 ask : 매도)	 
   */
  async cancel(currency: string, params: ICancelParams)
  : Promise<ICancelResponse> {
    return this._privateRequest('/trade/cancel', Object.assign({currency}, params))
  }

  /**
   * 시장가 매수 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/marketBuy
   * 
   * POST https://api.bithumb.com/trade/market_buy
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   * @param units 코인 매수 수량, [최대 주문 금액] 1억 원
   */
  async marketBuy(currency: string, units: number)
  : Promise<ITradeResponse> {
    return this._bindTransType(
      await this._privateRequest('/trade/market_buy', {currency, units}))
  }

  /**
   * 시장가 매도 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/marketSell
   * 
   * POST https://api.bithumb.com/trade/market_sell
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   * @param units 코인 매도 수량, [최대 주문 금액] 1억 원
   */
  async marketSell(currency: string, units: number)
  : Promise<ITradeResponse> {
    return this._bindTransType(
      await this._privateRequest('/trade/market_sell', {currency, units}))
  }

  /**
   * 암호화폐 출금 신청 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/withdrawalCoin
   * 
   * @param currency 암호화폐 영문 코드, 기본값 : BTC
   * @param units 출금하고자 하는 코인 수량, [코인 별 1회 최대 수량] 회원 등급 별 출금 가능 수량
   * @param address 코인 별 출금 주소
   * @param destination XRP 출금 시 Destination Tag
   */
  async withdrawalCoin(currency: string, params: IWithdrawalCoinParams)
  : Promise<IWithdrawalCoinResponse> {
    return this._privateRequest('/trade/btc_withdrawal', Object.assign({currency}, params))
  }

  /**
   * 원화(KRW) 출금 신청 기능을 제공합니다.
   * https://apidocs.bithumb.com/docs/withdrawalKrw
   * 
   * POST https://api.bithumb.com/trade/btc_withdrawal
   * 
   * @param bank [은행코드_은행명], 011_농협은행
   * @param account	출금 계좌번호
   * @param price	출금 KRW 금액	
   */
  async withdrawalKrw(params: IWithdrawalKrwParams)
  : Promise<IWithdrawalKrwResponse> {
    return this._privateRequest('/trade/krw_withdrawal', Object.assign({}, params))
  }

  private async _publicRequest(endPoint: string, params?: any) {
    const parameters = querystring.stringify(params)
    const res = await axios.get(`${this.apiUrl}${endPoint}?${parameters}`)
    return res.data
  }

  private async _privateRequest(endPoint: string, params) {
    const queries = querystring.stringify(Object.assign({endPoint}, params))
    const nonce = this._nonce()
    const requestSignature = endPoint + String.fromCharCode(0) + queries + String.fromCharCode(0) + nonce
    const hmacSignature = Buffer.from(crypto.createHmac('sha512', this._secretKey).update(requestSignature).digest('hex')).toString('base64')
    const res = await axios.post(`${this.apiUrl}${endPoint}`, queries, {
      headers: {
        'Api-Key': this._connectKey,
        'Api-Sign': hmacSignature,
        'Api-Nonce': nonce,
      },
    })
    return res.data
  }

  private _nonce() {
    // let now = new Date().getTime() / 1000
    // // let now = global['now'] / 1000
    // const sec = parseInt(now.toString(), 10)
    // const usec = (Math.round((now - sec) * 1000) / 1000).toString().substr(2, 3)
    // return Number(String(sec) + String(usec))
    return new Date().getTime()
  }

  private _bindTransType(res: any) {
    res.transType = transType.bind(res)
    return res
  }

  private _parameter(endpoint: string, params: object = null): string {
    let parameter = endpoint
    if(params && toStringQuery(params) !== '') {
      parameter += toStringQuery(params)
    }
    return parameter
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
      if(key !== 'status' && cpData[key] !== null && cpData[key] !== undefined) {
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


/**
 * Crypto Currency: BTC, ETH, DASH, LTC, ETC, XRP, BCH, XMR, ZEC, QTUM, BTG, EOS, ICX, VEN, TRX, ELF, MITH, MCO, OMG, KNC, GNT, HSR, ZIL, ETHOS, PAY, WAX, POWR, LRC, GTO, STEEM, STRAT, ZRX, REP
 */
// export const CC = {
//   get ALL() { return 'ALL' },
//   get BTC() { return 'BTC' },
//   get ETH() { return 'ETH' },
//   get DASH() { return 'DASH' },
//   get LTC() { return 'LTC' },
//   get ETC() { return 'ETC' },
//   get XRP() { return 'XRP' },
//   get BCH() { return 'BCH' },
//   get XMR() { return 'XMR' },
//   get ZEC() { return 'ZEC' },
//   get QTUM() { return 'QTUM' },
//   get BTG() { return 'BTG' },
//   get EOS() { return 'EOS' },
//   get ICX() { return 'ICX' },
//   get VEN() { return 'VEN' },
//   get TRX() { return 'TRX' },
//   get ELF() { return 'ELF' },
//   get MITH() { return 'MITH' },
//   get MCO() { return 'MCO' },
//   get OMG() { return 'OMG' },
//   get KNC() { return 'KNC' },
//   get GNT() { return 'GNT' },
//   get HSR() { return 'HSR' },
//   get ZIL() { return 'ZIL' },
//   get ETHOS() { return 'ETHOS' },
//   get PAY() { return 'PAY' },
//   get WAX() { return 'WAX' },
//   get POWR() { return 'POWR' },
//   get LRC() { return 'LRC' },
//   get GTO() { return 'GTO' },
//   get STEEM() { return 'STEEM'},
//   get STRAT() { return 'STRAT'},
//   get ZRX() { return 'ZRX' },
//   get REP() { return 'REP' },
// }
