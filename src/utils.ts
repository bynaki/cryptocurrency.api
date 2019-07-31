import {
  readFileSync,
} from 'fs'



export function getConfig(filename: string): {
  bithumb: {
    connectKey: string
    secretKey: string
  }
  binance: {
    APIKEY: string
    APISECRET: string
  }
} {
  return JSON.parse(readFileSync(filename).toString())
}