import { useEffect, useState } from "react";
import { getTickets, updateTicket } from "../api";

function TicketList({ refresh }) {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchTickets = async () => {
    let query = "?";

    if (search) query += `search=${search}&`;
    if (statusFilter) query += `status=${statusFilter}&`;

    const data = await getTickets(query);
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, [refresh, search, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    await updateTicket(id, { status: newStatus });
    fetchTickets();
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl" style={{ marginTop: "40px" }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Tickets</h2>

          <div className="flex justify-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No tickets found.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{ticket.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {ticket.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{ticket.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm text-gray-500">
                  <span><strong>Category:</strong> <span className="capitalize">{ticket.category}</span></span>
                  <span><strong>Priority:</strong> <span className="capitalize">{ticket.priority}</span></span>
                </div>

                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(ticket.id, e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketList;