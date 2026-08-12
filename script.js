const defaultTasks = [
  'Auditorium Booking', 'Temple Enquiry', 'Guruvayur Room Booking',
  'Makeup Booking', 'Photography Booking', 'Travel Arrangements', 'Dress',
  'Gold', 'Catering Booking', 'Event Management Booking'
];

const checklist = document.querySelector('#checklist');
const form = document.querySelector('#addForm');
const input = document.querySelector('#newItem');
const newDate = document.querySelector('#newDate');
const progressLabel = document.querySelector('#progressLabel');
const progressPercent = document.querySelector('#progressPercent');
const progressBar = document.querySelector('#progressBar');

let tasks;
try { tasks = JSON.parse(localStorage.getItem('akarsh-namitha-planner')) || defaultTasks.map(name => ({ name, done: false, targetDate: '' })); }
catch { tasks = defaultTasks.map(name => ({ name, done: false, targetDate: '' })); }
tasks = tasks.map(task => ({ ...task, targetDate: task.targetDate || '' }));

function save() { localStorage.setItem('akarsh-namitha-planner', JSON.stringify(tasks)); }
function render() {
  checklist.innerHTML = tasks.map((task, index) => `
    <li class="task ${task.done ? 'done' : ''} ${index >= defaultTasks.length ? 'custom' : ''}" style="animation-delay:${Math.min(index * 25, 250)}ms">
      <div class="task-row">
        <button type="button" data-index="${index}" aria-pressed="${task.done}">
          <span class="checkmark">${task.done ? '✓' : ''}</span><span class="task-name">${task.name}</span>
        </button>
        ${index >= defaultTasks.length ? `<button class="delete-task" type="button" data-delete="${index}" aria-label="Remove ${task.name}">×</button>` : ''}
      </div>
      <label class="target-date"><span>Target date</span><input type="date" data-date="${index}" value="${task.targetDate}" aria-label="Target date for ${task.name}" /></label>
    </li>`).join('');
  const complete = tasks.filter(task => task.done).length;
  const percent = tasks.length ? Math.round((complete / tasks.length) * 100) : 0;
  progressLabel.textContent = `${complete} of ${tasks.length} complete`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}
checklist.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-delete]');
  if (remove) { tasks.splice(Number(remove.dataset.delete), 1); save(); render(); return; }
  const button = event.target.closest('[data-index]');
  if (!button) return;
  tasks[Number(button.dataset.index)].done = !tasks[Number(button.dataset.index)].done;
  save(); render();
});
checklist.addEventListener('change', (event) => {
  const date = event.target.closest('[data-date]');
  if (!date) return;
  tasks[Number(date.dataset.date)].targetDate = date.value;
  save();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return input.focus();
  tasks.push({ name, done: false, targetDate: newDate.value }); save(); render(); input.value = ''; newDate.value = ''; input.focus();
});
function updateCountdown() {
  const now = new Date();
  const target = new Date('2027-04-28T07:00:00+05:30');
  if (now >= target) return ['months','weeks','days','hours','seconds'].forEach(id => document.querySelector(`#${id}`).textContent = '00');
  let cursor = new Date(now);
  let months = 0;
  while (true) {
    const next = new Date(cursor); next.setMonth(next.getMonth() + 1);
    if (next > target) break;
    cursor = next; months++;
  }
  let remaining = target - cursor;
  const weeks = Math.floor(remaining / 604800000); remaining %= 604800000;
  const days = Math.floor(remaining / 86400000); remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
  const seconds = Math.floor(remaining / 1000) % 60;
  const values = [months, weeks, days, hours, seconds];
  ['months','weeks','days','hours','seconds'].forEach((id, i) => document.querySelector(`#${id}`).textContent = String(values[i]).padStart(2, '0'));
}
document.querySelector('#openPlanner').addEventListener('click', () => document.querySelector('#planner').scrollIntoView({ behavior: 'smooth' }));
updateCountdown(); setInterval(updateCountdown, 1000); render();
