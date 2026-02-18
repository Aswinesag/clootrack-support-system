import { useState } from "react";
import { createTicket, classifyDescription } from "../api";

function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const handleClassify = async () => {
    if (!description.trim()) return;

    setClassifying(true);
    const result = await classifyDescription(description);

    if (result.suggested_category) {
      setCategory(result.suggested_category);
    }

    if (result.suggested_priority) {
      setPriority(result.suggested_priority);
    }

    setClassifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newTicket = await createTicket({
      title,
      description,
      category,
      priority,
    });

    setLoading(false);

    if (newTicket.id) {
      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("low");

      onTicketCreated();
    }
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow mb-8 space-y-4" onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>

      <input
        type="text"
        placeholder="Title"
        maxLength={200}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border rounded-lg p-2"
      />

      <br /><br />

      <textarea
        placeholder="Describe your issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={handleClassify}
        required
        className="w-full border rounded-lg p-2"
      />

      {classifying && <p>Getting suggestions...</p>}

      <br />

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg p-2">
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <br /><br />

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}

export default TicketForm;