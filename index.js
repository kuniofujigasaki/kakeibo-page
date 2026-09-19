const STORAGE_KEY = 'kakeibo-data';

const form = document.getElementById('kakeibo-form');
const tbody = document.getElementById('ledger-body');
const totalAmount = document.getElementById('total-amount');

function getRecords() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return [];
  }

  try {
    const parsedData = JSON.parse(savedData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('保存データの取得に失敗しました。', error);
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function calculateTotal(records) {
  return records.reduce((sum, record) => {
    const amount = Number(record.amount) || 0;
    return record.type === 'income' ? sum + amount : sum - amount;
  }, 0);
}

function renderTable() {
  const records = getRecords();
  tbody.innerHTML = '';

  if (records.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyCell = document.createElement('td');

    emptyCell.colSpan = 4;
    emptyCell.textContent = 'データがありません';
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);

    totalAmount.textContent = '0円';
    return;
  }

  records.forEach((record) => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = record.date;
    row.appendChild(dateCell);

    const itemCell = document.createElement('td');
    itemCell.textContent = record.item;
    row.appendChild(itemCell);

    const typeCell = document.createElement('td');
    const typeText = record.type === 'income' ? '収入' : '支出';
    typeCell.textContent = typeText;
    typeCell.classList.add(record.type === 'income' ? 'income' : 'expense');
    row.appendChild(typeCell);

    const amountCell = document.createElement('td');
    const amountValue = Number(record.amount) || 0;
    const amountText = record.type === 'income'
      ? `+${amountValue.toLocaleString()}円`
      : `-${amountValue.toLocaleString()}円`;
    amountCell.textContent = amountText;
    amountCell.classList.add(record.type === 'income' ? 'income' : 'expense');
    row.appendChild(amountCell);

    tbody.appendChild(row);
  });

  const total = calculateTotal(records);
  totalAmount.textContent = `${total.toLocaleString()}円`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.getElementById('date').value;
  const item = document.getElementById('item').value.trim();
  const amount = document.getElementById('amount').value;
  const type = document.querySelector('input[name="type"]:checked')?.value;

  if (!date || !item || !amount || !type) {
    alert('日付、品目、金額、収支をすべて入力してください。');
    return;
  }

  const records = getRecords();
  records.push({
    date,
    item,
    amount: Number(amount),
    type,
  });

  saveRecords(records);
  renderTable();
  form.reset();
});

document.addEventListener('DOMContentLoaded', renderTable);
