import React, { useState } from "react";
import axios from "axios";

export default function SimulationForm({ onSave }) {
  const [formData, setFormData] = useState({
    scenario_name: "",
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimulate = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/simulate", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Simulation failed. Is backend running?");
    }
  };

  const handleSave = async () => {
    if (!result) return alert("Run simulation first!");
    try {
      await axios.post("http://127.0.0.1:8000/scenarios", formData);
      onSave();
      alert("Scenario saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Simulation</h2>
      <div className="grid grid-cols-1 gap-3">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="font-medium">{key}</label>
            <input
              className="border rounded p-2 mt-1"
              type={key.includes("name") ? "text" : "number"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSimulate}
        >
          Simulate
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleSave}
        >
          Save Scenario
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <p>Monthly Savings: <span className="font-bold">${result.monthly_savings}</span></p>
          <p>Payback Months: <span className="font-bold">{result.payback_months}</span></p>
          <p>ROI %: <span className="font-bold">{result.roi_percentage}</span></p>
        </div>
      )}
    </div>
  );
}
