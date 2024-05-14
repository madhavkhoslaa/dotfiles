import { AutoRegulation } from "../types/AutoRegulation";
import { PercentRpeBased } from "./AutoRqgulation/PercentRpeBased/Impl";
export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case type.:
        return new PercentRpeBased().nextWeight();
    }
  }
}
