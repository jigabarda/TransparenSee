// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract BudgetTracker {
    address public admin;

    struct Department {
        string name;
        bool exists;
    }

    mapping(address => Department) public departments;

    struct Allocation {
        uint amount;
        uint spent;
        string purpose;
    }

    mapping(address => Allocation[]) public allocations;

    event DepartmentRegistered(address department, string name);
    event BudgetAllocated(address department, uint amount, string purpose);
    event SpendingRecorded(address department, uint amount, string purpose);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerDepartment(address wallet, string memory name) public onlyAdmin {
        require(!departments[wallet].exists, "Department already registered");
        departments[wallet] = Department(name, true);
        emit DepartmentRegistered(wallet, name);
    }

    function allocateBudget(address department, uint amount, string memory purpose) public onlyAdmin {
        require(departments[department].exists, "Department not registered");
        allocations[department].push(Allocation(amount, 0, purpose));
        emit BudgetAllocated(department, amount, purpose);
    }

    function recordSpending(address department, uint amount, string memory purpose) public onlyAdmin {
        require(departments[department].exists, "Department not registered");
        require(allocations[department].length > 0, "No allocations available");
        Allocation storage last = allocations[department][allocations[department].length - 1];
        require(last.spent + amount <= last.amount, "Insufficient funds");
        last.spent += amount;
        emit SpendingRecorded(department, amount, purpose);
    }

    function getBudgets(address department) public view returns (Allocation[] memory) {
        return allocations[department];
    }
}
