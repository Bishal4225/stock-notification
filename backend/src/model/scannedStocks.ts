import {
  getModelForClass,
  modelOptions,
  prop,
  index,
} from "@typegoose/typegoose";

export interface SRLevel {
  type: "R" | "S";
  UB: number;
  LB: number;
}

@modelOptions({
  schemaOptions: {
    collection: "scannedStocks",
    timestamps: true, // Adds createdAt and updatedAt fields
  },
})
@index({ stockSymbol: 1, scanDate: -1 }, { unique: true }) // Composite index for faster queries and uniqueness
export class ScannedStockClass {
  @prop({ required: true, type: String })
  public stockSymbol: string;

  @prop({ required: true, type: Date })
  public scanDate: Date;

  @prop({ required: true, type: () => [Object] as unknown as SRLevel[] })
  public levels: SRLevel[];

  @prop({ required: true, type: Number })
  public currentPrice: number;

  @prop({ required: true, type: String })
  public scanPeriod: string; // e.g., "Daily", "Weekly", "Monthly"

  @prop({ required: true, type: Number })
  public scanInterval: number; // The interval used for the scan
}

export type IScannedStock = ScannedStockClass & { id: string };
export const ScannedStockModel = getModelForClass(ScannedStockClass);
