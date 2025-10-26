const SERVER_URL = "http://localhost:3000/tarefas";
let tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");

const el = {
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  priority: document.getElementById("priority"),
  completed: document.getElementById("completed"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  taskList: document.getElementById("taskList"),
};

function renderTasks() {
  el.taskList.innerHTML = "";
  tarefas.forEach((t) => {
    const div = document.createElement("div");
    div.className = "task" + (t.completed ? " completed" : "");
    div.innerHTML = `
      <strong>${t.title}</strong><br>
      ${t.description || ""}<br>
      Prioridade: ${t.priority}<br>
      <button onclick="toggleTask('${t.id}')">Concluir</button>
      <button onclick="deleteTask('${t.id}')">Excluir</button>
    `;
    el.taskList.appendChild(div);
  });
}

function saveLocal() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  renderTasks();
}

function addTask() {
  const title = el.title.value.trim();
  if (!title) return alert("Digite um título!");

  const newTask = {
    id: Date.now().toString(),
    title,
    description: el.description.value.trim(),
    priority: el.priority.value,
    completed: el.completed.value === "true",
  };

  tarefas.push(newTask);
  saveLocal();
  sendToServer(newTask);
  el.title.value = el.description.value = "";
  el.priority.value = "medium";
  el.completed.value = "false";
}

function deleteTask(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  saveLocal();
}

function toggleTask(id) {
  const t = tarefas.find((x) => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveLocal();
  sendToServer(t);
}

async function sendToServer(task) {
  try {
    const res = await fetch(SERVER_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) console.warn("Erro no servidor:", res.status);
  } catch (err) {
    console.warn("Falha de rede ou CORS:", err);
  }
}

el.saveBtn.addEventListener("click", addTask);
el.resetBtn.addEventListener("click", () => {
  el.title.value = el.description.value = "";
});

renderTasks();
