export interface AutoRegulation {
  nextWeight(
    currentSetReps: Number,
    currentSetWeight: Number,
    nextSetReps: Number,
    nextSetWeight: Number
  ): Number;
}
