// Configuration for addresses of externally deployed smart contracts
// prettier-ignore
const BondedECDSAKeepFactoryAddress = "0xD9C3E217E0fAAB0faE52CACA4603bA154Ab44680"

// Medianized price feeds.
// These are deployed and maintained by Maker.
// See: https://github.com/makerdao/oracles-v2#live-mainnet-oracles

// addresses for sake of local network
const ETHBTCMedianizer = "0x0A6858f2E0f2b42DbDD21D248DA589478c507Cdd" // New oracle

const RopstenETHBTCPriceFeed = "0xD26baCcD39D6bbC847303A4db021Fd2F0481B33d"

module.exports = {
  BondedECDSAKeepFactoryAddress,
  ETHBTCMedianizer,
  RopstenETHBTCPriceFeed,
}
