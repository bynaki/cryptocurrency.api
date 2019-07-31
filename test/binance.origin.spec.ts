import test from 'ava'
import * as Binance from 'node-binance-api'


const binance = Binance().options({
  APIKEY: 'iAWaVF7xSliMQD6uWhfZfdvsLSFit4Deg4J2v7VDJSd0bHOzDszuinplJUPeZAF0',
  APISECRET: '1jEEajmk5IEhbLnNB0Tk3XhYDBTmGMY9tbpXweXqpy58LZBAg92cEV0Dk2Uuo4GB',
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
