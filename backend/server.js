import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let workflows = [];
if (fs.existsSync("workflows.json")) {
  workflows = JSON.parse(fs.readFileSync("workflows.json", "utf8"));
}

app.get("/", (req, res) => {
  res.send("DeepForge backend is running. Use /api/workflows to get workflows.");
});

app.get("/api/workflows", (req, res) => {
  res.json(workflows);
});

app.post("/api/workflows", (req, res) => {
  const newWorkflow = req.body;
  workflows.push(newWorkflow);
  fs.writeFileSync("workflows.json", JSON.stringify(workflows, null, 2));
  res.json({ message: "Workflow saved successfully", workflow: newWorkflow });
});

app.post("/api/train", (req, res) => {
  const { workflowName } = req.body;
  res.json({ message: `Training started for workflow: ${workflowName}`, status: "in-progress" });

  setTimeout(() => {
    console.log(`Training completed for: ${workflowName}`);
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`✅ DeepForge Backend running on http://localhost:${PORT}`);
});
