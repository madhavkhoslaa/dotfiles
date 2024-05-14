import { PercentRpeBased } from "./AutoRqgulation/PercentRpeBased/Impl";
export enum AutoRegulation {
  PROJECTED1RMBASEDPERCENTAGE = "PROJECTED1RMBASEDPERCENTAGE",
}

export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case type.PROJECTED1RMBASEDPERCENTAGE:
        return new PercentRpeBased().nextWeight();
    }
  }
}
