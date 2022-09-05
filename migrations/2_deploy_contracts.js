var KadenaRegistration = artifacts.require("KadenaRegistration");
var KadenaNeed= artifacts.require("KadenaNeed");
var KadenaGive= artifacts.require("KadenaGive");


module.exports = function(deployer) {
	deployer.deploy(KadenaRegistration);
	deployer.deploy(KadenaNeed);
	deployer.deploy(KadenaGive);
	
};
