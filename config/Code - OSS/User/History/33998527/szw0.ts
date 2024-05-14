import { AutoRegulation } from "../types/AutoRegulationTypes";
import { PercentRpeBased } from "./AutoRqgulation/PercentRpeBased/Impl";
export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case type.PRO:
        return new PercentRpeBased().nextWeight();
    }
  }
}
