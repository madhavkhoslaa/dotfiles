import { AutoRegulation } from "../types/AutoRegulation";
export class AutoRegulationService {
  public static AutoRegulate(type: AutoRegulation): Number {
    switch (type) {
      case PROJECTED1RMBASEDPERCENTAGE:
        return 1;
    }
  }
}
