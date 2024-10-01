import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

export enum StockType {
  SIDEWAYS = "SIDEWAYS",
  UP = "UP",
  DOWN = "DOWN",
}

@modelOptions({
  schemaOptions: {
    collection: "capturedStocks",
  },
})
export class CapturedStockClass {
  @prop({ required: true, type: String })
  public stockSymbol: string;

  @prop({ required: true, type: Date })
  public dateCaptured: Date;

  @prop({ required: true, type: Number })
  public change: number;

  @prop({ required: true, type: Number })
  public changeAbs: number;

  @prop({ required: true, type: String })
  public stockType: StockType;
}

export type ICapturedStock = CapturedStockClass & { id: string };
export const CapturedStockModel = getModelForClass(CapturedStockClass);
