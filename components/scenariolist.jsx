import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/scenarios");
      setScenarios(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadReport = async (id, name) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/report/generate",
        { email: "test@example.com", scenario_id: id },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name}_report.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Saved Scenarios</h2>
      {scenarios.length === 0 && <p>No scenarios saved yet.</p>}
      <ul className="space-y-3">
        {scenarios.map((s) => (
          <li key={s.id} className="flex justify-between items-center bg-gray-50 p-3 rounded shadow">
            <span className="font-medium">{s.scenario_name}</span>
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
              onClick={() => downloadReport(s.id, s.scenario_name)}
            >
              Download Report
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
