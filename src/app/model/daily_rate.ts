import { Currency } from "./currency";

export class DailyRate {
    constructor(
      public id : number,
      public date: Date,
      public rateLcy: number,
      public last_update : Date,
      public ccy : Currency,

    ) {}
 }
