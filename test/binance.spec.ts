import test from 'ava'
import {
  Binance,
  IBinance as I,
} from '../src'
import {
  getConfig,
} from '../src/utils'



async function stop(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}


const {
  binance: {
    APIKEY,
    APISECRET,
  },
} = getConfig('./config.json')



const binance = new Binance({
  APIKEY,
  APISECRET,
  useSeverTime: true,
  reconnect: false,
})


test('binance > prices(): single', async t => {
  const res = await binance.prices('LTCBTC')
  t.is(res.data.symbol, 'LTCBTC')
  t.is(typeof res.data.price, 'string')
  const trans = res.transType()
  t.is(trans.data.symbol, 'LTCBTC')
  t.is(typeof trans.data.price, 'number')
})

test('binance > prices(): all', async t => {
  const res = await binance.prices()
  t.true(res.data.length > 1)
  const i = res.data.find(r => r.symbol === 'BNBBTC')
  t.is(i.symbol, 'BNBBTC')
  t.is(typeof i.price, 'string')
  const trans = res.transType()
  t.true(trans.data.length > 1)
  const ii = trans.data.find(r => r.symbol === 'BNBBTC')
  t.is(ii.symbol, 'BNBBTC')
  t.is(typeof ii.price, 'number')
})

test('binance > price(): error', async t => {
  try {
    await binance.prices('xxx')
  } catch(err) {
    t.is(err.statusCode, 400)
    t.is(err.statusMessage, 'Bad Request')
  }
})

test('binance > candlesticks()', async t => {
  const startTime = new Date('2019.01.01 12:00').getTime()
  const res = await binance.candlesticks('BTCUSDT', '1m', {
    // limit: 10,
    startTime,
  })
  t.is(res.data.length, 500)
  res.data.reduce((time, d) => {
    t.is(d.time, time)
    return time + 60 * 1000 * 1
  }, startTime)
  const trans = res.transType().data
  t.is(trans.length, 500)
  trans.forEach(d => {
    t.is(typeof d.close, 'number')
  })
})

test('binance > candlesticks(): current', async t => {
  const res = await binance.candlesticks('BTCUSDT', '15m', {
    limit: 10,
  })
  const cut = makeCut(15)
  const trans = res.transType().data
  printCandle(...trans)
  t.is(trans[trans.length - 1].time, cut(new Date().getTime()))
})

test('binance > candlesticks(): future', async t => {
  const res = await binance.candlesticks('BTCUSDT', '1m', {
    startTime: new Date('2022.08.09 20:00').getTime(),
  })
  t.is(res.data.length, 0)
})

test.cb('binance > websockets#candlesticks()', t => {
  binance.websockets.candlesticks(['BTCUSDT'], '1m', (candlesticks) => {
    // binance.websockets.terminate('btcusdt@kline_1m')
    t.is(candlesticks.symbol, 'BTCUSDT')
    t.is(typeof candlesticks.data.close, 'string')
    const trans = candlesticks.transType()
    t.is(typeof trans.data.close, 'number')
    t.end()
  })
})

// terminate 조건
// options에서 reconnect: false
// websockets#candlesticks()에서 symbol 하나만 적용
test('binance > websockets#candlesticks(): terminate', async t => {
  let terminated = false
  binance.websockets.candlesticks('LTCUSDT', '1m', cs => {
    binance.websockets.terminate('ltcusdt@kline_1m')
    if(terminated) {
      t.fail()
    }
    terminated = true
  })
  await stop(10000)
  t.pass()
})

test('binance > print symbol', async t => {
  const res = await binance.prices()
  const ptn = /^[A-Z]+USDT$/
  res.transType().data.filter(r => ptn.test(r.symbol))
  .forEach(r => {
    console.log(`${r.symbol} = '${r.symbol}',`)
  })
  t.pass()
})



function printCandle(...data: I.CandleStickType[]) {
  data.forEach(d => {
    console.log({
      mts: new Date(d.time).toLocaleString(),
      open: d.open,
      close: d.close,
      hight: d.high,
      low: d.low,
      volumn: d.volume,
    })
  })
}

export function makeCut(timeFrame: number): (time: number) => number {
  return (time: number) => time - (time % (timeFrame * 60 * 1000))
}
