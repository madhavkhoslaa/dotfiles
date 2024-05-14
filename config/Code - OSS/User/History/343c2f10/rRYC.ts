export enum E1RMFormula {
  Epley = "Epley",
  Brzycki = "Brzycki",
  Lombardi = "Lombardi",
  Mayhew = "Mayhew",
  Wathan = "Wathan",
}

export class OneRepMaxCalculator {
  weight: number;
  repetitions: number;
  formula: E1RMFormula;

  constructor(
    weight: number,
    repetitions: number,
    formula: E1RMFormula = E1RMFormula.Default
  ) {
    this.weight = weight;
    this.repetitions = repetitions;
    this.formula = formula;
  }

  calculate1RM(): number {
    switch (this.formula) {
      case E1RMFormula.Epley:
        return this.calculateEpley();
      case E1RMFormula.Brzycki:
        return this.calculateBrzycki();
      case E1RMFormula.Lombardi:
        return this.calculateLombardi();
      case E1RMFormula.Mayhew:
        return this.calculateMayhew();
      case E1RMFormula.Wathan:
        return this.calculateWathan();
      default:
        return this.calculateBrzycki();
    }
  }

  private calculateEpley(): number {
    console.log("calculateEpley");
    return this.weight * (1 + this.repetitions / 30);
  }

  private calculateBrzycki(): number {
    console.log("calculateBrzycki");
    return this.weight / (1.0278 - 0.0278 * this.repetitions);
  }

  private calculateLombardi(): number {
    console.log("calculateLombardi");
    return this.weight * Math.pow(this.repetitions, 0.1);
  }

  private calculateMayhew(): number {
    console.log("calculateMayhew");
    return this.weight * (100 / (101.3 - 2.67123 * this.repetitions));
  }

  private calculateWathan(): number {
    console.log("calculateWathan");
    return (
      (100 * this.weight) / (48.8 + 53.8 * Math.exp(-0.075 * this.repetitions))
    );
  }
}
