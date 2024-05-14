class OneRepMaxCalculator {
  weight: number;
  repetitions: number;
  strat: E1RMFormula;

  constructor(weight: number, repetitions: number) {
    this.weight = weight;
    this.repetitions = repetitions;
  }

  // Epley Formula
  calculateEpley(): number {
    return this.weight * (1 + this.repetitions / 30);
  }

  // Brzycki Formula
  calculateBrzycki(): number {
    return this.weight / (1.0278 - 0.0278 * this.repetitions);
  }

  // Lombardi Formula
  calculateLombardi(): number {
    return this.weight * Math.pow(this.repetitions, 0.1);
  }

  // Mayhew et al. Formula
  calculateMayhew(): number {
    return this.weight * (100 / (101.3 - 2.67123 * this.repetitions));
  }

  // O'Conner et al. Formula
  calculateOConnor(): number {
    return this.weight * (1 + 0.025 * this.repetitions);
  }

  // Wathan Formula
  calculateWathan(): number {
    return (
      (100 * this.weight) / (48.8 + 53.8 * Math.exp(-0.075 * this.repetitions))
    );
  }

  calculate1rm(): number {
    switch (E1RMFormula) {
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
