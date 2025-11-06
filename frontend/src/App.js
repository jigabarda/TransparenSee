import React, { useState } from "react";
import axios from "axios";

function App() {
  const [department, setDepartment] = useState("");
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/budgets/${department}`
      );
      setBudgets(res.data);
    } catch (err) {
      alert("Failed to fetch budgets");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 TransparentGov Dashboard</h1>
      <input
        className="border p-2 w-full"
        placeholder="Enter Department Address"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
      <button
        onClick={fetchBudgets}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Budgets
      </button>

      <div className="mt-6">
        {budgets.length > 0 ? (
          budgets.map((b, i) => (
            <div key={i} className="p-3 border-b">
              <p>
                <b>Purpose:</b> {b.purpose}
              </p>
              <p>
                <b>Allocated:</b> {b.allocatedAmount}
              </p>
              <p>
                <b>Spent:</b> {b.spentAmount}
              </p>
              <p>
                <b>Date:</b> {new Date(b.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No budgets found</p>
        )}
      </div>
    </div>
  );
}

export default App;
