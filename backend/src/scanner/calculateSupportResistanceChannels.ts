import { OHLCData } from "../types/index";

export interface SRLevel {
  type: "R" | "S";
  UB: number;
  LB: number;
}
interface SRCheckResult {
  isNear: boolean;
  nearestLevel?: SRLevel;
  distancePercentage: number;
  pricePosition: "above" | "below" | "within";
  nextSupport?: number;
  nextResistance?: number;
}

interface TradeInfo {
  idealTarget: number;
  stopLoss: number;
  riskRewardRatio: number;
}

export class SupportResistanceCalculator {
  private prd: number = 5; // Pivot Period
  private loopback: number = 250; // Loopback Period
  private channelW: number = 4; // Maximum Channel Width %
  private minStrength: number = 2; // Minimum Strength
  private maxNumSR: number = 12; // Maximum Number of S/R
  private currentPrice: number;

  constructor(private data: OHLCData, currentPrice?: number) {
    this.currentPrice = currentPrice ?? this.getLastClosePrice();
  }

  private getLastClosePrice(): number {
    if (this.data.c.length === 0) {
      throw new Error("No closing price data available");
    }

    return this.data.c[this.data.c.length - 1];
  }

  public calculateLevels(): SRLevel[] {
    if (!this.isValidData()) {
      return [];
    }

    const lastCandles = this.getLastCandles();
    const pivotVals = this.getPivotVals(lastCandles.h, lastCandles.l);
    const cwidth = this.calculateChannelWidth(pivotVals);

    const supres = this.calculateSupRes(pivotVals, cwidth);
    const sortedSupRes = this.sortSupRes(supres);

    return this.formatSupportResistanceLevels(sortedSupRes);
  }

  private isValidData(): boolean {
    return this.data.t.length > 0 && this.data.t.length === this.data.c.length;
  }

  private getLastCandles(): {
    h: number[];
    l: number[];
    c: number[];
    o: number[];
  } {
    return {
      h: this.data.h.slice(-this.loopback),
      l: this.data.l.slice(-this.loopback),
      c: this.data.c.slice(-this.loopback),
      o: this.data.o.slice(-this.loopback),
    };
  }

  private getPivotVals(highs: number[], lows: number[]): number[] {
    let pivotVals: number[] = [];
    for (let x = this.prd; x < highs.length - this.prd; x++) {
      if (
        highs[x] >= Math.max(...highs.slice(x - this.prd, x + this.prd + 1))
      ) {
        pivotVals.push(highs[x]);
      }
      if (lows[x] <= Math.min(...lows.slice(x - this.prd, x + this.prd + 1))) {
        pivotVals.push(lows[x]);
      }
    }
    return pivotVals;
  }

  private calculateChannelWidth(pivotVals: number[]): number {
    const prdhighest: number = Math.max(...pivotVals);
    const prdlowest: number = Math.min(...pivotVals);
    return ((prdhighest - prdlowest) * this.channelW) / 100;
  }

  private calculateSupRes(pivotVals: number[], cwidth: number): number[] {
    let supres: number[] = [];
    for (let x = 0; x < pivotVals.length; x++) {
      let [hi, lo, strength] = this.getSRVals(pivotVals, cwidth, x);
      supres.push(strength);
      supres.push(hi);
      supres.push(lo);
    }

    for (let x = 0; x < pivotVals.length; x++) {
      let h: number = supres[x * 3 + 1];
      let l: number = supres[x * 3 + 2];
      let s: number = 0;
      for (let y = 0; y < 500 && y < this.data.h.length; y++) {
        if (
          (this.data.h[y] <= h && this.data.h[y] >= l) ||
          (this.data.l[y] <= h && this.data.l[y] >= l) ||
          (this.data.o[y] <= h && this.data.o[y] >= l) ||
          (this.data.c[y] <= h && this.data.c[y] >= l)
        ) {
          s += 1;
        }
      }
      supres[x * 3] += s;
    }

    return supres;
  }

  private getSRVals(
    pivotVals: number[],
    cwidth: number,
    ind: number
  ): [number, number, number] {
    let lo: number = pivotVals[ind];
    let hi: number = lo;
    let numpp: number = 0;
    for (let y = 0; y < pivotVals.length; y++) {
      let cpp: number = pivotVals[y];
      let wdth: number = cpp <= hi ? hi - cpp : cpp - lo;
      if (wdth <= cwidth) {
        if (cpp <= hi) {
          lo = Math.min(lo, cpp);
        } else {
          hi = Math.max(hi, cpp);
        }
        numpp += 20;
      }
    }
    return [hi, lo, numpp];
  }

  private sortSupRes(supres: number[]): number[] {
    let sortedSupRes: number[] = new Array(20).fill(0);
    let stren: number[] = Array(10).fill(0);
    let src: number = 0;

    for (let x = 0; x < supres.length / 3; x++) {
      let stv: number = -1;
      let stl: number = -1;
      for (let y = 0; y < supres.length / 3; y++) {
        if (supres[y * 3] > stv && supres[y * 3] >= this.minStrength * 20) {
          stv = supres[y * 3];
          stl = y;
        }
      }
      if (stl >= 0) {
        let hh: number = supres[stl * 3 + 1];
        let ll: number = supres[stl * 3 + 2];
        sortedSupRes[src * 2] = hh;
        sortedSupRes[src * 2 + 1] = ll;
        stren[src] = supres[stl * 3];

        for (let y = 0; y < supres.length / 3; y++) {
          if (
            (supres[y * 3 + 1] <= hh && supres[y * 3 + 1] >= ll) ||
            (supres[y * 3 + 2] <= hh && supres[y * 3 + 2] >= ll)
          ) {
            supres[y * 3] = -1;
          }
        }
        src += 1;
        if (src >= 10) {
          break;
        }
      }
    }

    // Sort by strength
    for (let x = 0; x < 8; x++) {
      for (let y = x + 1; y < 9; y++) {
        if (stren[y] > stren[x]) {
          [stren[y], stren[x]] = [stren[x], stren[y]];
          [sortedSupRes[x * 2], sortedSupRes[y * 2]] = [
            sortedSupRes[y * 2],
            sortedSupRes[x * 2],
          ];
          [sortedSupRes[x * 2 + 1], sortedSupRes[y * 2 + 1]] = [
            sortedSupRes[y * 2 + 1],
            sortedSupRes[x * 2 + 1],
          ];
        }
      }
    }

    return sortedSupRes;
  }

