const CustomToken = artifacts.require("CustomToken");
const LoyaltyProgram = artifacts.require("LoyaltyProgram");

module.exports = function(deployer) {
  deployer.deploy(CustomToken);
  deployer.deploy(LoyaltyProgram);
};
