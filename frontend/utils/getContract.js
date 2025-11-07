import Web3 from "web3";
import BudgetTracker from "../../build/contracts/BudgetTracker.json";

let web3;
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
} else {
  // fallback
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
  web3 = new Web3(provider);
}

const networkId = await web3.eth.net.getId();
const deployedNetwork = BudgetTracker.networks[networkId];

if (!deployedNetwork) {
  throw new Error("Contract not deployed on this network");
}

const contract = new web3.eth.Contract(
  BudgetTracker.abi,
  deployedNetwork.address
);

export { web3, contract };
