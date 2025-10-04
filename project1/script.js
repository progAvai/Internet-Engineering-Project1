const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAll');
const counter = document.getElementById('counter');
const searchInput = document.getElementById('searchInput');
const filter = document.getElementById('filter');
const themeToggle = document.getElementById('themeToggle');

// === ذخیره و مدیریت کارها ===
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      done: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  updateCounter();
}

function addTask(text, done = false) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;

  span.addEventListener('dblclick', () => {
    const newText = prompt('ویرایش کار:', span.textContent);
    if (newText) {
      span.textContent = newText;
      saveTasks();
    }
  });

  span.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
    applyFilters();
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = 'حذف';
  delBtn.addEventListener('click', () => {
    li.remove();
    saveTasks();
    applyFilters();
  });

  if (done) li.classList.add('completed');

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
  saveTasks();
  applyFilters();
}

addBtn.addEventListener('click', () => {
  if (taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = '';
  }
});

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    taskInput.value = '';
  }
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('آیا مطمئنی همه‌ی کارها حذف شوند؟')) {
    taskList.innerHTML = '';
    saveTasks();
  }
});

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem('tasks') || '[]');
  saved.forEach(t => addTask(t.text, t.done));
}

function updateCounter() {
  const total = document.querySelectorAll('#taskList li').length;
  counter.textContent = `${total} کار`;
}

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const filterValue = filter.value;

  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('span').textContent.toLowerCase();
    const isDone = li.classList.contains('completed');
    let visible = true;

    if (!text.includes(query)) visible = false;
    if (filterValue === 'done' && !isDone) visible = false;
    if (filterValue === 'todo' && isDone) visible = false;

    li.style.display = visible ? 'flex' : 'none';
  });
}

searchInput.addEventListener('input', applyFilters);
filter.addEventListener('change', applyFilters);

// === مدیریت تم تیره/روشن ===
function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = "☀ حالت روشن";
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = "🌙 حالت تیره";
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  loadTheme();
});

// === بارگذاری اولیه ===
loadTasks();
loadTheme();
