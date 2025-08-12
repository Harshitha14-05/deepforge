const backendURL = "http://localhost:5000";

console.log("Script loaded, fetching workflows...");

// Load saved workflows from backend and display them
function loadWorkflows() {
  fetch(`${backendURL}/api/workflows`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("Workflows loaded:", data);
      const list = document.getElementById("workflowList");
      list.innerHTML = "";
      if (data.length === 0) {
        list.innerHTML = "<li>No workflows saved yet.</li>";
        return;
      }
      data.forEach(wf => {
        const li = document.createElement("li");
        li.textContent = wf.name || "Unnamed Workflow";
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Error loading workflows:", err);
      alert("Failed to load workflows from backend.");
    });
}

// Call loadWorkflows on script load
loadWorkflows();

// Save workflow button click
document.getElementById("saveWorkflow").addEventListener("click", () => {
  const name = document.getElementById("workflowName").value.trim();
  const details = document.getElementById("workflowDetails").value.trim();

  if (!name) {
    alert("Please enter a workflow name.");
    return;
  }

  console.log("Saving workflow:", { name, details });

  fetch(`${backendURL}/api/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, details })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("Save response:", data);
    alert(data.message);
    // Clear input fields
    document.getElementById("workflowName").value = "";
    document.getElementById("workflowDetails").value = "";
    // Reload list
    loadWorkflows();
  })
  .catch(err => {
    console.error("Error saving workflow:", err);
    alert("Failed to save workflow.");
  });
});

// Train workflow button click
document.getElementById("trainWorkflow").addEventListener("click", () => {
  const name = document.getElementById("workflowName").value.trim();

  if (!name) {
    alert("Please enter a workflow name to train.");
    return;
  }

  console.log("Training workflow:", name);

  fetch(`${backendURL}/api/train`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workflowName: name })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("Train response:", data);
    alert(data.message);
  })
  .catch(err => {
    console.error("Error training workflow:", err);
    alert("Failed to start training.");
  });
});
