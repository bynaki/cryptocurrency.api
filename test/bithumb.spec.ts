/**
 * Test Bithumb API
 */

import test from 'ava'
import {
  Bithumb,
} from '../src'
import {
  readFileSync,
} from 'fs'
import Timer from 'fourdollar.timer'



interface Config {
  bithumb: {
    connectKey: string
    secretKey: string
  }
}

const cf: Config = JSON.parse(readFileSync('./config.json').toString())

const bithumb = new Bithumb({
  connectKey: cf.bithumb.connectKey,
  secretKey: cf.bithumb.secretKey,
})
const timer = new Timer(100, 100)


test('bithumb > getTicker()', async t => {
  const res = await timer.once(() => bithumb.getTicker('BTC'))
  t.is(typeof res, 'object')
  t.is(Object.keys(res).length, 3)
  t.is(res.status, '0000')
  t.is(typeof res.data, 'object')
  t.is(Object.keys(res.data).length, 15)
  t.is(typeof res.data.opening_price, 'string')
  const trans = res.transType()
  t.is(typeof trans, 'object')
  t.is(Object.keys(trans).length, 2)
  t.is(trans.status, '0000')
  t.is(typeof trans.data, 'object')
  t.is(Object.keys(trans.data).length, 15)
  t.is(typeof trans.data.opening_price, 'number')
  t.is(trans['transType'], undefined)
  t.is(trans.data.t24H_fluctate, trans.data['24H_fluctate'])
  t.is(trans.data.t24H_fluctate_rate, trans.data['24H_fluctate_rate'])
})

test('bithumb > getOrderbook()', async t => {
  const res = await timer.once(() => bithumb.getOrderbook('BTC'))
  // console.log(JSON.stringify(res, null, 2))
  t.is(typeof res, 'object')
  t.is(Object.keys(res).length, 3)
  t.is(res.status, '0000')
  t.is(typeof res.data, 'object')
  t.is(Object.keys(res.data).length, 5)
  t.is(typeof res.transType, 'function')
  const trans = res.transType()
  // console.log(JSON.stringify(trans, null, 2))
  t.is(typeof trans, 'object')
  t.is(Object.keys(trans).length, 2)
  t.is(trans.status, '0000')
  t.is(typeof trans.data, 'object')
  t.is(Object.keys(trans.data).length, 5)
  t.is(trans['transType'], undefined)
})

test('bithumb > getOrderbook(): query', async t => {
  const res = await timer.once(() => bithumb.getOrderbook('BTC', {count: 2}))
  // console.log(JSON.stringify(res, null, 2))
  t.is(res.data.asks.length, 2)
  t.is(res.data.bids.length, 2)
})

test('bithumb > getTransactionHistory()', async t => {
  const res = await timer.once(() => bithumb.getTransactionHistory('BTC'))
  // console.log(JSON.stringify(res, null, 2))
  t.is(typeof res, 'object')
  t.is(Object.keys(res).length, 3)
  t.is(res.status, '0000')
  t.true(res.data.length > 0)
  t.is(Object.keys(res.data[0]).length, 6)
  let item01 = res.data[0]
  t.is(typeof item01.cont_no, 'string')
  t.is(typeof res.transType, 'function')
  const trans = res.transType()
  // console.log(JSON.stringify(trans, null, 2))
  t.is(typeof trans, 'object')
  t.is(Object.keys(trans).length, 2)
  t.is(trans.status, '0000')
  t.true(trans.data.length > 0)
  t.is(Object.keys(trans.data[0]).length, 6)
  let item02 = trans.data[0]
  t.is(typeof item02.cont_no, 'number')
  t.is(typeof item02.transaction_date, 'string')
  t.is(typeof res.transType, 'function')
  t.is(trans['transType'], undefined)
})

test('bithumb > getTransactionHistory(): query', async t => {
  const res = await timer.once(() => bithumb.getTransactionHistory('BTC', {
    cont_no: 3, // 체결 번호 (cont_no가 100 이라면 99 부터 불러진다)
    count: 2,   // 데이터 개수 Value : 1 ~ 100 (Default : 20)
  }))
  t.is(res.data.length, 2)
  t.is(res.data[0].cont_no, '2')
  t.is(res.data[1].cont_no, '1')
  const trans = res.transType()
  t.is(trans.data.length, 2)
  t.is(trans.data[0].cont_no, 2)
  t.is(trans.data[1].cont_no, 1)
  // console.log(JSON.stringify(res, null, 2))
})

