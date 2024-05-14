import { PercentRpeBased } from "./AutoRqgulation/PercentRpeBased/Impl";
export enum AutoRegulation {
  PROJECTED1RMBASEDPERCENTAGE = "1",
}

export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case type.1:
        return new PercentRpeBased().nextWeight();
    }
  }
}
