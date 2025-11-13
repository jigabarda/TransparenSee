// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract BudgetTracker {
    address public admin;

    // ===== Department Structure =====
    struct Department {
        string name;
        address wallet;
        uint balance;
        bool exists;
    }

    uint public departmentCount;
    mapping(uint => Department) public departments; // indexed by ID
    mapping(address => uint) public departmentIds;  // to look up ID by address

    // ===== Spending Structure =====
    struct Spending {
        string purpose;
        uint amount;
    }

    mapping(address => Spending[]) public spendings;

    // ===== Events =====
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

    // ===== Register Department =====
    function registerDepartment(address wallet, string memory name) public onlyAdmin {
        require(wallet != address(0), "Invalid address");
        require(departmentIds[wallet] == 0, "Department already registered");

        departmentCount++;
        departments[departmentCount] = Department(name, wallet, 0, true);
        departmentIds[wallet] = departmentCount;

        emit DepartmentRegistered(wallet, name);
    }

    // ===== Allocate Budget =====
    function allocateBudget(address department, uint amount, string memory purpose) public onlyAdmin {
        uint id = departmentIds[department];
        require(id != 0, "Department not registered");
        departments[id].balance += amount;

        emit BudgetAllocated(department, amount, purpose);
    }

    // ===== Record Spending =====
    function recordSpending(address department, uint amount, string memory purpose) public onlyAdmin {
        uint id = departmentIds[department];
        require(id != 0, "Department not registered");
        require(departments[id].balance >= amount, "Insufficient funds");

        departments[id].balance -= amount;
        spendings[department].push(Spending(purpose, amount));

        emit SpendingRecorded(department, amount, purpose);
    }

    // ===== View Functions =====
    function getSpendingCount(address _wallet) public view returns (uint) {
        return spendings[_wallet].length;
    }

    function getSpending(address _wallet, uint index)
        public
        view
        returns (Spending memory)
    {
        require(index < spendings[_wallet].length, "Index out of range");
        return spendings[_wallet][index];
    }

    function getAllDepartments() public view returns (Department[] memory) {
        Department[] memory list = new Department[](departmentCount);
        for (uint i = 1; i <= departmentCount; i++) {
            list[i - 1] = departments[i];
        }
        return list;
    }
}
