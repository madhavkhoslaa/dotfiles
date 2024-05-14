export interface IDexAgg {
  getNetworkDexes(Network: String): String[];
  // Returns DEX Chains based off base asset SOL => Radium
  getSupportedNetworks(): String[];
}
