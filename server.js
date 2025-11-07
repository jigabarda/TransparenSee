const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to local Ganache blockchain
const web3 = new Web3("http://127.0.0.1:7545");

// Load compiled contract ABI and address
const contractJSON = require("./build/contracts/BudgetTracker.json");
const contractABI = contractJSON.abi;

// ⚠️ Replace with the actual deployed address after running "truffle migrate"
const contractAddress = "0xYourDeployedContractAddress";
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Replace with your Ganache admin account (first account in Ganache UI)
const adminAccount = "0xYourAdminWalletAddress";

// 🏛 Register Department
app.post("/register-department", async (req, res) => {
  const { wallet, name } = req.body;
  try {
    await contract.methods
      .registerDepartment(wallet, name)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Department registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 Allocate Budget
app.post("/allocate", async (req, res) => {
  const { department, amount, purpose } = req.body;
  try {
    await contract.methods
      .allocateBudget(department, amount, purpose)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Budget allocated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧾 Record Spending
app.post("/spend", async (req, res) => {
  const { department, amount, purpose } = req.body;
  try {
    await contract.methods
      .recordSpending(department, amount, purpose)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Spending recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Get all Budgets
app.get("/budgets/:dept", async (req, res) => {
  const { dept } = req.params;
  try {
    const budgets = await contract.methods.getBudgets(dept).call();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Transparency API running on http://localhost:${port}`);
});
