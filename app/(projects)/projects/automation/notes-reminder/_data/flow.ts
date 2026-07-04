export const FLOW_NODES = [
  {
    id: "1",
    data: { label: "Pending Notes" },
    position: { x: 0, y: 0 },
    style: { background: "#fca5a5", padding: "10px", borderRadius: "5px" },
  },
  {
    id: "2",
    data: { label: "Collect (09:00 UTC)" },
    position: { x: 200, y: 0 },
    style: { background: "#93c5de", padding: "10px", borderRadius: "5px" },
  },
  {
    id: "3",
    data: { label: "reminders_history" },
    position: { x: 400, y: 0 },
    style: { background: "#bbf7d0", padding: "10px", borderRadius: "5px" },
  },
];

export const FLOW_EDGES = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];
