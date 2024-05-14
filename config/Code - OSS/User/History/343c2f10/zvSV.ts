export class e1rmService {
  calculateEpley(weight: number, repetitions: number): number {
    return weight * (1 + repetitions / 30);
  }

  // Brzycki Formula
  calculateBrzycki(weight: number, repetitions: number): number {
    return weight / (1.0278 - 0.0278 * repetitions);
  }

  // Lombardi Formula
  calculateLombardi(weight: number, repetitions: number): number {
    return weight * Math.pow(repetitions, 0.1);
  }

  // Mayhew et al. Formula
  calculateMayhew(weight: number, repetitions: number): number {
    return weight * (100 / (101.3 - 2.67123 * repetitions));
  }

  // O'Conner et al. Formula
  calculateOConnor(weight: number, repetitions: number): number {
    return weight * (1 + 0.025 * repetitions);
  }

  // Wathan Formula
  calculateWathan(weight: number, repetitions: number): number {
    return (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * repetitions));
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
