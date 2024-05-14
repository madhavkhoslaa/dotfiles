export interface IDexAgg {
  getNetworkDexes(Network: String): Number;
  // Returns DEX Chains based off base asset SOL => Radium
  getSupportedNetworks(): String[];
}
