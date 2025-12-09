// Predefined quiz scenarios based on StoQuizGame.md

export interface PredefinedQuiz {
  id: string
  type: 'technical' | 'fundamental'
  symbol: string
  stockName: string
  period: string
  correctAnswer: 'up' | 'down'
  pattern?: string
  explanation: string
  data: any
}

// Technical Analysis Quizzes
export const technicalQuizzes: PredefinedQuiz[] = [
  {
    id: 'tech_1',
    type: 'technical',
    symbol: 'BTC/USD',
    stockName: 'Bitcoin',
    period: 'Oct 2017 – Jan 2018',
    correctAnswer: 'down',
    pattern: 'Head and Shoulders',
    explanation: 'This is a classic Head and Shoulders top. The price formed three peaks: a higher middle peak (Head) and two lower side peaks (Shoulders). Breaking the "neckline" support signaled a major trend reversal to the downside.',
    data: {
      chartPeriod: '90 days',
      predictionDays: 30,
      candles: [
        // Mock candlestick data for Head and Shoulders pattern
        { dt: '2017-10-01', open: 4500, high: 4800, low: 4400, close: 4750, volume: 1000000 },
        { dt: '2017-10-15', open: 4750, high: 6200, low: 4600, close: 6100, volume: 1500000 },
        { dt: '2017-11-01', open: 6100, high: 8000, low: 5500, close: 6500, volume: 2000000 },
        { dt: '2017-11-15', open: 6500, high: 7800, low: 6200, close: 7000, volume: 1800000 },
        { dt: '2017-12-01', open: 7000, high: 12000, low: 6800, close: 11000, volume: 3000000 },
        { dt: '2017-12-15', open: 11000, high: 19500, low: 10500, close: 14000, volume: 4000000 },
        { dt: '2018-01-01', open: 14000, high: 17000, low: 7500, close: 8000, volume: 5000000 },
        { dt: '2018-01-15', open: 8000, high: 12000, low: 6000, close: 6500, volume: 3500000 }
      ]
    }
  },
  {
    id: 'tech_2',
    type: 'technical',
    symbol: 'TSLA',
    stockName: 'Tesla',
    period: 'July 2020 – Aug 2020',
    correctAnswer: 'up',
    pattern: 'Bull Flag',
    explanation: 'This pattern is a Bull Flag. The stock had a sharp rise (the pole), followed by a brief, narrow consolidation channel (the flag). This is a continuation pattern, signaling the uptrend will resume.',
    data: {
      chartPeriod: '45 days',
      predictionDays: 10,
      candles: [
        { dt: '2020-07-01', open: 220, high: 230, low: 215, close: 225, volume: 45000000 },
        { dt: '2020-07-10', open: 225, high: 280, low: 220, close: 275, volume: 65000000 },
        { dt: '2020-07-20', open: 275, high: 290, low: 260, close: 280, volume: 55000000 },
        { dt: '2020-07-25', open: 280, high: 285, low: 270, close: 275, volume: 40000000 },
        { dt: '2020-07-30', open: 275, high: 280, low: 265, close: 270, volume: 35000000 },
        { dt: '2020-08-05', open: 270, high: 350, low: 265, close: 340, volume: 85000000 },
        { dt: '2020-08-10', open: 340, high: 380, low: 320, close: 370, volume: 95000000 },
        { dt: '2020-08-15', open: 370, high: 450, low: 360, close: 440, volume: 120000000 }
      ]
    }
  },
  {
    id: 'tech_3',
    type: 'technical',
    symbol: 'AMZN',
    stockName: 'Amazon',
    period: 'July 2001 – Oct 2001',
    correctAnswer: 'up',
    pattern: 'Double Bottom',
    explanation: 'This chart shows a Double Bottom. The price hit a low, bounced, and hit the same low again without breaking it (forming a \'W\' shape). This signals that selling pressure is exhausted and a reversal up is coming.',
    data: {
      chartPeriod: '120 days',
      predictionDays: 15,
      candles: [
        { dt: '2001-07-01', open: 15.50, high: 16.00, low: 8.50, close: 9.00, volume: 25000000 },
        { dt: '2001-07-15', open: 9.00, high: 11.50, low: 8.60, close: 11.00, volume: 20000000 },
        { dt: '2001-08-01', open: 11.00, high: 12.00, low: 7.50, close: 8.00, volume: 30000000 },
        { dt: '2001-08-15', open: 8.00, high: 10.00, low: 7.80, close: 9.50, volume: 22000000 },
        { dt: '2001-09-01', open: 9.50, high: 11.00, low: 8.50, close: 10.50, volume: 18000000 },
        { dt: '2001-09-15', open: 10.50, high: 14.00, low: 10.00, close: 13.00, volume: 28000000 },
        { dt: '2001-10-01', open: 13.00, high: 18.00, low: 12.00, close: 17.00, volume: 35000000 },
        { dt: '2001-10-15', open: 17.00, high: 20.00, low: 15.50, close: 19.00, volume: 40000000 }
      ]
    }
  },
  {
    id: 'tech_4',
    type: 'technical',
    symbol: 'AAPL',
    stockName: 'Apple',
    period: 'Feb 2004 – Sept 2004',
    correctAnswer: 'up',
    pattern: 'Cup and Handle',
    explanation: 'This is a textbook Cup and Handle. The price formed a rounded "U" shape (the Cup) followed by a small downward drift (the Handle). This is a very strong bullish accumulation pattern.',
    data: {
      chartPeriod: '210 days',
      predictionDays: 20,
      candles: [
        { dt: '2004-02-01', open: 12.00, high: 13.50, low: 11.00, close: 11.50, volume: 15000000 },
        { dt: '2004-03-01', open: 11.50, high: 12.00, low: 10.00, close: 10.50, volume: 18000000 },
        { dt: '2004-04-01', open: 10.50, high: 11.50, low: 9.50, close: 10.00, volume: 20000000 },
        { dt: '2004-05-01', open: 10.00, high: 11.00, low: 9.80, close: 10.50, volume: 16000000 },
        { dt: '2004-06-01', open: 10.50, high: 12.50, low: 10.00, close: 12.00, volume: 19000000 },
        { dt: '2004-07-01', open: 12.00, high: 13.00, low: 11.50, close: 12.50, volume: 17000000 },
        { dt: '2004-08-01', open: 12.50, high: 12.80, low: 12.00, close: 12.20, volume: 14000000 },
        { dt: '2004-09-01', open: 12.20, high: 18.00, low: 12.00, close: 17.50, volume: 30000000 },
        { dt: '2004-09-15', open: 17.50, high: 22.00, low: 16.50, close: 21.00, volume: 45000000 }
      ]
    }
  },
  {
    id: 'tech_5',
    type: 'technical',
    symbol: 'ZM',
    stockName: 'Zoom',
    period: 'Sept 2020 – Nov 2020',
    correctAnswer: 'down',
    pattern: 'Rounding Top',
    explanation: 'This pattern is a Rounding Top (or Distribution). The aggressive uptrend began to lose momentum, curving gently downward. This indicates buyers were losing control to sellers, leading to a crash.',
    data: {
      chartPeriod: '75 days',
      predictionDays: 15,
      candles: [
        { dt: '2020-09-01', open: 280, high: 320, low: 270, close: 310, volume: 25000000 },
        { dt: '2020-09-15', open: 310, high: 450, low: 300, close: 440, volume: 40000000 },
        { dt: '2020-10-01', open: 440, high: 500, low: 420, close: 480, volume: 55000000 },
        { dt: '2020-10-15', open: 480, high: 520, low: 460, close: 490, volume: 45000000 },
        { dt: '2020-11-01', open: 490, high: 510, low: 400, close: 420, volume: 65000000 },
        { dt: '2020-11-15', open: 420, high: 450, low: 350, close: 380, volume: 70000000 },
        { dt: '2020-11-20', open: 380, high: 400, low: 340, close: 350, volume: 60000000 }
      ]
    }
  },
  {
    id: 'tech_6',
    type: 'technical',
    symbol: 'AMD',
    stockName: 'AMD',
    period: 'Late 2015 – Feb 2016',
    correctAnswer: 'up',
    pattern: 'Inverse Head & Shoulders',
    explanation: 'This is an Inverse Head and Shoulders. It looks like a Head and Shoulders upside down. It signifies the end of a downtrend and the start of a massive long-term rally.',
    data: {
      chartPeriod: '120 days',
      predictionDays: 30,
      candles: [
        { dt: '2015-10-01', open: 2.50, high: 2.80, low: 2.00, close: 2.10, volume: 20000000 },
        { dt: '2015-11-01', open: 2.10, high: 2.50, low: 1.80, close: 2.20, volume: 25000000 },
        { dt: '2015-12-01', open: 2.20, high: 2.80, low: 1.60, close: 1.80, volume: 35000000 },
        { dt: '2015-12-15', open: 1.80, high: 2.20, low: 1.50, close: 2.10, volume: 28000000 },
        { dt: '2016-01-01', open: 2.10, high: 2.80, low: 1.90, close: 2.70, volume: 30000000 },
        { dt: '2016-01-15', open: 2.70, high: 3.50, low: 2.50, close: 3.40, volume: 45000000 },
        { dt: '2016-02-01', open: 3.40, high: 4.50, low: 3.20, close: 4.30, volume: 60000000 },
        { dt: '2016-02-15', open: 4.30, high: 5.00, low: 4.00, close: 4.80, volume: 55000000 }
      ]
    }
  },
  {
    id: 'tech_7',
    type: 'technical',
    symbol: 'CSCO',
    stockName: 'Cisco',
    period: 'March 2000 – April 2000',
    correctAnswer: 'down',
    pattern: 'Double Top',
    explanation: 'This is a Double Top pattern. The price tried to break a high twice but failed at the same resistance level (forming an \'M\' shape). This rejection often signals the start of a bear market.',
    data: {
      chartPeriod: '45 days',
      predictionDays: 15,
      candles: [
        { dt: '2000-03-01', open: 60.00, high: 65.00, low: 55.00, close: 64.00, volume: 45000000 },
        { dt: '2000-03-10', open: 64.00, high: 80.00, low: 60.00, close: 78.00, volume: 80000000 },
        { dt: '2000-03-15', open: 78.00, high: 82.00, low: 65.00, close: 68.00, volume: 90000000 },
        { dt: '2000-03-20', open: 68.00, high: 75.00, low: 60.00, close: 70.00, volume: 70000000 },
        { dt: '2000-03-25', open: 70.00, high: 78.00, low: 65.00, close: 72.00, volume: 65000000 },
        { dt: '2000-04-01', open: 72.00, high: 79.00, low: 55.00, close: 58.00, volume: 95000000 },
        { dt: '2000-04-10', open: 58.00, high: 65.00, low: 40.00, close: 45.00, volume: 120000000 },
        { dt: '2000-04-15', open: 45.00, high: 50.00, low: 35.00, close: 38.00, volume: 100000000 }
      ]
    }
  },
  {
    id: 'tech_8',
    type: 'technical',
    symbol: 'NVDA',
    stockName: 'NVIDIA',
    period: 'Dec 2022 – Jan 2023',
    correctAnswer: 'up',
    pattern: 'Ascending Triangle',
    explanation: 'This is an Ascending Triangle. You can see a flat resistance line at the top, but the lows are getting higher (rising support). This shows buyers are getting more aggressive, eventually causing a breakout up.',
    data: {
      chartPeriod: '45 days',
      predictionDays: 15,
      candles: [
        { dt: '2022-12-01', open: 140.00, high: 150.00, low: 135.00, close: 145.00, volume: 35000000 },
        { dt: '2022-12-10', open: 145.00, high: 155.00, low: 140.00, close: 150.00, volume: 40000000 },
        { dt: '2022-12-20', open: 150.00, high: 160.00, low: 145.00, close: 155.00, volume: 45000000 },
        { dt: '2022-12-25', open: 155.00, high: 165.00, low: 150.00, close: 160.00, volume: 38000000 },
        { dt: '2023-01-01', open: 160.00, high: 175.00, low: 155.00, close: 170.00, volume: 55000000 },
        { dt: '2023-01-10', open: 170.00, high: 195.00, low: 165.00, close: 190.00, volume: 70000000 },
        { dt: '2023-01-15', open: 190.00, high: 220.00, low: 180.00, close: 215.00, volume: 85000000 },
        { dt: '2023-01-20', open: 215.00, high: 240.00, low: 200.00, close: 230.00, volume: 90000000 }
      ]
    }
  },
  {
    id: 'tech_9',
    type: 'technical',
    symbol: 'FB',
    stockName: 'Meta',
    period: 'July 2018 – Sept 2018',
    correctAnswer: 'down',
    pattern: 'Descending Triangle',
    explanation: 'This is a Descending Triangle. The support line is flat at the bottom, but the highs are getting lower. This shows sellers are becoming more aggressive, usually leading to a breakdown.',
    data: {
      chartPeriod: '75 days',
      predictionDays: 20,
      candles: [
        { dt: '2018-07-01', open: 190.00, high: 210.00, low: 185.00, close: 205.00, volume: 25000000 },
        { dt: '2018-07-15', open: 205.00, high: 215.00, low: 190.00, close: 195.00, volume: 30000000 },
        { dt: '2018-08-01', open: 195.00, high: 200.00, low: 175.00, close: 180.00, volume: 45000000 },
        { dt: '2018-08-15', open: 180.00, high: 195.00, low: 170.00, close: 175.00, volume: 40000000 },
        { dt: '2018-09-01', open: 175.00, high: 185.00, low: 165.00, close: 170.00, volume: 35000000 },
        { dt: '2018-09-15', open: 170.00, high: 175.00, low: 150.00, close: 155.00, volume: 50000000 },
        { dt: '2018-09-20', open: 155.00, high: 165.00, low: 145.00, close: 150.00, volume: 55000000 },
        { dt: '2018-09-25', open: 150.00, high: 160.00, low: 140.00, close: 145.00, volume: 60000000 }
      ]
    }
  },
  {
    id: 'tech_10',
    type: 'technical',
    symbol: 'GME',
    stockName: 'GameStop',
    period: 'Jan 13 – Jan 25, 2021',
    correctAnswer: 'up',
    pattern: 'Bull Pennant',
    explanation: 'This is a Bull Pennant. After a massive vertical rally, the price squeezed into a tiny triangular shape. This signals the market is "coiling up" for another explosive move upwards.',
    data: {
      chartPeriod: '12 days',
      predictionDays: 5,
      candles: [
        { dt: '2021-01-13', open: 20.00, high: 35.00, low: 19.50, close: 31.40, volume: 80000000 },
        { dt: '2021-01-14', open: 31.40, high: 40.00, low: 30.00, close: 39.12, volume: 100000000 },
        { dt: '2021-01-15', open: 39.12, high: 43.00, low: 35.00, close: 35.50, volume: 125000000 },
        { dt: '2021-01-19', open: 35.50, high: 85.00, low: 34.00, close: 76.76, volume: 180000000 },
        { dt: '2021-01-20', open: 76.76, high: 95.00, low: 65.00, close: 65.01, volume: 200000000 },
        { dt: '2021-01-21', open: 65.01, high: 80.00, low: 61.00, close: 65.25, volume: 160000000 },
        { dt: '2021-01-22', open: 65.25, high: 85.00, low: 60.00, close: 79.25, volume: 140000000 },
        { dt: '2021-01-25', open: 79.25, high: 160.00, low: 75.00, close: 147.98, volume: 250000000 }
      ]
    }
  }
]