test('bithumb > getTransactionHistory(): query = {cont_no: 200 + 100}', async t => {
  const res = await timer.once(() => bithumb.getTransactionHistory('BTC', {
    cont_no: 200 + 100,
    count: 100,
  }))
  t.is(res.transType().data[99].cont_no, 200)
})

test('bithumb > getTransactionHistory(): query = {cont_no: recent}', async t => {
  const res1 = await timer.once(() => bithumb.getTransactionHistory('BTC', { count: 1 }))
  const data1 = res1.transType().data
  const res2 = await timer.once(() => bithumb.getTransactionHistory('BTC', {
    cont_no: (data1[0].cont_no + 1 + 100),
    count: 100,
  }))
  const data2 = res2.transType().data
  console.log(data1[0])
  console.log(data2.slice(0, 5))
  t.pass()
})

test('bithumb > getAccountInfo()', async t => {
  const res = await timer.once(() => bithumb.getAccountInfo('BTC'))
  const trans = res.transType()
  const data = trans.data
  t.is(trans.status, '0000')
  t.is(typeof data.account_id, 'string')
  t.is(typeof data.balance, 'number')
  t.is(typeof data.created, 'number')
  t.is(typeof data.trade_fee, 'number')
})

test('bithumb > getBalanceInfo()', async t => {
  const res = await timer.once(() => bithumb.getBalanceInfo('ALL'))
  const trans = res.transType()
  const data = trans.data
  t.is(trans.status, '0000')
  const ff = data.filter(d => d.currency === 'BTC' || d.currency === 'KRW' || d.currency === 'ETH')
  t.is(ff.length, 3)
  ff.forEach(d => {
    t.is(typeof d.total, 'number')
    t.is(typeof d.in_use, 'number')
    t.is(typeof d.available, 'number')
    if(d.currency === 'KRW') {
      t.is(d.xcoin_last, null)
    } else {
      t.is(typeof d.xcoin_last, 'number')
    }
  })
})

test('bithumb > getWalletAddressInfo()', async t => {
  const res = await timer.once(() => bithumb.getWalletAddressInfo('ETH'))
  const trans = res.transType()
  const data = trans.data
  t.is(trans.status, '0000')
  t.is(data.currency, 'ETH')
  t.is(typeof data.wallet_address, 'string')
})

test('bithumb > getTickerInfo()', async t => {
  const res = await timer.once(() => bithumb.getTickerInfo('ETH', 'KRW'))
  const trans = res.transType()
  const data = trans.data
  t.is(trans.status, '0000')
  t.is(typeof data.opening_price, 'number')
  t.is(typeof data.closing_price, 'number')
  t.is(typeof data.min_price, 'number')
  t.is(typeof data.max_price, 'number')
  t.is(typeof data.average_price, 'number')
  t.is(typeof data.units_traded, 'number')
  t.is(typeof data.volume_1day, 'number')
  t.is(typeof data.volume_7day, 'number')
  t.is(typeof data.buy_price, 'number')
  t.is(typeof data.sell_price, 'number')
  t.is(typeof data['24H_fluctate'], 'number')
  t.is(typeof data['24H_fluctate_rate'], 'number')
  t.is(typeof data.t24H_fluctate, 'number')
  t.is(typeof data.t24H_fluctate_rate, 'number')
  t.is(typeof data.date, 'number')
})

test('bithumb > getOrdersInfo()', async t => {
  const res = await timer.once(() => bithumb.getOrdersInfo('BTC'))
  t.is(res.status, '5600')
})

test('bithumb > getOrdersDetailInfo()', async t => {
  const res = await timer.once(() => bithumb.getOrdersDetailInfo('BTC', {
    order_id: 1234,
    type: 'bid',
  }))
  t.is(res.status, '5500')
})

test('bithumb > getTransactionsInfo()', async t => {
  const res = await timer.once(() => bithumb.getTransactionsInfo('BTC'))
  t.is(res.status, '0000')
})