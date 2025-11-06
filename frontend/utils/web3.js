import Web3 from "web3";
import BudgetTrackerArtifact from "../../build/contracts/BudgetTracker.json";

let web3;
let contract;
let selectedAccount;

export const loadWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = BudgetTrackerArtifact.networks[networkId];

    if (!deployedNetwork) {
      throw new Error("Contract not deployed on the current network");
    }

    contract = new web3.eth.Contract(
      BudgetTrackerArtifact.abi,
      deployedNetwork.address
    );

    return { web3, contract, account: selectedAccount };
  } else {
    throw new Error("No Ethereum provider found. Please install MetaMask.");
  }
};
