import test from 'ava'
import Binance from 'node-binance-api'
import {
  getConfig,
} from '../src/utils'
import {
  Observable,
} from 'fourdollar'



const {
  binance: {
    APIKEY,
    APISECRET,
  },
} = getConfig('./config.json')

const binance = new Binance({
  APIKEY,
  APISECRET,
  useServerTime: true,
})


test('prices', t => {
  return new Observable(sub => {
    // binance.prices('BTCUSDT', (err, ticker) => {
    binance.prices((err, ticker) => {
      console.log(ticker)
      console.log('Price of BTC', ticker.BTCUSDT)
      console.log()
      sub.complete()
    })
  })
})

test.only('exchangeInfo', t => {
  return new Observable(sub => {
    binance.exchangeInfo((err, res) => {
      console.log(res)
      sub.complete()
    })
  })
})
