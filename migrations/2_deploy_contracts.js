const BudgetTracker = artifacts.require("BudgetTracker");

module.exports = function (deployer) {
  deployer.deploy(BudgetTracker);
};
