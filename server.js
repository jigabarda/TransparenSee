const express = require("express");
const Web3 = require("web3");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to local blockchain
const web3 = new Web3("http://127.0.0.1:7545"); // Default Ganache port
const contractABI = require("./build/contracts/BudgetTracker.json").abi;
const contractAddress = "0xYourDeployedContractAddress";
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Replace with your Ganache admin account
const adminAccount = "0xYourAdminWalletAddress";

// Register department
app.post("/register-department", async (req, res) => {
  const { wallet, name } = req.body;
  try {
    await contract.methods
      .registerDepartment(wallet, name)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Department registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Allocate budget
app.post("/allocate", async (req, res) => {
  const { department, amount, purpose } = req.body;
  try {
    await contract.methods
      .allocateBudget(department, amount, purpose)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Budget allocated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record spending
app.post("/spend", async (req, res) => {
  const { department, amount, purpose } = req.body;
  try {
    await contract.methods
      .recordSpending(department, amount, purpose)
      .send({ from: adminAccount });
    res.json({ success: true, message: "Spending recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all budgets for a department
app.get("/budgets/:dept", async (req, res) => {
  const { dept } = req.params;
  try {
    const budgets = await contract.methods.getBudgets(dept).call();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () =>
  console.log(`Transparency API running on http://localhost:${port}`)
);
