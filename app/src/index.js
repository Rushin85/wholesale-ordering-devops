const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for now
let items = [];

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/items", (req, res) => {
  res.json(items);
});

app.post("/items", (req, res) => {
  const { name, quantity, notes } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  const item = {
    id: Date.now().toString(),
    name,
    quantity: quantity || 1,
    notes: notes || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  items.push(item);
  res.status(201).json(item);
});

app.patch("/items/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["pending", "ordered", "delivered"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "invalid status" });
  }

  const item = items.find((i) => i.id === id);
  if (!item) {
    return res.status(404).json({ error: "not found" });
  }

  item.status = status;
  res.json(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Wholesale API listening on port ${port}`);
});
