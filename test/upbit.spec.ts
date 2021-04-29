import test from 'ava'
import {
  getConfig,
} from '../src/utils'
import {
  UPbit,
} from '../src'
import { AxiosError } from 'axios';



const cf = getConfig('./config.json')
const upbit = new UPbit(cf.upbit)

// 마켓 코드 조회
test('upbit > getMarket', async t => {
  const res = await upbit.getMarket()
  const re = /^KRW-/
  res.data.filter(d => re.test(d.market)).forEach(d => console.log(d.market))
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.deepEqual(res.data.filter(d => d.market === 'KRW-BTC')[0], {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
  })
  const res2 = await upbit.getMarket(true)
  t.deepEqual(res2.data.filter(d => d.market === 'KRW-BTC')[0], {
    market: 'KRW-BTC',
    korean_name: '비트코인',
    english_name: 'Bitcoin',
    market_warning: 'NONE',
  })
})

// 분(Minute) 캔들
test('upbit > getCandlesMinutes', async t => {
  const res = await upbit.getCandlesMinutes(1, {market: 'KRW-BTC'})
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'candle_date_time_utc',
    'candle_date_time_kst',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'timestamp',
    'candle_acc_trade_price',
    'candle_acc_trade_volume',
    'unit',
  ])
  console.log(res)
})

// 분(Minute) 캔들
test('upbit > getCandlesMinutes: error', async t => {
  const err: AxiosError = await t.throwsAsync(() => {
    return upbit.getCandlesMinutes(2, {market: 'KRW-BTC'})
  })
  t.is(err.message, 'Request failed with status code 400')
})

test('upbit > getCandlesMinutes: params', async t => {
  const res = await upbit.getCandlesMinutes(5, {
    market: 'KRW-BTC',
    to: '2019-01-01 12:00:00',
    count: 10,
  })
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 10)
  t.deepEqual(res.data[0], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-01-01T11:55:00',
    candle_date_time_kst: '2019-01-01T20:55:00',
    opening_price: 4207000,
    high_price: 4208000,
    low_price: 4203000,
    trade_price: 4203000,
    timestamp: 1546343997369,
    candle_acc_trade_price: 23095834.33763,
    candle_acc_trade_volume: 5.48994487,
    unit: 5,
  })
  t.deepEqual(res.data[res.data.length - 1], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-01-01T11:10:00',
    candle_date_time_kst: '2019-01-01T20:10:00',
    opening_price: 4204000,
    high_price: 4207000,
    low_price: 4202000,
    trade_price: 4204000,
    timestamp: 1546341270516,
    candle_acc_trade_price: 23941979.95104,
    candle_acc_trade_volume: 5.69418674,
    unit: 5,
  })
})

// 일(Day) 캔들
test('upbit > getCandlesDays', async t => {
  const res = await upbit.getCandlesDays({market: 'KRW-BTC'})
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'candle_date_time_utc',
    'candle_date_time_kst',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'timestamp',
    'candle_acc_trade_price',
    'candle_acc_trade_volume',
    'prev_closing_price',
    'change_price',
    'change_rate',
  ])
  console.log(res)
})

// 일(Day) 캔들
test('upbit > getCandlesDays: params', async t => {
  const res = await upbit.getCandlesDays({
    market: 'KRW-BTC',
    to: '2019-02-20 12:00:00',
    count: 10,
    convertingPriceUnit: 'KRW',
  })
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 10)
  t.deepEqual(res.data[0], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-02-20T00:00:00',
    candle_date_time_kst: '2019-02-20T09:00:00',
    opening_price: 4259000,
    high_price: 4333000,
    low_price: 4219000,
    trade_price: 4315000,
    timestamp: 1550707190319,
    candle_acc_trade_price: 21687354260.85121,
    candle_acc_trade_volume: 5067.51108128,
    prev_closing_price: 4259000,
    change_price: 56000,
    change_rate: 0.0131486264,
    converted_trade_price: null,
  })
  t.deepEqual(res.data[res.data.length - 1], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-02-11T00:00:00',
    candle_date_time_kst: '2019-02-11T09:00:00',
    opening_price: 4023000,
    high_price: 4035000,
    low_price: 3962000,
    trade_price: 3986000,
    timestamp: 1549929599624,
    candle_acc_trade_price: 14716578441.15567,
    candle_acc_trade_volume: 3690.35442515,
    prev_closing_price: 4023000,
    change_price: -37000,
    change_rate: -0.0091971166,
    converted_trade_price: null,
  })
})

