import { useState } from "react";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import StatsDashboard from "./components/StatsDashboard";

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleTicketCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Support Ticket System
        </h1>

        <StatsDashboard refresh={refresh} />
        <TicketForm onTicketCreated={handleTicketCreated} />
        <TicketList refresh={refresh} />
      </div>
    </div>
  );
}

export default App;