// client-side JS to interact with /api/todos
const apiBase = '/api/todos';

const $list = document.getElementById('todoList');
const $addForm = document.getElementById('addForm');
const $titleInput = document.getElementById('titleInput');
const todoTpl = document.getElementById('todoTpl');

async function fetchTodos() {
  const res = await fetch(apiBase);
  if (!res.ok) return console.error('Failed to fetch todos', await res.text());
  const data = await res.json();
  return data.todos || [];
}

function renderTodos(todos) {
  $list.innerHTML = '';
  todos.forEach(t => {
    const node = todoTpl.content.cloneNode(true);
    const li = node.querySelector('li');
    const titleSpan = node.querySelector('.todo-title');
    const checkbox = node.querySelector('.todo-done');
    const editBtn = node.querySelector('.edit-btn');
    const delBtn = node.querySelector('.delete-btn');

    li.dataset.id = t.id;
    titleSpan.textContent = t.title;
    checkbox.checked = !!t.done;
    if (t.done) li.classList.add('done');

    // toggle done
    checkbox.addEventListener('change', async () => {
      const done = checkbox.checked;
      try {
        const res = await fetch(`${apiBase}/${t.id}`, {
          method: 'PATCH',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ done })
        });
        if (!res.ok) {
          const err = await res.json().catch(()=>({message:'error'}));
          alert('Алдаа: ' + (err.message || res.statusText));
          checkbox.checked = !done; // revert
        } else {
          li.classList.toggle('done', done);
        }
      } catch (e) {
        alert('Network error');
        checkbox.checked = !done;
      }
    });

    // delete
    delBtn.addEventListener('click', async () => {
      if (!confirm('Устгах уу?')) return;
      try {
        const res = await fetch(`${apiBase}/${t.id}`, { method: 'DELETE' });
        if (!res.ok) {
          const err = await res.json().catch(()=>({message:'error'}));
          alert('Алдаа: ' + (err.message || res.statusText));
        } else {
          loadAndRender();
        }
      } catch (e) {
        alert('Network error');
      }
    });

    // edit
    editBtn.addEventListener('click', () => {
      enterEditMode(li, t);
    });

    $list.appendChild(node);
  });
}

function enterEditMode(li, todo) {
  // replace content with inline edit fields
  li.innerHTML = '';
  li.classList.remove('done');

  const wrapper = document.createElement('div');
  wrapper.className = 'edit-mode';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = todo.title;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';

  wrapper.appendChild(input);
  wrapper.appendChild(saveBtn);
  wrapper.appendChild(cancelBtn);
  li.appendChild(wrapper);

  saveBtn.addEventListener('click', async () => {
    const newTitle = input.value.trim();
    if (!newTitle) { alert('Title хоосон байж болохгүй'); return; }
    try {
      const res = await fetch(`${apiBase}/${todo.id}`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ title: newTitle })
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:'error'}));
        alert('Алдаа: ' + (err.message || res.statusText));
      } else {
        loadAndRender();
      }
    } catch (e) {
      alert('Network error');
    }
  });

  cancelBtn.addEventListener('click', () => loadAndRender());
}

$addForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const title = $titleInput.value.trim();
  if (!title) { alert('Title хоосон байж болохгүй'); return; }
  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({message:'error'}));
      alert('Алдаа: ' + (err.message || res.statusText));
    } else {
      $titleInput.value = '';
      loadAndRender();
    }
  } catch (e) {
    alert('Network error');
  }
});

async function loadAndRender() {
  const todos = await fetchTodos();
  renderTodos(todos);
}

// initial
loadAndRender();

