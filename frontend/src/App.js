import React, { useEffect, useState } from "react";
import Web3 from "web3";
import BudgetTracker from "./contracts/BudgetTracker.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Connecting to blockchain...");
  const [departments, setDepartments] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");

  // Inputs
  const [departmentWallet, setDepartmentWallet] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetPurpose, setBudgetPurpose] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendPurpose, setSpendPurpose] = useState("");

  // Connect blockchain
  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setStatus("🦊 MetaMask not found. Please install it.");
          return;
        }

        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        let deployedNetwork = BudgetTracker.networks[networkId];

        if (!deployedNetwork) {
          deployedNetwork = {
            address: "0xe92dB5a906c15849B5d8E13Be13611eAF42e0080",
          };
        }

        const instance = new web3.eth.Contract(
          BudgetTracker.abi,
          deployedNetwork.address
        );

        setContract(instance);
        setStatus("✅ Connected to blockchain");

        await fetchDepartments(instance);
      } catch (error) {
        console.error(error);
        setStatus("❌ Could not connect to blockchain");
      }
    };
    init();
  }, []);

  // Register Department
  const registerDepartment = async () => {
    try {
      await contract.methods
        .registerDepartment(departmentWallet, departmentName)
        .send({ from: account });
      alert("✅ Department registered!");
      fetchDepartments(contract);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to register department.");
    }
  };

  // Allocate Budget
  const allocateBudget = async () => {
    try {
      const amountWei = Web3.utils.toWei(budgetAmount, "ether");
      await contract.methods
        .allocateBudget(departmentWallet, amountWei, budgetPurpose)
        .send({ from: account });
      alert("✅ Budget allocated!");
      fetchDepartments(contract);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to allocate budget.");
    }
  };

  // Record Spending
  const recordSpending = async () => {
    try {
      const amountWei = Web3.utils.toWei(spendAmount, "ether");
      await contract.methods
        .recordSpending(departmentWallet, amountWei, spendPurpose)
        .send({ from: account });
      alert("✅ Spending recorded!");
      fetchDepartments(contract);
      fetchSpendings(contract, departmentWallet);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to record spending.");
    }
  };

  // Fetch Departments
  const fetchDepartments = async (instance) => {
    try {
      const count = await instance.methods.departmentCount().call();
      const list = [];
      for (let i = 1; i <= count; i++) {
        const dep = await instance.methods.departments(i).call();
        list.push({
          id: i,
          name: dep.name,
          wallet: dep.wallet,
          balance: Web3.utils.fromWei(dep.balance, "ether"),
        });
      }
      setDepartments(list);
    } catch (err) {
      console.error("Fetch departments failed:", err);
    }
  };

  // Fetch Spendings for specific wallet
  const fetchSpendings = async (instance, wallet) => {
    try {
      const count = await instance.methods.getSpendingCount(wallet).call();
      const list = [];
      for (let i = 0; i < count; i++) {
        const s = await instance.methods.getSpending(wallet, i).call();
        list.push({
          purpose: s.purpose,
          amount: Web3.utils.fromWei(s.amount, "ether"),
        });
      }
      setSpendings(list);
      setSelectedWallet(wallet);
    } catch (err) {
      console.error("Fetch spendings failed:", err);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Georgia, serif" }}>
      <h1>📊 Budget Tracker Dashboard</h1>
      <p>
        <b>Connected:</b> {account || "Not connected"}
      </p>
      <p>
        <b>Status:</b> {status}
      </p>
      <hr />

      {/* Department Registration */}
      <h2>🏢 Register Department</h2>
      <input
        placeholder="Department Wallet"
        value={departmentWallet}
        onChange={(e) => setDepartmentWallet(e.target.value)}
      />
      <input
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <button onClick={registerDepartment}>Register</button>

      <hr />

      {/* Allocate Budget */}
      <h2>💰 Allocate Budget</h2>
      <input
        placeholder="Department Wallet"
        value={departmentWallet}
        onChange={(e) => setDepartmentWallet(e.target.value)}
      />
      <input
        placeholder="Amount (ETH)"
        value={budgetAmount}
        onChange={(e) => setBudgetAmount(e.target.value)}
      />
      <input
        placeholder="Purpose"
        value={budgetPurpose}
        onChange={(e) => setBudgetPurpose(e.target.value)}
      />
      <button onClick={allocateBudget}>Allocate</button>

      <hr />

      {/* Record Spending */}
      <h2>🧾 Record Spending</h2>
      <input
        placeholder="Department Wallet"
        value={departmentWallet}
        onChange={(e) => setDepartmentWallet(e.target.value)}
      />
      <input
        placeholder="Amount (ETH)"
        value={spendAmount}
        onChange={(e) => setSpendAmount(e.target.value)}
      />
      <input
        placeholder="Purpose"
        value={spendPurpose}
        onChange={(e) => setSpendPurpose(e.target.value)}
      />
      <button onClick={recordSpending}>Record</button>

      <hr />

      {/* Department List */}
      <h2>🏛️ Registered Departments</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Wallet</th>
            <th>Balance (ETH)</th>
            <th>View Spending</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.id}</td>
              <td>{dep.name}</td>
              <td>{dep.wallet}</td>
              <td>{dep.balance}</td>
              <td>
                <button onClick={() => fetchSpendings(contract, dep.wallet)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Spending List */}
      {spendings.length > 0 && (
        <>
          <h2>💸 Spending for Wallet: {selectedWallet}</h2>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Amount (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {spendings.map((s, i) => (
                <tr key={i}>
                  <td>{s.purpose}</td>
                  <td>{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
