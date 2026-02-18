const API_BASE = "http://127.0.0.1:8000/api";

export async function getTickets(params = "") {
  const res = await fetch(`${API_BASE}/tickets/${params}`);
  return res.json();
}

export async function createTicket(data) {
  const res = await fetch(`${API_BASE}/tickets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function classifyDescription(description) {
  const res = await fetch(`${API_BASE}/tickets/classify/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/tickets/stats/`);
  return res.json();
}