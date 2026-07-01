// ---------- State ----------
let tasks = []; // each task: { id, text, completed }
let currentFilter = 'all';

// ---------- DOM References ----------
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const itemsLeft = document.getElementById('itemsLeft');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---------- Add Task ----------
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  const newTask = {
    id: Date.now(), // simple unique id
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = '';
  taskInput.focus();
  render();
}

addBtn.addEventListener('click', addTask);

// Allow pressing Enter to add a task
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

// ---------- Event Delegation for task list (toggle complete / delete) ----------
taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;

  const id = Number(taskItem.dataset.id);

  if (e.target.classList.contains('checkbox')) {
    toggleComplete(id);
  }

  if (e.target.classList.contains('delete-btn')) {
    deleteTask(id);
  }
});

function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

// ---------- Filters ----------
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

function getFilteredTasks() {
  if (currentFilter === 'active') {
    return tasks.filter((task) => !task.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter((task) => task.completed);
  }
  return tasks;
}

// ---------- Render ----------
function render() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'empty-state';
    emptyMsg.textContent =
      tasks.length === 0 ? 'No tasks yet. Add one above!' : 'No tasks in this view.';
    taskList.appendChild(emptyMsg);
  } else {
    filteredTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `task-item${task.completed ? ' completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <span class="checkbox"></span>
        <span class="task-text"></span>
        <button class="delete-btn" aria-label="Delete task">✕</button>
      `;

      // Set text via textContent to avoid injecting raw HTML from user input
      li.querySelector('.task-text').textContent = task.text;

      taskList.appendChild(li);
    });
  }

  const activeCount = tasks.filter((task) => !task.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;
}

// Initial render
render();