// 주(Week) 캔들
test('upbit > getCandlesWeeks', async t => {
  const res = await upbit.getCandlesWeeks({market: 'KRW-BTC'})
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'candle_date_time_utc',
    'candle_date_time_kst',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'timestamp',
    'candle_acc_trade_price',
    'candle_acc_trade_volume',
    'first_day_of_period',
  ])
})

// 주(Week) 캔들
test('upbit > getCandlesWeeks: params', async t => {
  const res = await upbit.getCandlesWeeks({
    market: 'KRW-BTC',
    to: '2019-02-20 12:00:00',
    count: 10,
  })
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 10)
  t.deepEqual(res.data[0], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-02-18T00:00:00',
    candle_date_time_kst: '2019-02-18T09:00:00',
    opening_price: 4040000,
    high_price: 4554000,
    low_price: 4027000,
    trade_price: 4178000,
    timestamp: 1551052798490,
    candle_acc_trade_price: 221219966011.68744,
    candle_acc_trade_volume: 51616.29433245,
    first_day_of_period: '2019-02-18',
  })
  t.deepEqual(res.data[res.data.length - 1], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2018-12-17T00:00:00',
    candle_date_time_kst: '2018-12-17T09:00:00',
    opening_price: 3636000,
    high_price: 4733000,
    low_price: 3625000,
    trade_price: 4439000,
    timestamp: 1545609599920,
    candle_acc_trade_price: 329046125142.1958,
    candle_acc_trade_volume: 76874.08448229,
    first_day_of_period: '2018-12-17',
  })
})

// 월(Month) 캔들
test('upbit > getCandlesMonths', async t => {
  const res = await upbit.getCandlesMonths({market: 'KRW-BTC'})
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'candle_date_time_utc',
    'candle_date_time_kst',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'timestamp',
    'candle_acc_trade_price',
    'candle_acc_trade_volume',
    'first_day_of_period',
  ])
})

// 월(Month) 캔들
test('upbit > getCandlesMonths: params', async t => {
  const res = await upbit.getCandlesMonths({
    market: 'KRW-BTC',
    to: '2019-02-01 00:00:00',
    count: 10,
  })
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 10)
  t.deepEqual(res.data[0], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2019-01-01T00:00:00',
    candle_date_time_kst: '2019-01-01T09:00:00',
    opening_price: 4200000,
    high_price: 4577000,
    low_price: 3730000,
    trade_price: 3775000,
    timestamp: 1548979197516,
    candle_acc_trade_price: 625565113869.71,
    candle_acc_trade_volume: 152628.16488031,
    first_day_of_period: '2019-01-01',
  })
  t.deepEqual(res.data[res.data.length - 1], {
    market: 'KRW-BTC',
    candle_date_time_utc: '2018-04-01T00:00:00',
    candle_date_time_kst: '2018-04-01T09:00:00',
    opening_price: 7688000,
    high_price: 10755000,
    low_price: 7087000,
    trade_price: 10138000,
    timestamp: 1525132804146,
    candle_acc_trade_price: 4959892531222.687,
    candle_acc_trade_volume: 573633.81153136,
    first_day_of_period: '2018-04-01',
  })
})

// 최근 체결 내역
test('upbit > getTradesTicks', async t => {
  const res = await upbit.getTradesTicks({market: 'KRW-BTC'})
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'trade_date_utc',
    'trade_time_utc',
    'timestamp',
    'trade_price',
    'trade_volume',
    'prev_closing_price',
    'change_price',
    'ask_bid',
    'sequential_id',
  ])
})

// 최근 체결 내역
test('upbit > getTradesTicks: params', async t => {
  const res = await upbit.getTradesTicks({
    market: 'KRW-BTC',
    to: '00:05:00',
    count: 10,
  })
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 10)
})

// 현재가 정보
test('upbit > getTicker', async t => {
  const res = await upbit.getTicker({ markets: 'KRW-BTC' })
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'trade_date',
    'trade_time',
    'trade_date_kst',
    'trade_time_kst',
    'trade_timestamp',
    'opening_price',
    'high_price',
    'low_price',
    'trade_price',
    'prev_closing_price',
    'change',
    'change_price',
    'change_rate',
    'signed_change_price',
    'signed_change_rate',
    'trade_volume',
    'acc_trade_price',
    'acc_trade_price_24h',
    'acc_trade_volume',
    'acc_trade_volume_24h',
    'highest_52_week_price',
    'highest_52_week_date',
    'lowest_52_week_price',
    'lowest_52_week_date',
    'timestamp',
  ])
})

