const BudgetTracker = artifacts.require("BudgetTracker");

module.exports = async function (deployer) {
  await deployer.deploy(BudgetTracker);
};
