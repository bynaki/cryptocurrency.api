import test from 'ava'
import axios, {
  AxiosError,
  Method,
} from 'axios'


interface MarketType {
  // market 업비트에서 제공중인 시장 정보. String
  market: string
  korean_name: string
  english_name: string
}

test.only('마켓 코드 조회', async t => {
  const config = {
    method: 'GET',
    url: 'https://api.upbit.com/v1/market/all',
  }
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://api.upbit.com/v1/market/all',
    })
    const data: MarketType[] = res.data
    const pt = /^KRW-/
    console.log(data.filter(i => pt.test(i.market)))
    //console.log(res.headers)
  } catch(e) {
    const err: AxiosError = e
    console.log(err.message)
  }
  t.pass()
})


interface MinuteCandleType {
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
  unit: number
}

test('분(Minute) 캔들', async t => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://api.upbit.com/v1/candles/minutes/1',
      params: {
        market: 'KRW-BTC',
        count: '3',
      },
    })
    console.log(res.data)
    console.log(res.headers)
    console.log('status: ', res.status)
    console.log('statusTest: ', res.statusText)
  } catch(e) {
    const err: AxiosError = e
    console.log(err.message)
  }
  t.pass()
})
