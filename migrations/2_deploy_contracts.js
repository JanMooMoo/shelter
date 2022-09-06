var Shelter = artifacts.require("Shelter");


module.exports = function(deployer,network, accounts) {
	deployer.deploy(Shelter,{from: accounts[0]});
   };

