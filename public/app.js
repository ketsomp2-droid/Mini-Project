const API = '/api/books';
const STATUS_LABEL = {
  'want-to-read': 'อยากอ่าน',
  'reading': 'กำลังอ่าน',
  'finished': 'อ่านจบแล้ว'
};

const form = document.getElementById('book-form');
const listEl = document.getElementById('book-list');
const messageEl = document.getElementById('message');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter-status');
const cancelBtn = document.getElementById('cancel-btn');
const submitBtn = document.getElementById('submit-btn');
const formTitle = document.getElementById('form-title');

const fields = {
  id: document.getElementById('book-id'),
  title: document.getElementById('title'),
  author: document.getElementById('author'),
  category: document.getElementById('category'),
  status: document.getElementById('status'),
  rating: document.getElementById('rating')
};

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + (isError ? 'error' : 'success');
}

// ---------- READ ----------
async function loadBooks() {
  const params = new URLSearchParams();
  if (filterEl.value) params.set('status', filterEl.value);
  if (searchEl.value.trim()) params.set('q', searchEl.value.trim());

  try {
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
    render(await res.json());
  } catch (err) {
    listEl.textContent = err.message;
  }
}

function render(books) {
  listEl.innerHTML = '';
  if (books.length === 0) {
    listEl.innerHTML = '<p class="empty">ยังไม่มีหนังสือ</p>';
    return;
  }
  books.forEach(book => listEl.appendChild(createCard(book)));
}

function createCard(book) {
  const card = document.createElement('article');
  card.className = 'book card';

  const h3 = document.createElement('h3');
  h3.textContent = book.title;

  const author = document.createElement('p');
  author.textContent = `โดย ${book.author}`;

  const cat = document.createElement('span');
  cat.className = 'tag';
  cat.textContent = book.category;

  const status = document.createElement('span');
  status.className = `badge ${book.status}`;
  status.textContent = STATUS_LABEL[book.status];

  const rating = document.createElement('p');
  rating.textContent = '⭐'.repeat(book.rating) || 'ยังไม่ให้คะแนน';

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'แก้ไข';
  editBtn.className = 'secondary';
  editBtn.addEventListener('click', () => startEdit(book));

  const delBtn = document.createElement('button');
  delBtn.textContent = 'ลบ';
  delBtn.className = 'danger';
  delBtn.addEventListener('click', () => deleteBook(book));

  actions.append(editBtn, delBtn);
  card.append(h3, author, cat, status, rating, actions);
  return card;
}

// ---------- CREATE / UPDATE ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: fields.title.value,
    author: fields.author.value,
    category: fields.category.value || undefined,
    status: fields.status.value,
    rating: Number(fields.rating.value)
  };
  const id = fields.id.value;

  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error((data.errors || [data.error]).join(', '));
    }
    showMessage(id ? 'แก้ไขสำเร็จ' : 'เพิ่มหนังสือสำเร็จ');
    resetForm();
    loadBooks();
  } catch (err) {
    showMessage(err.message, true);
  }
});

function startEdit(book) {
  fields.id.value = book.id;
  fields.title.value = book.title;
  fields.author.value = book.author;
  fields.category.value = book.category;
  fields.status.value = book.status;
  fields.rating.value = book.rating;
  formTitle.textContent = `แก้ไขหนังสือ #${book.id}`;
  submitBtn.textContent = 'บันทึกการแก้ไข';
  cancelBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  form.reset();
  fields.id.value = '';
  formTitle.textContent = 'เพิ่มหนังสือใหม่';
  submitBtn.textContent = 'เพิ่มหนังสือ';
  cancelBtn.classList.add('hidden');
}
cancelBtn.addEventListener('click', resetForm);

// ---------- DELETE ----------
async function deleteBook(book) {
  if (!confirm(`ลบ "${book.title}" ใช่หรือไม่?`)) return;
  try {
    const res = await fetch(`${API}/${book.id}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error('ลบไม่สำเร็จ');
    showMessage('ลบหนังสือแล้ว');
    loadBooks();
  } catch (err) {
    showMessage(err.message, true);
  }
}

// ---------- filter / search ----------
filterEl.addEventListener('change', loadBooks);
searchEl.addEventListener('input', loadBooks);

loadBooks();