import { log } from "console";

export class e1rmService {
  epleyFormula(weight: number, reps: number): number {
    return weight * (1 + reps / 30);
  }
  BrzyckiFormula(weight: number, reps: number): number {
    return weight / (1.0278 - 0.0278 * reps);
  }
  LombardiFormula(weight: number, reps: number): number {
    return weight * Math.pow(reps, 0.1);
  }
  MayhewFormula(weight: number, reps: number): number {
    return weight * (100 / (101.3 - 2.67123 * reps));
  }
  WathanFormula(weight: number, reps: number): number {
    return (100 * weight) / (48.8 + 53.8 * Math.pow(2.71, -0.075 * reps));
  }
  static calculate1rm(logic: E1RMFormula, weight: number, reps: number) {
    switch (logic) {
      case E1RMFormula.Epley: {
        return this.epleyFormula(weight, reps);
      }
      case E1RMFormula.Brzycki: {
      }
      case E1RMFormula.Lombardi: {
      }
      case E1RMFormula.Mayhew: {
      }
      case E1RMFormula.Wathan: {
      }
      case E1RMFormula.Default: {
      }
    }
  }
}

export enum E1RMFormula {
  Epley,
  Brzycki,
  Lombardi,
  Mayhew,
  Wathan,
  Default,
}
