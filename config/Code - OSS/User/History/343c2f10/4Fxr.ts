class e1rmService {
  epleyFormula(weight: number, reps: number): number {
    return weight * (1 + reps / 30);
  }
  BrzyckiFormula(weight: number, reps: number): number {
    return weight / (1.0278 - 0.0278 * reps);
  }
  LombardiFormula(weight: number, reps: number): number {}
  MayhewFormula(weight: number, reps: number): number {}
  WathanFormula(weight: number, reps: number): number {}
}
