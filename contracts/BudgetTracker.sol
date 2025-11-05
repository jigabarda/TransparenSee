// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BudgetTracker {
    struct Budget {
        uint256 allocatedAmount;
        uint256 spentAmount;
        string department;
        uint256 timestamp;
    }
    
    mapping(address => Budget[]) public budgets;
    address public admin;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can add budgets");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Allocate a new budget to a department
    function allocateBudget(address departmentAddress, uint256 amount, string memory departmentName) public onlyAdmin {
        budgets[departmentAddress].push(Budget(amount, 0, departmentName, block.timestamp));
    }

    // Record spending for a department
    function recordSpending(address departmentAddress, uint256 amount) public onlyAdmin {
        require(amount > 0, "Spending amount must be greater than zero");
        
        Budget[] storage deptBudgets = budgets[departmentAddress];
        uint256 budgetCount = deptBudgets.length;
        
        // Make sure there is an allocated budget for the department
        require(budgetCount > 0, "No budget allocated for this department");
        
        Budget storage deptBudget = deptBudgets[budgetCount - 1];
        require(deptBudget.allocatedAmount >= deptBudget.spentAmount + amount, "Exceeds allocated budget");
        
        deptBudget.spentAmount += amount;
    }

    // View budget for a department
    function viewBudget(address departmentAddress) public view returns (uint256 allocated, uint256 spent) {
        Budget[] storage deptBudgets = budgets[departmentAddress];
        uint256 budgetCount = deptBudgets.length;
        
        if (budgetCount > 0) {
            Budget storage deptBudget = deptBudgets[budgetCount - 1];
            return (deptBudget.allocatedAmount, deptBudget.spentAmount);
        } else {
            return (0, 0);
        }
    }
}
