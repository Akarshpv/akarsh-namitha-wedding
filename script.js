const defaultTasks = [
  'Auditorium Booking', 'Temple Enquiry', 'Guruvayur Room Booking',
  'Makeup Booking', 'Photography Booking', 'Travel Arrangements', 'Dress',
  'Gold', 'Catering Booking', 'Event Management Booking'
];

const checklist = document.querySelector('#checklist');
const form = document.querySelector('#addForm');
const input = document.querySelector('#newItem');
const progressLabel = document.querySelector('#progressLabel');
const progressPercent = document.querySelector('#progressPercent');
const progressBar = document.querySelector('#progressBar');

let tasks;
try { tasks = JSON.parse(localStorage.getItem('akarsh-namitha-planner')) || defaultTasks.map(name => ({ name, done: false })); }
catch { tasks = defaultTasks.map(name => ({ name, done: false })); }

function save() { localStorage.setItem('akarsh-namitha-planner', JSON.stringify(tasks)); }
function render() {
  checklist.innerHTML = tasks.map((task, index) => `
    <li class="task ${task.done ? 'done' : ''} ${index >= defaultTasks.length ? 'custom' : ''}" style="animation-delay:${Math.min(index * 25, 250)}ms">
      <button type="button" data-index="${index}" aria-pressed="${task.done}">
        <span class="checkmark">${task.done ? '✓' : ''}</span><span class="task-name">${task.name}</span>
        ${index >= defaultTasks.length ? `<span class="delete-task" data-delete="${index}" aria-label="Remove ${task.name}">×</span>` : ''}
      </button>
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
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return input.focus();
  tasks.push({ name, done: false }); save(); render(); input.value = ''; input.focus();
});
function updateCountdown() {
  const diff = new Date('2027-04-28T07:00:00+05:30') - new Date();
  const values = [Math.max(0, Math.floor(diff / 86400000)), Math.max(0, Math.floor(diff / 3600000) % 24), Math.max(0, Math.floor(diff / 60000) % 60), Math.max(0, Math.floor(diff / 1000) % 60)];
  ['days','hours','minutes','seconds'].forEach((id, i) => document.querySelector(`#${id}`).textContent = String(values[i]).padStart(id === 'days' ? 3 : 2, '0'));
}
document.querySelector('#openPlanner').addEventListener('click', () => document.querySelector('#planner').scrollIntoView({ behavior: 'smooth' }));
updateCountdown(); setInterval(updateCountdown, 1000); render();
