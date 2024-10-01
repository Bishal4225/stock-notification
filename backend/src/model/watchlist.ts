import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { UserClass } from "./user";

@modelOptions({
  schemaOptions: {
    collection: "watchlists",
  },
})
export class WatchlistClass {
  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: false, type: () => [String] })
  public stockSymbols: string[];

  @prop({ required: true, ref: () => UserClass })
  public user: Ref<UserClass>;

  @prop({ type: Date, default: Date.now })
  public dateCreated: Date;

  @prop({ type: Date })
  public lastUpdated?: Date;
}

export type IWatchlist = WatchlistClass & { _id: string };
export const WatchlistModel = getModelForClass(WatchlistClass);
