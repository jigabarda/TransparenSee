// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BudgetTracker {
    struct Budget {
        uint256 allocatedAmount;
        uint256 spentAmount;
        string purpose;
        uint256 timestamp;
    }

    struct Department {
        string name;
        address wallet;
    }

    mapping(address => Department) public departments;
    mapping(address => Budget[]) public budgets;

    address public admin;

    event DepartmentRegistered(address wallet, string name);
    event BudgetAllocated(address department, uint256 amount, string purpose);
    event SpendingRecorded(address department, uint256 amount, string purpose);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a government department
    function registerDepartment(address _wallet, string memory _name) public onlyAdmin {
        departments[_wallet] = Department(_name, _wallet);
        emit DepartmentRegistered(_wallet, _name);
    }

    // Allocate a budget for a department
    function allocateBudget(address department, uint256 amount, string memory purpose) public onlyAdmin {
        budgets[department].push(Budget(amount, 0, purpose, block.timestamp));
        emit BudgetAllocated(department, amount, purpose);
    }

    // Record spending
    function recordSpending(address department, uint256 amount, string memory purpose) public onlyAdmin {
        require(budgets[department].length > 0, "No budget allocated");

        Budget storage latest = budgets[department][budgets[department].length - 1];
        require(latest.spentAmount + amount <= latest.allocatedAmount, "Over budget");

        latest.spentAmount += amount;
        emit SpendingRecorded(department, amount, purpose);
    }

    // View latest budget
    function viewBudget(address department) public view returns (uint256 allocated, uint256 spent, string memory purpose) {
        require(budgets[department].length > 0, "No budget allocated");
        Budget memory b = budgets[department][budgets[department].length - 1];
        return (b.allocatedAmount, b.spentAmount, b.purpose);
    }

    // Get all budgets for transparency
    function getBudgets(address department) public view returns (Budget[] memory) {
        return budgets[department];
    }
}
