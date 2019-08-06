import test from 'ava'
import * as Binance from 'node-binance-api'
import {
  getConfig,
} from '../src/utils'



const {
  binance: {
    APIKEY,
    APISECRET,
  },
} = getConfig('./config.json')

const binance = Binance().options({
  APIKEY,
  APISECRET,
  useServerTime: true,
})


test.cb('prices', t => {
  // binance.prices('BTCUSDT', (err, ticker) => {
  binance.prices((err, ticker) => {
    console.log(ticker)
    console.log('Price of BTC', ticker.BTCUSDT)
    console.log()
    t.end()
  })
})

test.cb.only('exchangeInfo', t => {
  binance.exchangeInfo((err, res) => {
    console.log(res)
    t.end()
  })
})
