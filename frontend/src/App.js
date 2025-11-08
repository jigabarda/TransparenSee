import React, { useEffect, useState } from "react";
import Web3 from "web3";
import BudgetTracker from "./contracts/BudgetTracker.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Connecting to blockchain...");
  const [departmentWallet, setDepartmentWallet] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetPurpose, setBudgetPurpose] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendPurpose, setSpendPurpose] = useState("");

  // 🧩 Initialize Web3 + Smart Contract
  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setStatus("🦊 MetaMask not detected. Please install it.");
          return;
        }

        // Connect MetaMask
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Detect Ganache local network
        const networkId = await web3.eth.net.getId();
        console.log("Connected network ID:", networkId);

        // Retrieve deployed contract info
        let deployedNetwork = BudgetTracker.networks[networkId];
        if (!deployedNetwork) {
          console.warn(
            "⚠️ No matching network in ABI file. Using fallback address..."
          );
          deployedNetwork = {
            address: "0xF4e4Fbe497c969fBaccEd655edd547c359A28ebD", // <== Replace with your latest deployed contract address
          };
        }

        // Load contract instance
        const instance = new web3.eth.Contract(
          BudgetTracker.abi,
          deployedNetwork && deployedNetwork.address
        );

        setContract(instance);
        setStatus("✅ Connected to Ganache & Smart Contract");
      } catch (error) {
        console.error("Connection error:", error);
        setStatus("❌ Failed to connect to blockchain or contract.");
      }
    };

    init();
  }, []);

  // 🏢 Register Department
  const registerDepartment = async () => {
    if (!contract || !account) return alert("Contract not connected.");
    try {
      await contract.methods
        .registerDepartment(departmentWallet, departmentName)
        .send({ from: account });
      alert("✅ Department registered successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error registering department.");
    }
  };

  // 💰 Allocate Budget
  const allocateBudget = async () => {
    if (!contract || !account) return alert("Contract not connected.");
    try {
      const amountWei = Web3.utils.toWei(budgetAmount, "ether");
      await contract.methods
        .allocateBudget(departmentWallet, amountWei, budgetPurpose)
        .send({ from: account });
      alert("✅ Budget allocated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error allocating budget.");
    }
  };

  // 🧾 Record Spending
  const recordSpending = async () => {
    if (!contract || !account) return alert("Contract not connected.");
    try {
      const amountWei = Web3.utils.toWei(spendAmount, "ether");
      await contract.methods
        .recordSpending(departmentWallet, amountWei, spendPurpose)
        .send({ from: account });
      alert("✅ Spending recorded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error recording spending.");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "serif" }}>
      <h1>📘 Budget Tracker Dashboard</h1>
      <p>
        <b>Connected account:</b> {account || "Not connected"}
      </p>
      <p>
        <b>Status:</b> {status}
      </p>
      <hr />

      {/* 🏢 Register Department */}
      <h3>Register Department</h3>
      <input
        type="text"
        placeholder="Department Wallet"
        value={departmentWallet}
        onChange={(e) => setDepartmentWallet(e.target.value)}
      />
      <input
        type="text"
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <button onClick={registerDepartment}>Register</button>

      <hr />

      {/* 💰 Allocate Budget */}
      <h3>Allocate Budget</h3>
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={budgetAmount}
        onChange={(e) => setBudgetAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Purpose"
        value={budgetPurpose}
        onChange={(e) => setBudgetPurpose(e.target.value)}
      />
      <button onClick={allocateBudget}>Allocate</button>

      <hr />

      {/* 🧾 Record Spending */}
      <h3>Record Spending</h3>
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={spendAmount}
        onChange={(e) => setSpendAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Purpose"
        value={spendPurpose}
        onChange={(e) => setSpendPurpose(e.target.value)}
      />
      <button onClick={recordSpending}>Record</button>
    </div>
  );
}

export default App;
