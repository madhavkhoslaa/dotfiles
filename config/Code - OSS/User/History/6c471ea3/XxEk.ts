export interface IDexAgg {
  getNetworkDexes(baseAsset: String): Number;
  // Returns DEX Chains based off base asset SOL => Radium
  getSupportedNetworks(): String[];
}