// 현재가 정보
test('upbit > getTicker: 2 length', async t => {
  const res = await upbit.getTicker({ markets: 'KRW-BTC, KRW-ETH' })
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 2)
  t.is(res.data[0].market, 'KRW-BTC')
  t.is(res.data[1].market, 'KRW-ETH')
})

// 호가 정보 조회
test('upbit > getOrderbook', async t => {
  const res = await upbit.getOrderbook({ markets: 'KRW-BTC' })
  console.log(res)
  console.log(res.data[0].orderbook_units)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 1)
  t.is(res.data[0].orderbook_units.length, 15)
  t.deepEqual(Object.keys(res.data[0]), [
    'market',
    'timestamp',
    'total_ask_size',
    'total_bid_size',
    'orderbook_units',
  ])
  t.deepEqual(Object.keys(res.data[0].orderbook_units[0]), [
    'ask_price',
    'bid_price',
    'ask_size',
    'bid_size',
  ])
})

// 호가 정보 조회
test('upbit > getOrderbook: 2 length', async t => {
  const res = await upbit.getOrderbook({ markets: 'KRW-BTC, KRW-ADA' })
  console.log(res)
  console.log(res.data[0].orderbook_units)
  console.log(res.data[1].orderbook_units)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.is(res.data.length, 2)
})

// 전체 계좌 조회
test('upbit > getAccounts', async t => {
  const res = await upbit.getAccounts()
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
})

// 주문 가능 정보
test('upbit > getOrdersChance', async t => {
  const res = await upbit.getOrdersChance({market: 'KRW-BTC'})
  console.log(JSON.stringify(res, null ,2))
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
})

// 주문 리스트 조회
test('upbit > getOrderList: default (state: wait)', async t => {
  const res = await upbit.getOrderList()
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  if(res.data.length !== 0) {
    t.deepEqual(Object.keys(res.data[0]), [
      'uuid',             'side',
      'ord_type',         'price',
      'state',            'market',
      'created_at',       'volume',
      'remaining_volume', 'reserved_fee',
      'remaining_fee',    'paid_fee',
      'locked',           'executed_volume',
      'trades_count',
    ])
    // default
    res.data.forEach(d => t.is(d.state, 'wait'))
  }
})

// 주문 리스트 조회
test('upbit > getOrderList: market & state: done', async t => {
  const res = await upbit.getOrderList({market: 'KRW-DKA', state: 'done'})
  console.log(res)
  t.is(res.status, 200)
  t.deepEqual(Object.keys(res.remainingReq), ['group', 'min', 'sec'])
  t.true(res.data.length !== 0)
  res.data.forEach(d => {
    t.is(d.market, 'KRW-DKA')
    t.is(d.state, 'done')
  })
})

// 개별 주문 조회
test('upbit > getOrderDetail', async t => {
  const res = await upbit.getOrderList({market: 'KRW-BTC', state: 'done'})
  const uuid = res.data[0].uuid
  const res2 = await upbit.getOrderDetail({uuid})
  t.is(res2.status, 200)
  t.deepEqual(Object.keys(res2.remainingReq), ['group', 'min', 'sec'])
  console.log(JSON.stringify(res2, null, 2))
  const data = res2.data
  t.is(data.uuid, uuid)
  t.is(data.market, 'KRW-BTC')
  t.is(data.state, 'done')
  t.is(data.trades_count, data.trades.length)
})

// 주문하기 & 주문 취소 접수
test('upbit > order & cancel', async t => {
  const trade = await upbit.getTradesTicks({market: 'KRW-BTC'})
  const price = (trade.data[0].trade_price * 0.9) - ((trade.data[0].trade_price * 0.9) % 1000)
  const params = {
    market: 'KRW-BTC',
    side: 'bid',
    volume: (10000 / price).toString(),
    price: price.toString(),
    ord_type: 'limit',
  }
  console.log(`params: ${JSON.stringify(params)}`)
  const order = await upbit.order({
    market: 'KRW-BTC',
    side: 'bid',
    volume: (10000 / price).toString(),
    price: price.toString(),
    ord_type: 'limit',
  })
  console.log(order)
  t.is(order.status, 201)
  t.deepEqual(Object.keys(order.remainingReq), ['group', 'min', 'sec'])
  t.is(order.remainingReq.group, 'order')
  const cancel = await upbit.cancel({uuid: order.data.uuid})
  console.log(cancel)
  t.is(cancel.status, 200)
  t.deepEqual(Object.keys(cancel.remainingReq), ['group', 'min', 'sec'])
  t.is(cancel.remainingReq.group, 'default')
})

