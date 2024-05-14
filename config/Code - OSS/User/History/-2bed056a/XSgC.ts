export interface IDex {
  ListGetPairs(baseAsset: String, TopAsset: String): String[];
  // Returns (Sol, Kai), (Sol, Mew)
}
