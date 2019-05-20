const CustomToken = artifacts.require("CustomToken");
const Users = artifacts.require("Users");

module.exports = function(deployer) {
  deployer.deploy(CustomToken);
};

module.exports = function(deployer) {
  deployer.deploy(Users);
};
