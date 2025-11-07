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

  // 🧩 Connect wallet and contract
  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setStatus("MetaMask not found. Please install it.");
          return;
        }

        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        let deployedNetwork = BudgetTracker.networks[networkId];

        // ✅ Manual fallback in case network mismatch
        if (!deployedNetwork) {
          deployedNetwork = {
            address: "0xcEfD5CF95423B229f335f0B18562C4019667E044", // 👈 Your deployed contract
          };
        }

        const instance = new web3.eth.Contract(
          BudgetTracker.abi,
          deployedNetwork.address
        );

        setContract(instance);
        setStatus("Contract connected successfully ✅");
      } catch (error) {
        console.error(error);
        setStatus("Contract not deployed on the current network ❌");
      }
    };

    init();
  }, []);

  // 🏢 Register Department
  const registerDepartment = async () => {
    if (contract && account) {
      try {
        await contract.methods
          .registerDepartment(departmentWallet, departmentName)
          .send({ from: account });
        alert("Department registered successfully!");
      } catch (error) {
        console.error(error);
        alert("Error registering department.");
      }
    }
  };

  // 💰 Allocate Budget
  const allocateBudget = async () => {
    if (contract && account) {
      try {
        await contract.methods
          .allocateBudget(departmentWallet, budgetAmount, budgetPurpose)
          .send({ from: account });
        alert("Budget allocated successfully!");
      } catch (error) {
        console.error(error);
        alert("Error allocating budget.");
      }
    }
  };

  // 🧾 Record Spending
  const recordSpending = async () => {
    if (contract && account) {
      try {
        await contract.methods
          .recordSpending(departmentWallet, spendAmount, spendPurpose)
          .send({ from: account });
        alert("Spending recorded successfully!");
      } catch (error) {
        console.error(error);
        alert("Error recording spending.");
      }
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

      {/* Register Department */}
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

      {/* Allocate Budget */}
      <h3>Allocate Budget</h3>
      <input
        type="text"
        placeholder="Amount"
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

      {/* Record Spending */}
      <h3>Record Spending</h3>
      <input
        type="text"
        placeholder="Amount"
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
