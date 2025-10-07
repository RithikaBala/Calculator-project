import React, { useState } from "react";
import "./App.css";

function App() {
  const [inputs, setInputs] = useState({
    monthly_invoice_volume: "",
    num_ap_staff: "",
    avg_hours_per_invoice: "",
    hourly_wage: "",
    error_rate_manual: "",
    error_cost: "",
    time_horizon_months: "",
    one_time_implementation_cost: "",
  });

  const inputOrder = [
    "monthly_invoice_volume",
    "num_ap_staff",
    "avg_hours_per_invoice",
    "hourly_wage",
    "error_rate_manual",
    "error_cost",
    "time_horizon_months",
    "one_time_implementation_cost",
  ];

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSimulate = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return;
    }

    const data = await response.json();
    console.log("Backend response:", data); // Check this
    setResults(data);
  } catch (error) {
    console.error("Simulation error:", error);
  }
};


  return (
    <div className="container">
      <h1>ROI Simulator</h1>

      <div className="input-grid">
        {inputOrder.map((key) => (
          <div key={key} className="input-group">
            <label>{key.replace(/_/g, " ").toUpperCase()}</label>
            <input
              type="number"
              name={key}
              value={inputs[key]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button onClick={handleSimulate}>Simulate</button>
      </div>

      {results && (
        <div className="results">
          <h2>Simulation Results</h2>
          <ul>
            <li>
              <strong>Monthly Savings:</strong> ${results.monthly_savings}
            </li>
            <li>
              <strong>Cumulative Savings:</strong> ${results.cumulative_savings}
            </li>
            <li>
              <strong>Net Savings:</strong> ${results.net_savings}
            </li>
            <li>
              <strong>Payback (months):</strong> {results.payback_months}
            </li>
            <li>
              <strong>ROI (%):</strong> {results.roi_percentage}%
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
