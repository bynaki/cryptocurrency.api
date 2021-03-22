

export interface Response<T> {
  status: number
  remainingReq: {
    market: string
    min: number
    sec: number
  }
  data: T
}

/**
 * 마켓 코드 조회
 * https://docs.upbit.com/reference#%EB%A7%88%EC%BC%93-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C
**/
export interface MarketType {
  // market 업비트에서 제공중인 시장 정보
  market: string
  // 거래 대상 암호화폐 한글명
  korean_name: string
  // 거래 대상 암호화폐 영문명
  english_name: string
  // 유의 종목 여부. NONE (해당 사항 없음), CAUTION(투자유의)	
  market_warning?: string
}

/**
 * 캔들 타입
 * https://docs.upbit.com/reference#%EC%8B%9C%EC%84%B8-%EC%BA%94%EB%93%A4-%EC%A1%B0%ED%9A%8C
**/
export interface CandleType {
  // 마켓명	String
  market: string
  // 캔들 기준 시각(UTC 기준)	String
  candle_date_time_utc: string
  // 캔들 기준 시각(KST 기준)	String
  candle_date_time_kst: string
  // 시가	Double
  opening_price: number
  // 고가	Double
  high_price: number
  // 저가	Double
  low_price: number
  // 종가	Double
  trade_price: number
  // 해당 캔들에서 마지막 틱이 저장된 시각	Long
  timestamp: number
  // 누적 거래 금액	Double
  candle_acc_trade_price: number
  // 누적 거래량	Double
  candle_acc_trade_volume: number
}

export interface CandleMinuteType extends CandleType {
  // 분 단위(유닛)	Integer
  unit: number
}

export interface CandleDayType extends CandleType {
  // 전일 종가(UTC 0시 기준)	Double
  prev_closing_price: number
  // 전일 종가 대비 변화 금액	Double
  change_price: number
  // 전일 종가 대비 변화량	Double
  change_rate: number
  // 종가 환산 화폐 단위로 환산된 가격(요청에 convertingPriceUnit 파라미터 없을 시 해당 필드 포함되지 않음.)	Double
  converted_trade_price?: number
}

export interface CandleWeekType extends CandleType {
  // 캔들 기간의 가장 첫 날	String
  first_day_of_period: string
}

export interface CandleMonthType extends CandleType {
  // 캔들 기간의 가장 첫 날	String
  first_day_of_period: string
}

export interface TradeTickType {
  // 마켓 구분 코드	String
  market: string
  // 체결 일자(UTC 기준)	String
  trade_date_utc: string
  // 체결 시각(UTC 기준)	String
  trade_time_utc: string
  // 체결 타임스탬프	Long
  timestamp: number
  // 체결 가격	Double
  trade_price: number
  // 체결량	Double
  trade_volume: number
  // 전일 종가	Double
  prev_closing_price: number
  // 변화량	Double
  change_price: number
  // 매도/매수	String
  ask_bid: 'ASK'|'BID'
  // 체결 번호(Unique)	Long
  sequential_id: number
}

export interface TickerType {
  // 종목 구분 코드	String
  market: string
  // 최근 거래 일자(UTC)	String
  trade_date: string
  // 최근 거래 시각(UTC)	String
  trade_time: string
  // 최근 거래 일자(KST)	String
  trade_date_kst: string
  // 최근 거래 시각(KST)	String
  trade_time_kst: string
  // 최근 거래 timestamp String
  trade_timestamp: string
  // 시가	Double
  opening_price: number
  // 고가	Double
  high_price: number
  // 저가	Double
  low_price: number
  // 종가	Double
  trade_price: number
  // 전일 종가	Double
  prev_closing_price: number
  // EVEN : 보합, RISE : 상승, FALL : 하락	String
  change: 'RISE'|'EVEN'|'FALL'
  // 변화액의 절대값	Double
  change_price: number
  // 변화율의 절대값	Double
  change_rate: number
  // 부호가 있는 변화액	Double
  signed_change_price: number
  // 부호가 있는 변화율	Double
  signed_change_rate: number
  // 가장 최근 거래량	Double
  trade_volume: number
  // 누적 거래대금(UTC 0시 기준)	Double
  acc_trade_price: number
  // 24시간 누적 거래대금	Double
  acc_trade_price_24h: number
  // 누적 거래량(UTC 0시 기준)	Double
  acc_trade_volume: number
  // 24시간 누적 거래량	Double
  acc_trade_volume_24h: number
  // 52주 신고가	Double
  highest_52_week_price: number
  // 52주 신고가 달성일	String
  highest_52_week_date: string
  // 52주 신저가	Double
  lowest_52_week_price: number
  // 52주 신저가 달성일	String
  lowest_52_week_date: string
  // 타임스탬프	Long
  timestamp: number
}

export interface OrderbookType {
  // 마켓 코드	String
  market: string
  // 호가 생성 시각	Long
  timestamp: number
  // 호가 매도 총 잔량	Double
  total_ask_size: number
  // 호가 매수 총 잔량	Double
  total_bid_size: number
  // 호가	List of Objects
  orderbook_units: [{
    // 매도호가	Double
    ask_price: number
    // 매수호가	Double
    bid_price: number
    // 매도 잔량	Double
    ask_size: number
    // 매수 잔량	Double
    bid_size: number
  }]
}

