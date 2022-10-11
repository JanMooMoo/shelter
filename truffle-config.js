var HDWalletProvider = require("@truffle/hdwallet-provider");

var config = require("./config.json");

module.exports = {
	networks: {
		development: {
			host: "localhost",
			port: 7545,
			network_id: "*"
		},
		goerli: {
			provider: function () {
				return new HDWalletProvider(config.wallet, "https://goerli.infura.io/v3/" + config.infura,0)
			},
			network_id: 5,
			gas: 7000000,
			solc: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		}
	},
	compilers: {
    solc: {
      version: "0.4.24", // A version or constraint - Ex. "^0.5.0"
    }
  }
};
