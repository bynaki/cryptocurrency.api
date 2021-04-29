

export interface PriceTickerType {
  symbol: string
  price: number
}

export interface PriceTickerResponse {
  data: {
    symbol: string
    price: string
  }
  transType: () => {
    data: PriceTickerType
  }
}

export interface PriceTickerAllResponse {
  data: {
    symbol: string
    price: string
  }[]
  transType: () => {
    data: PriceTickerType[]
  }
}

export interface CandleStickOptions {
  limit?: number,
  startTime?: number,
  endTime?: number,
}

export interface CandleStickType {
  time: number            // Open time
  open: number            // Open
  high: number            // High
  low: number             // Low
  close: number           // Close
  volume: number          // Volume
  closeTime: number       // Close time
  assetVolume: number     // Quote asset volume
  trades: number          // Number of trades
  buyBaseVolume: number   // Taker buy base asset volume
  buyAssetVolume: number  // Taker buy base asset volume
  ignored: number         // Ignore
}

export interface CandleStickResponse {
  data: {
    time: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    closeTime: number
    assetVolume: string
    trades: number
    buyBaseVolume: string
    buyAssetVolume: string
    ignored: string
  }[]
  transType: () => {
    data: CandleStickType[]
  }
}

export interface WsCandleStickType {
  startTime: number
  endTime: number
  symbol: string
  interval: string 
  firstTradeID: number
  lastTradeID: number
  open: number
  close: number
  high: number
  low: number
  volume: number
  trades: number
  isFinal: boolean
  quoteVolume: number
  buyVolume: number
  quoteBuyVolume: number
  ignore: number
}

export interface WsCandleStickResponse {
  eventType: string
  eventTime: number
  symbol: string
  data: {
    startTime: number
    endTime: number
    symbol: string
    interval: string 
    firstTradeID: number
    lastTradeID: number
    open: string
    close: string
    high: string
    low: string
    volume: string
    trades: number
    isFinal: boolean
    quoteVolume: string
    buyVolume: string
    quoteBuyVolume: string
    ignore: string
  }
  transType: () => {
    eventType: string
    eventTime: number
    symbol: string
    data: WsCandleStickType
  }
}