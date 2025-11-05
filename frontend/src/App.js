import React, { useState, useEffect } from "react";
import Web3 from "web3";

function App() {
  const [allocated, setAllocated] = useState(0);
  const [spent, setSpent] = useState(0);
  const [departmentAddress, setDepartmentAddress] = useState("");

  const web3 = new Web3(window.ethereum);
  const contractABI = [
    /* ABI goes here */
  ]; // Same ABI as in backend
  const contractAddress = "0xYourContractAddress";
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  useEffect(() => {
    window.ethereum.request({ method: "eth_requestAccounts" }); // MetaMask login
  }, []);

  const fetchBudget = async () => {
    try {
      const result = await contract.methods
        .viewBudget(departmentAddress)
        .call();
      setAllocated(result[0]);
      setSpent(result[1]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>TransparentGov Dashboard</h1>
      <input
        type="text"
        placeholder="Department Address"
        value={departmentAddress}
        onChange={(e) => setDepartmentAddress(e.target.value)}
      />
      <button onClick={fetchBudget}>Check Budget</button>

      <div>
        <h3>Allocated Budget: {allocated}</h3>
        <h3>Spent Budget: {spent}</h3>
      </div>
    </div>
  );
}

export default App;
