const BudgetTracker = artifacts.require("BudgetTracker");
const Test = artifacts.require("Test"); // optional, only if you have Test.sol

module.exports = async function (deployer, network, accounts) {
  console.log("🚀 Deploying contracts to network:", network);

  // Deploy main BudgetTracker contract
  await deployer.deploy(BudgetTracker);
  const budgetTracker = await BudgetTracker.deployed();
  console.log("✅ BudgetTracker deployed at:", budgetTracker.address);

  // (Optional) Deploy Test contract if you have one
  await deployer.deploy(Test);
  const test = await Test.deployed();
  console.log("✅ Test contract deployed at:", test.address);

  console.log("🎯 Deployment complete!");
};