  private formatSupportResistanceLevels(sortedSupRes: number[]): SRLevel[] {
    let supportResistanceLevels: SRLevel[] = [];
    for (let x = 0; x < Math.min(9, this.maxNumSR); x++) {
      let type: "R" | "S" =
        sortedSupRes[x * 2] > this.currentPrice &&
        sortedSupRes[x * 2 + 1] > this.currentPrice
          ? "R"
          : sortedSupRes[x * 2] < this.currentPrice &&
            sortedSupRes[x * 2 + 1] < this.currentPrice
          ? "S"
          : this.currentPrice > sortedSupRes[x * 2 + 1]
          ? "R"
          : "S";

      supportResistanceLevels.push({
        type: type,
        LB: sortedSupRes[x * 2 + 1],
        UB: sortedSupRes[x * 2],
      });
    }
    return supportResistanceLevels;
  }

  public checkNearSupportOrResistance(
    threshold: number = 0.02,
    levels: SRLevel[]
  ): SRCheckResult {
    let nearestLevel: SRLevel | undefined;
    let smallestDistance = Infinity;
    let nextSupport: number | undefined;
    let nextResistance: number | undefined;

    for (const level of levels) {
      const distanceUB =
        Math.abs(this.currentPrice - level.UB) / this.currentPrice;
      const distanceLB =
        Math.abs(this.currentPrice - level.LB) / this.currentPrice;
      const distance = Math.min(distanceUB, distanceLB);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestLevel = level;
      }

      if (
        level.type === "S" &&
        level.UB < this.currentPrice &&
        (nextSupport === undefined || level.UB > nextSupport)
      ) {
        nextSupport = level.UB;
      }
      if (
        level.type === "R" &&
        level.LB > this.currentPrice &&
        (nextResistance === undefined || level.LB < nextResistance)
      ) {
        nextResistance = level.LB;
      }
    }

    const isNear = smallestDistance <= threshold;
    let pricePosition: "above" | "below" | "within" = "within";

    if (nearestLevel) {
      if (this.currentPrice > nearestLevel.UB) {
        pricePosition = "above";
      } else if (this.currentPrice < nearestLevel.LB) {
        pricePosition = "below";
      }
    }

    return {
      isNear,
      nearestLevel: isNear ? nearestLevel : undefined,
      distancePercentage: smallestDistance * 100,
      pricePosition,
      nextSupport,
      nextResistance,
    };
  }
  public calculateTradeInfo(): TradeInfo {
    const levels = this.calculateLevels();
    let prevSupport: number | undefined;
    let prevResistance: number | undefined;
    let nextSupport: number | undefined;
    let nextResistance: number | undefined;

    for (const level of levels) {
      if (level.type === "S") {
        if (level.UB < this.currentPrice) {
          prevSupport =
            prevSupport === undefined
              ? level.UB
              : Math.max(prevSupport, level.UB);
        } else {
          nextSupport =
            nextSupport === undefined
              ? level.LB
              : Math.min(nextSupport, level.LB);
        }
      } else {
        // Resistance
        if (level.LB > this.currentPrice) {
          nextResistance =
            nextResistance === undefined
              ? level.LB
              : Math.min(nextResistance, level.LB);
        } else {
          prevResistance =
            prevResistance === undefined
              ? level.UB
              : Math.max(prevResistance, level.UB);
        }
      }
    }

    let stopLoss: number;
    let idealTarget: number;

    if (prevSupport && prevResistance) {
      if (
        this.currentPrice - prevSupport <
        prevResistance - this.currentPrice
      ) {
        // Closer to support, consider it a buy signal
        stopLoss = prevSupport * 0.99; // 1% below support
        idealTarget =
          nextResistance ??
          this.currentPrice + (this.currentPrice - prevSupport) * 2;
      } else {
        // Closer to resistance, consider it a sell signal
        stopLoss = prevResistance * 1.01; // 1% above resistance
        idealTarget =
          nextSupport ??
          this.currentPrice - (prevResistance - this.currentPrice) * 2;
      }
    } else if (prevSupport) {
      // Only support found, consider it a buy signal
      stopLoss = prevSupport * 0.99;
      idealTarget =
        nextResistance ??
        this.currentPrice + (this.currentPrice - prevSupport) * 2;
    } else if (prevResistance) {
      // Only resistance found, consider it a sell signal
      stopLoss = prevResistance * 1.01;
      idealTarget =
        nextSupport ??
        this.currentPrice - (prevResistance - this.currentPrice) * 2;
    } else {
      // No previous levels found, use a default 2% stop loss and 4% target
      stopLoss = this.currentPrice * 0.98;
      idealTarget = this.currentPrice * 1.04;
    }

    const riskRewardRatio = Math.abs(
      (idealTarget - this.currentPrice) / (stopLoss - this.currentPrice)
    );

    return {
      idealTarget,
      stopLoss,
      riskRewardRatio,
    };
  }
}
