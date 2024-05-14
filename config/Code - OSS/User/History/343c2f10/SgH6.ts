export class e1rmService {
  static epleyFormula(weight: number, reps: number): number {
    return weight * (1 + reps / 30);
  }
  static BrzyckiFormula(weight: number, reps: number): number {
    return weight / (1.0278 - 0.0278 * reps);
  }
  static LombardiFormula(weight: number, reps: number): number {
    return weight * Math.pow(reps, 0.1);
  }
  static MayhewFormula(weight: number, reps: number): number {
    return weight * (100 / (101.3 - 2.67123 * reps));
  }
  static WathanFormula(weight: number, reps: number): number {
    return (100 * weight) / (48.8 + 53.8 * Math.pow(2.71, -0.075 * reps));
  }
}