// Fundamental Analysis Quizzes
export const fundamentalQuizzes: PredefinedQuiz[] = [
  {
    id: 'fund_1',
    type: 'fundamental',
    symbol: 'NFLX',
    stockName: 'Netflix',
    period: 'Q1 2022 Earnings',
    correctAnswer: 'down',
    explanation: 'Sell! The growth story broke. Losing subscribers for the first time in a decade is a catastrophic signal for a growth stock. The stock fell 35% in a single day following this report.',
    data: {
      predictionDays: 30,
      snapshot: {
        date: '2022-04-19',
        eps: -0.23,
        expectedEps: 0.43,
        subscriberGrowth: -200000,
        totalSubscribers: 221640000,
        guidance: 'Expecting to lose 2M more subs next quarter',
        revenue: 7868000000,
        revenueGrowth: 9.8
      }
    }
  },
  {
    id: 'fund_2',
    type: 'fundamental',
    symbol: 'ZM',
    stockName: 'Zoom',
    period: 'Q1 2020 (Pandemic)',
    correctAnswer: 'up',
    explanation: 'Buy! This was a hyper-growth phase. When revenue and customer usage triple in a single quarter, the stock valuation usually chases the growth. Zoom rallied massively after these numbers.',
    data: {
      predictionDays: 30,
      snapshot: {
        date: '2020-06-02',
        eps: 0.20,
        revenue: 328200000,
        revenueGrowth: 169,
        customerGrowth: 354,
        enterpriseCustomers: 265400,
        product: 'Essential utility for global remote work',
        quarterlyRevenue: 328200000
      }
    }
  },
  {
    id: 'fund_3',
    type: 'fundamental',
    symbol: 'TGT',
    stockName: 'Target',
    period: 'May 2022',
    correctAnswer: 'down',
    explanation: 'Down. Even though they sold goods (Revenue), they made much less profit (Margins) because costs soared and they had too much unsold inventory. The stock crashed 25% in one day.',
    data: {
      predictionDays: 20,
      snapshot: {
        date: '2022-05-18',
        eps: 2.16,
        expectedEps: 2.86,
        revenue: 25170000000,
        expectedRevenue: 24490000000,
        operatingMargin: 5.3,
        previousOperatingMargin: 9.8,
        inventory: 15600000000,
        inventoryGrowth: 43,
        fuelCosts: 'Rising significantly',
        unsoldGoods: 'Bloated inventory levels'
      }
    }
  },
  {
    id: 'fund_4',
    type: 'fundamental',
    symbol: 'NVDA',
    stockName: 'NVIDIA',
    period: 'May 2023 (Q1 Earnings)',
    correctAnswer: 'up',
    explanation: 'Buy! The key here was the Guidance. Foreseeing 50% more revenue than Wall Street expected is virtually unheard of for a company this size. The stock jumped 24% overnight.',
    data: {
      predictionDays: 15,
      snapshot: {
        date: '2023-05-24',
        eps: 1.09,
        expectedEps: 0.92,
        revenue: 7188000000,
        expectedRevenue: 6500000000,
        guidanceRevenue: 11000000000,
        expectedGuidanceRevenue: 7000000000,
        guidanceBeat: 57,
        driver: 'Massive sudden demand for AI chips',
        dataCenterRevenue: 4284000000,
        dataCenterGrowth: 79
      }
    }
  },
  {
    id: 'fund_5',
    type: 'fundamental',
    symbol: 'PTON',
    stockName: 'Peloton',
    period: 'Nov 2021',
    correctAnswer: 'down',
    explanation: 'Down. A "triple threat" of bad news: growth is slowing, future guidance is cut drastically, and current users are using the product less. The stock lost 35% value immediately.',
    data: {
      predictionDays: 25,
      snapshot: {
        date: '2021-11-04',
        eps: -1.25,
        revenue: 805000000,
        fullYearGuidance: 4400000000,
        previousGuidance: 5400000000,
        guidanceCut: 1000000000,
        monthlyWorkoutsPerUser: 12.5,
        previousMonthlyWorkoutsPerUser: 17.8,
        growthRate: 'Slowing rapidly'
      }
    }
  },
  {
    id: 'fund_6',
    type: 'fundamental',
    symbol: 'AAPL',
    stockName: 'Apple',
    period: 'Jan 2007',
    correctAnswer: 'up',
    explanation: 'Buy! Markets love innovation that opens entirely new revenue streams. The iPhone announcement signaled Apple was moving from a "computer company" to a consumer electronics giant.',
    data: {
      predictionDays: 60,
      snapshot: {
        date: '2007-01-09',
        event: 'iPhone Announcement',
        product: 'The iPhone - 3 products in one (iPod, Phone, Internet)',
        marketShare: 0,
        innovation: 'Revolutionary touchscreen device',
        previousRevenue: 20370000000,
        newMarket: 'Mobile phone industry',
        stockPrice: 10.50
      }
    }
  },
  {
    id: 'fund_7',
    type: 'fundamental',
    symbol: 'ENE',
    stockName: 'Enron',
    period: 'Aug 2001',
    correctAnswer: 'down',
    explanation: 'Sell! When a CEO quits suddenly and financial reports are impossible to understand, it is a major red flag for fraud or hidden losses. The stock collapsed shortly after.',
    data: {
      predictionDays: 90,
      snapshot: {
        date: '2001-08-14',
        ceo: 'Jeff Skilling resigns unexpectedly',
        accounting: 'Concerns over "off-balance-sheet" partnerships',
        transparency: 'Financial statements are confusing and opaque',
        debtLevels: 'Hidden off-balance-sheet',
        redFlags: 'Sudden CEO departure, complex accounting structures',
        stockPrice: 35.50
      }
    }
  },
  {
    id: 'fund_8',
    type: 'fundamental',
    symbol: 'TSLA',
    stockName: 'Tesla',
    period: 'Q3 2019 Earnings',
    correctAnswer: 'up',
    explanation: 'Buy! Wall Street hated Tesla because they burned cash. The moment they posted a surprise profit and positive cash flow, the "bankruptcy thesis" died, and the stock began a legendary run.',
    data: {
      predictionDays: 30,
      snapshot: {
        date: '2019-10-23',
        eps: 1.86,
        expectedEps: -0.42,
        revenue: 6303000000,
        freeCashFlow: 1433000000,
        previousFreeCashFlow: -1420000000,
        profitabilityAchievement: 'First quarterly profit',
        cashFlowStatus: 'Positive Free Cash Flow',
        bankruptcy: 'Bankruptcy concerns resolved',
        vehicleProduction: 96155
      }
    }
  },
  {
    id: 'fund_9',
    type: 'fundamental',
    symbol: 'FB',
    stockName: 'Meta',
    period: 'Feb 2022',
    correctAnswer: 'down',
    explanation: 'Down. User growth stalled, and the company was burning billions on a project (Metaverse) with no immediate return, while their core ad business took a hit. The stock dropped 26%.',
    data: {
      predictionDays: 20,
      snapshot: {
        date: '2022-02-02',
        dailyActiveUsers: 1929000000,
        previousDailyActiveUsers: 1968000000,
        userGrowthChange: -0.002,
        metaverseInvestment: 10000000000,
        yearlyMetaverseInvestment: 10000000000,
        applePrivacyImpact: 'Hurt ad revenue targeting',
        revenueGrowth: 'Slowing significantly',
        adBusinessImpact: 'Negative impact from iOS changes'
      }
    }
  },
  {
    id: 'fund_10',
    type: 'fundamental',
    symbol: 'KO',
    stockName: 'Coca-Cola',
    period: '1988 (Buffett Entry)',
    correctAnswer: 'up',
    explanation: 'Buy! This is the classic "Value Investing" play. A dominant company with high returns on equity (ROE) trading at a fair price. It signaled a long-term steady uptrend.',
    data: {
      predictionDays: 365,
      snapshot: {
        date: '1988-01-01',
        peRatio: 15,
        roe: 30.5,
        brandStatus: 'Global Dominance',
        businessModel: 'Simple, repetitive consumption',
        marketPosition: 'Market leader in beverages',
        profitability: 'High and consistent',
        pricingPower: 'Strong brand pricing power',
        competitiveMoat: 'Wide economic moat'
      }
    }
  }
]