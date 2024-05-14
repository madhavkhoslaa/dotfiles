import { AutoRegulation } from "../IAutoRegulation";

export class PercentRpeBased implements AutoRegulation {
  nextWeight(): Number {
    throw new Error("Method not implemented.");
  }
}
