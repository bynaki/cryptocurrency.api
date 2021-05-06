import {
  readFileSync,
} from 'fs'
import {
  isFloat
} from 'fourdollar.isfloat'
import {
  isInteger
} from 'fourdollar.isinteger'



export function getConfig(filename: string): {
  bithumb: {
    connectKey: string
    secretKey: string
  }
  binance: {
    APIKEY: string
    APISECRET: string
  }
  upbit: {
    accessKey: string
    secretKey: string
  }
} {
  return JSON.parse(readFileSync(filename).toString())
}


export function toNumbers(obj: any) {
  if(!obj) {
    return obj
  }
  if(typeof(obj) === 'string') {
    if(isInteger(obj)) {
      return Number.parseInt(obj)
    }
    if(isFloat(obj)) {
      return Number.parseFloat(obj)
    }
    return obj
  }
  if(Array.isArray(obj)) {
    return obj.map(o => toNumbers(o))
  }
  const keys = Object.keys(obj)
  if(keys.length === 0) {
    return obj
  }
  const oobj = {}
  keys.forEach(k => oobj[k] = toNumbers(obj[k]))
  return oobj
}
