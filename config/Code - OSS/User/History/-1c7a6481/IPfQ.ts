abstract class AutoRegulation {
  abstract nextWeight(
    currentSetReps: Number,
    currentSetWeight: Number,
    nextSetReps: Number,
    nextSetWeight: Number
  ): Number;
}
