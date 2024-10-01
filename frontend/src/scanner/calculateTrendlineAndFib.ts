export interface OHLCData {
  s: string;
  t: number[];
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
}

export class TrendlineFibonacciCalculator {
  private phIndex: number[] = [];
  private plIndex: number[] = [];
  private phValue: number[] = [];
  private plValue: number[] = [];

  constructor(
    private length: number = 21,
    private maxPivotPoints: number = 5,
    private minDifference: number = 0.0,
    private channelExtLength: number = 14
  ) {}

  // TA functions
  private pivotHigh(
    high: number[],
    leftBars: number,
    rightBars: number
  ): number | null {
    const mid = high.length - 1 - leftBars;
    const highValue = high[mid];
    for (let i = mid - leftBars; i <= mid + rightBars; i++) {
      if (i !== mid && high[i] >= highValue) {
        return null;
      }
    }
    return highValue;
  }

  private pivotLow(
    low: number[],
    leftBars: number,
    rightBars: number
  ): number | null {
    const mid = low.length - 1 - leftBars;
    const lowValue = low[mid];
    for (let i = mid - leftBars; i <= mid + rightBars; i++) {
      if (i !== mid && low[i] <= lowValue) {
        return null;
      }
    }
    return lowValue;
  }

  private rsi(values: number[], period: number): number {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < period; i++) {
      const difference = values[i] - values[i - 1];
      if (difference > 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    return 100 - 100 / (1 + avgGain / avgLoss);
  }

  private interp(l: number, h: number, s: number): number {
    return l + (h - l) * s;
  }

  calculate(data: OHLCData): void {
    const { h: high, l: low, c: close } = data;

    for (let i = this.length; i < high.length; i++) {
      const ph = this.pivotHigh(high.slice(0, i + 1), this.length, this.length);
      if (ph !== null) {
        let ok = true;
        const phValue = high[i - this.length];

        if (this.phIndex.length > 0) {
          if (this.phIndex.length >= this.maxPivotPoints) {
            this.phIndex.shift();
            this.phValue.shift();
          }

          for (let j = 0; j < this.phValue.length; j++) {
            if (Math.abs(phValue - this.phValue[j]) < this.minDifference) {
              ok = false;
              if (phValue > this.phValue[j]) {
                this.phValue[j] = phValue;
                this.phIndex[j] = i - this.length;
              }
            }
          }
        }

        if (ok) {
          this.phIndex.push(i - this.length);
          this.phValue.push(phValue);
        }
      }

      const pl = this.pivotLow(low.slice(0, i + 1), this.length, this.length);
      if (pl !== null) {
        let ok = true;
        const plValue = low[i - this.length];

        if (this.plIndex.length > 0) {
          if (this.plIndex.length >= this.maxPivotPoints) {
            this.plIndex.shift();
            this.plValue.shift();
          }

          for (let j = 0; j < this.plValue.length; j++) {
            if (Math.abs(plValue - this.plValue[j]) < this.minDifference) {
              ok = false;
              if (plValue < this.plValue[j]) {
                this.plValue[j] = plValue;
                this.plIndex[j] = i - this.length;
              }
            }
          }
        }

        if (ok) {
          this.plIndex.push(i - this.length);
          this.plValue.push(plValue);
        }
      }
    }
  }

  getTrendlines(): { upper: number[]; lower: number[] } {
    let upperTrendline: number[] = [];
    let lowerTrendline: number[] = [];

    if (this.phValue.length > 1) {
      const upperSlope =
        (this.phValue[this.phValue.length - 1] - this.phValue[0]) /
        (this.phIndex[this.phIndex.length - 1] - this.phIndex[0]);
      const upperIntercept = this.phValue[0] - upperSlope * this.phIndex[0];

      upperTrendline = this.phIndex.map(
        (index) => upperSlope * index + upperIntercept
      );
    }

    if (this.plValue.length > 1) {
      const lowerSlope =
        (this.plValue[this.plValue.length - 1] - this.plValue[0]) /
        (this.plIndex[this.plIndex.length - 1] - this.plIndex[0]);
      const lowerIntercept = this.plValue[0] - lowerSlope * this.plIndex[0];

      lowerTrendline = this.plIndex.map(
        (index) => lowerSlope * index + lowerIntercept
      );
    }

    return { upper: upperTrendline, lower: lowerTrendline };
  }

  getFibonacciLevels(fibLevels: number[]): {
    retracement: number[][];
    extension: number[][];
  } {
    const trendlines = this.getTrendlines();
    const retracement: number[][] = [];
    const extension: number[][] = [];

    if (trendlines.upper.length > 0 && trendlines.lower.length > 0) {
      const start = Math.min(this.phIndex[0], this.plIndex[0]);
      const end =
        Math.max(
          this.phIndex[this.phIndex.length - 1],
          this.plIndex[this.plIndex.length - 1]
        ) + this.channelExtLength;

      for (const level of fibLevels) {
        const retracementLine: number[] = [];
        const extensionLine: number[] = [];

        for (let i = start; i <= end; i++) {
          const upperValue =
            trendlines.upper[i - start] ||
            trendlines.upper[trendlines.upper.length - 1];
          const lowerValue =
            trendlines.lower[i - start] ||
            trendlines.lower[trendlines.lower.length - 1];

          retracementLine.push(this.interp(lowerValue, upperValue, level));
          extensionLine.push(this.interp(lowerValue, upperValue, 1 + level));
        }

        retracement.push(retracementLine);
        extension.push(extensionLine);
      }
    }

    return { retracement, extension };
  }

  getChannelFill(data: OHLCData): number {
    const { c: close } = data;
    return this.rsi(close.slice(-14), 14);
  }
}

// // Usage example:
// const calculator = new TrendlineFibonacciCalculator();
// const data: OHLCData = {
//   s: "BTCUSD",
//   t: [
//     /* timestamps */
//   ],
//   o: [
//     /* open prices */
//   ],
//   h: [
//     /* high prices */
//   ],
//   l: [
//     /* low prices */
//   ],
//   c: [
//     /* close prices */
//   ],
//   v: [
//     /* volumes */
//   ],
// };

// calculator.calculate(data);
// const trendlines = calculator.getTrendlines();
// const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
// const fibonacciLevels = calculator.getFibonacciLevels(fibLevels);
// const channelFill = calculator.getChannelFill(data);

// console.log("Trendlines:", trendlines);
// console.log("Fibonacci Levels:", fibonacciLevels);
// console.log("Channel Fill:", channelFill);
