const form = document.getElementById("appointmentForm");
const message = document.getElementById("message");
const requestList = document.getElementById("requestList");
const clearButton = document.getElementById("clearButton");
const STORAGE_KEY = "autoprofi_requests";

const getRequests = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveRequests = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

function renderRequests() {
  const requests = getRequests();
  requestList.innerHTML = "";
  if (requests.length === 0) {
    requestList.innerHTML = '<p class="empty">Пока заявок нет.</p>';
    return;
  }
  requests.slice().reverse().forEach((item) => {
    const card = document.createElement("article");
    card.className = "request-card";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${item.brand} ${item.model} · ${item.service}`;
    const lines = [
      `Клиент: ${item.name} · ${item.phone}`,
      `Автомобиль: ${item.number}`,
      `Дата и время: ${item.date} ${item.time}`,
      `Описание: ${item.problem || "не указано"}`
    ];
    details.appendChild(title);
    lines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      details.appendChild(p);
    });
    const status = document.createElement("span");
    status.className = "status";
    status.textContent = item.status;
    card.append(details, status);
    requestList.appendChild(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const request = {
    id: Date.now(),
    name: document.getElementById("clientName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    brand: document.getElementById("carBrand").value.trim(),
    model: document.getElementById("carModel").value.trim(),
    number: document.getElementById("carNumber").value.trim(),
    service: document.getElementById("service").value,
    date: document.getElementById("visitDate").value,
    time: document.getElementById("visitTime").value,
    problem: document.getElementById("problem").value.trim(),
    status: "Новая заявка"
  };

  if (!request.name || !request.phone || !request.brand || !request.model ||
      !request.number || !request.service || !request.date || !request.time) {
    message.textContent = "Заполните все обязательные поля.";
    message.className = "message";
    return;
  }
  if (request.date < new Date().toISOString().slice(0, 10)) {
    message.textContent = "Нельзя выбрать прошедшую дату.";
    message.className = "message";
    return;
  }

  const requests = getRequests();
  requests.push(request);
  saveRequests(requests);
  renderRequests();
  form.reset();
  message.textContent = "Заявка успешно добавлена.";
  message.className = "message success";
});

clearButton.addEventListener("click", () => {
  if (confirm("Удалить все сохранённые заявки?")) {
    saveRequests([]);
    renderRequests();
    message.textContent = "Список заявок очищен.";
    message.className = "message success";
  }
});
renderRequests();