export interface AccountType {
  // 화폐를 의미하는 영문 대문자 코드 String
  currency: string
  // 주문가능 금액/수량 NumberString
  balance: string
  // 주문 중 묶여있는 금액/수량 NumberString
  locked: string
  // 매수평균가 NumberString
  avg_buy_price: string
  // 매수평균가 수정 여부 Boolen
  avg_buy_price_modified: boolean
  // 평단가 기준 화폐 String
  unit_currency: string
}

export interface OrderChanceType {
  // 매수 수수료 비율	NumberString
  bid_fee: string
  // 매도 수수료 비율	NumberString
  ask_fee: string
  // 마켓에 대한 정보	Object
  market: {
    // 마켓의 유일 키	String
    id: string
    // 마켓 이름	String
    name: string
    // 지원 주문 방식	Array[String]
    order_types: string[]
    // 지원 주문 종류	Array[String]
    order_sides: string[]
    // 매수 시 제약사항	Object
    bid: {
      // 화폐를 의미하는 영문 대문자 코드	String
      currency: string
      // 주문금액 단위	String
      price_unit: string
      // 최소 매도/매수 금액	Number
      min_total: number
    },
    // 매도 시 제약사항	Object
    ask: {
      // 화폐를 의미하는 영문 대문자 코드	String
      currency: string
      // 주문금액 단위	String
      price_unit: string
      // 최소 매도/매수 금액	Number
      min_total: number
    },
    // 최대 매도/매수 금액	NumberString
    max_total: string
    // 마켓 운영 상태	String
    state: string
  },
  // 매수 시 사용하는 화폐의 계좌 상태	Object
  bid_account: {
    // 화폐를 의미하는 영문 대문자 코드	String
    currency: string
    // 주문가능 금액/수량	NumberString
    balance: string
    // 주문 중 묶여있는 금액/수량	NumberString
    locked: string
    // 매수평균가	NumberString
    avg_buy_price: string
    // 매수평균가 수정 여부	Boolean
    avg_buy_price_modified: boolean
    // 평단가 기준 화폐	String
    unit_currency: string
  },
  // 매도 시 사용하는 화폐의 계좌 상태	Object
  ask_account: {
    // 화폐를 의미하는 영문 대문자 코드	String
    currency: string
    // 주문가능 금액/수량	NumberString
    balance: string
    // 주문 중 묶여있는 금액/수량	NumberString
    locked: string
    // 매수평균가	NumberString
    avg_buy_price: string
    // 매수평균가 수정 여부	Boolean
    avg_buy_price_modified: boolean
    // 평단가 기준 화폐	String
    unit_currency: string
  }
}

export interface OrderType {
  uuid: string
  side: 'bid'|'ask'
  ord_type: 'limit'|'price'|'market'
  price: string
  state: 'wait'|'done'
  market: string
  created_at: string
  volume: string
  remaining_volume: string
  reserved_fee: string
  remaining_fee: string
  paid_fee: string
  locked: string
  executed_volume: string
  trades_count: number
}

export interface OrderDetailType extends OrderType {
  trades: [
    {
      market: string
      uuid: string
      price: string
      volume: string
      funds: string
      side: 'bid'|'ask'
    }
  ]
}

export interface OrderExType extends OrderType {
  avg_price: string
}

/**
 * 캔들 Params
 * https://docs.upbit.com/reference#%EC%8B%9C%EC%84%B8-%EC%BA%94%EB%93%A4-%EC%A1%B0%ED%9A%8C
**/
export interface CandleParam {
  // 마켓 코드 (ex. KRW-BTC) (필수)
  market: string
  // 마지막 캔들 시각 (exclusive). 포맷 : yyyy-MM-dd'T'HH:mm:ssXXX or yyyy-MM-dd HH:mm:ss. 비워서 요청시 가장 최근 캔들
  to?: string
  // 캔들 개수(최대 200개까지 요청 가능)
  count?: number
}

/**
 * 캔들 Params Extensions
 * https://docs.upbit.com/reference#%EC%9D%BCday-%EC%BA%94%EB%93%A4-1
**/
export interface CandleParamEx extends CandleParam {
  // 종가 환산 화폐 단위 (생략 가능, KRW로 명시할 시 원화 환산 가격을 반환.)
  convertingPriceUnit?: string
}

/**
 * 체결 Params
 * https://docs.upbit.com/reference#%EC%B5%9C%EA%B7%BC-%EC%B2%B4%EA%B2%B0-%EB%82%B4%EC%97%AD
**/
export interface TradeTickParam {
  // 마켓 코드 (ex. KRW-BTC) (필수)
  market: string
  // 마지막 체결 시각. 형식 : [HHmmss 또는 HH:mm:ss]. 비워서 요청시 가장 최근 데이터
  to?: string
  // 체결 개수
  count?: number
  // 페이지네이션 커서 (sequentialId)
  cursor?: string
  // 최근 체결 날짜 기준 7일 이내의 이전 데이터 조회 가능. 비워서 요청 시 가장 최근 체결 날짜 반환. (범위: 1 ~ 7))
  daysAgo?: number
}

export interface OrderDetailParam {
  uuid: string
  identifier?: string
}

export interface OrderListParam {
  market: string
  state?: string
  uuids?: string[]
  identifiers?: string[]
  page?: number
  order_by?: 'desc'|'asc'
}

export interface OrderParam {
  market: string
  side: 'bid'|'ask'
  volume?: number
  price: number
  ord_type: 'limit'|'price'|'market'
  identifier?: string
}

export interface CancelParam {
  uuid: string
}
