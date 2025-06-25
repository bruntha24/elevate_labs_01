let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function getImageForTask(text) {
  const t = text.toLowerCase();
  if (t.includes("wine")) return "https://cdn-icons-png.flaticon.com/512/3378/3378605.png";
  if (t.includes("study") || t.includes("read") || t.includes("book")) return "https://cdn-icons-png.flaticon.com/512/2232/2232688.png";
  if (t.includes("makeup") || t.includes("lipstick") || t.includes("beauty")) return "https://cdn-icons-png.flaticon.com/512/3048/3048395.png";
  if (t.includes("movie") || t.includes("film")) return "https://cdn-icons-png.flaticon.com/512/1028/1028927.png";
  if (t.includes("play") || t.includes("music") || t.includes("game")) return "https://cdn-icons-png.flaticon.com/512/3103/3103446.png";
  if (t.includes("workout") || t.includes("exercise") || t.includes("gym")) return "https://cdn-icons-png.flaticon.com/512/3534/3534068.png";
  if (t.includes("meeting") || t.includes("call") || t.includes("zoom")) return "https://cdn-icons-png.flaticon.com/512/3595/3595455.png";
  if (t.includes("party") || t.includes("celebration") || t.includes("event")) return "https://cdn-icons-png.flaticon.com/512/2934/2934156.png";
  return "https://cdn-icons-png.flaticon.com/512/845/845646.png";
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 2000);
}

function updateTaskCounter() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  document.getElementById("taskInfo").textContent = `✅ ${done} of ${total} tasks done`;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const taskLeft = document.createElement("div");
    taskLeft.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    const img = document.createElement("img");
    img.src = task.icon;
    img.className = "task-icon";

    const span = document.createElement("span");
    span.textContent = task.text;

    taskLeft.appendChild(checkbox);
    taskLeft.appendChild(img);
    taskLeft.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteTask(index);

    li.appendChild(taskLeft);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
  updateTaskCounter();
}

let undoTimer = null;
let deletedTask = null;

function deleteTask(index) {
  deletedTask = tasks.splice(index, 1)[0];
  saveTasks();
  renderTasks();

  const undoArea = document.getElementById("undoArea");
  undoArea.innerHTML = `<span>🗑️ Task deleted</span> <button id="undoBtn">Undo</button>`;
  undoTimer = setTimeout(() => {
    undoArea.innerHTML = "";
    deletedTask = null;
  }, 5000);

  document.getElementById("undoBtn").onclick = () => {
    clearTimeout(undoTimer);
    if (deletedTask) {
      tasks.push(deletedTask);
      deletedTask = null;
      saveTasks();
      renderTasks();
      undoArea.innerHTML = "";
    }
  };
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (!taskText) return;

  const task = {
    text: taskText,
    icon: getImageForTask(taskText),
    completed: false
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = "";
  showPopup();
}

renderTasks();
