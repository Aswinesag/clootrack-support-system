import { useEffect, useState } from "react";
import { getStats } from "../api";

function StatsDashboard({ refresh }) {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  if (!stats) return <p>Loading stats...</p>;

  return (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard title="Total Tickets" value={stats.total_tickets} />
      <StatCard title="Open Tickets" value={stats.open_tickets} />
      <StatCard title="Avg / Day" value={stats.avg_tickets_per_day} />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Breakdown title="Priority Breakdown" data={stats.priority_breakdown} />
      <Breakdown title="Category Breakdown" data={stats.category_breakdown} />
    </div>
  </div>
);
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Breakdown({ title, data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-3">{title}</h3>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between border-b py-1">
          <span className="capitalize">{key}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "8px",
  width: "180px",
  textAlign: "center",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

export default StatsDashboard;