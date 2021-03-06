require("babel-register")
require("babel-polyfill")

/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

const HDWalletProvider = require("@truffle/hdwallet-provider")

const mnemonic =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    local: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    development: {
      host: "localhost", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
      //  gas: 100000000000000,
      gasPrice: 1,
    },
    sov: {
      provider: function () {
        return new HDWalletProvider(
          ['2d61b31f93df83e90e78b61943019f3d03fd9f31901359a0e065a4c896eee23d',
          '5957857a88b0ab23b4f2ddd2108e99a114bca0bfe94f0fb5e503a22905e6088f',
          '3c53f81b6e3da8a4818a33554bfef1eec57d45c252550c8ac1593de6f0148c46',
          '0ab212d7bae1f220699eaa40ec84e97a032382a6c0e42c73b1931eb9474a0e1e',
          '79861b19d809f940b4d91cc8ce42c804c4591b324352f037d831aa3a1fb223c9'],          
          'wss://testnet.sovryn.app/ws',
          0, 
          5
        )
      },
      websockets: true,
      gas: 6700000,
      gasPrice: 70000000,
      skipDryRun: false,
      network_id: '*',
      timeoutBlocks: 200,
      deploymentPollingInterval: 4000,
      disableConfirmationListener: true,
    },
    // local: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       "4526476adb17c8f751fc4e71e23c4f5e7e2013cd62417b63825cb6cde8a42627",
    //       "HTTP://127.0.0.1:8545",
    //     )
    //   },
    //   gas: 6700000,
    //   gasPrice: 80000000,
    //   skipDryRun: false,
    //   network_id: "*",
    //   timeoutBlocks: 50,
    //   deploymentPollingInterval: 1000,
    // },
    keep_dev: {
      provider: function() {
        return new HDWalletProvider(
          process.env.CONTRACT_OWNER_ETH_ACCOUNT_PRIVATE_KEY,
          "http://localhost:8545",
        )
      },
      gas: 6721975,
      network_id: 1101,
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.CONTRACT_OWNER_ETH_ACCOUNT_PRIVATE_KEY,
          "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5",
        )
      },
      gas: 6721975,
      network_id: 3,
    },

    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/")
      },
      network_id: 1,
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    useColors: true,
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      gasPrice: 21,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.17",
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
}
