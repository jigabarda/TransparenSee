import { useState, useEffect } from "react";
import { loadWeb3 } from "../utils/web3";

export default function Home() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [department, setDepartment] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const { web3, contract, account } = await loadWeb3();
        setContract(contract);
        setAccount(account);
        setStatus("Connected to blockchain!");
      } catch (err) {
        setStatus(err.message);
      }
    };
    init();
  }, []);

  const registerDepartment = async () => {
    await contract.methods
      .registerDepartment(department, departmentName)
      .send({ from: account });
    setStatus("Department registered successfully!");
  };

  const allocateBudget = async () => {
    await contract.methods
      .allocateBudget(department, amount, purpose)
      .send({ from: account });
    setStatus("Budget allocated successfully!");
  };

  const recordSpending = async () => {
    await contract.methods
      .recordSpending(department, amount, purpose)
      .send({ from: account });
    setStatus("Spending recorded!");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>🧾 Budget Tracker Dashboard</h1>
      <p>Connected account: {account}</p>
      <p>Status: {status}</p>

      <hr />

      <h2>Register Department</h2>
      <input
        placeholder="Department Wallet"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <input
        placeholder="Department Name"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
      />
      <button onClick={registerDepartment}>Register</button>

      <hr />

      <h2>Allocate Budget</h2>
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Purpose"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />
      <button onClick={allocateBudget}>Allocate</button>

      <hr />

      <h2>Record Spending</h2>
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Purpose"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />
      <button onClick={recordSpending}>Record</button>
    </div>
  );
}
