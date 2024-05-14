import { PercentRpeBased } from "./AutoRqgulation/PercentRpeBased/Impl";

export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case AutoRegulation.PercentRpeBased:
        return new PercentRpeBased().nextWeight();
    }
  }
}
