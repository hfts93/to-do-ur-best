// Поиск элементов на странице из form в разметке
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// Функции
function addTask(event) {
    // Убираю отправку формы и типа страница не обновляется после нажатия на кнопку добавить
    event.preventDefault();

    // Доставляем текст из задачи из поля ввода
    const taskText = taskInput.value;

    // Получаем текущее время в Московском часовом поясе
    const now = new Date();
    const options = {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit'
    };
    const timeString = new Intl.DateTimeFormat('ru-RU', options).format(now);

    const newTask = {
        id: Date.now(),
        text: taskText,
        time: timeString,
        done: false
    };

    // Добавляем задачу в массив с задачами
    tasks.push(newTask);

    // Добавление задачи в массив с задачами LocalStorage
    saveToLocalStorage();

    renderTask(newTask);

    // Очищаю поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    // Проверка если клик был не по кнопке
    if (event.target.dataset.action !== 'delete') return;

    // Проверка на клик по кнопке удалить
    const parenNode = event.target.closest('.list-group-item');

    // Определить ID задачи
    const id = Number(parenNode.id);

    // Удаляем через фильтр
    tasks = tasks.filter((task) => task.id !== id);

    // Добавление задачи в массив с задачами LocalStorage
    saveToLocalStorage();

    // Удаляем из разметки
    parenNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    // Если клик был не по кнопке задача выполнена
    if (event.target.dataset.action !== 'done') return;

    const parenNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parenNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    // Добавление задачи в массив с задачами LocalStorage
    saveToLocalStorage();

    const taskTitle = parenNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                    <div class="empty-list__title">Список дел пуст</div>
                </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формируем CSS класс
    const cssClass = task.done ? 'task-title task-title--done' : "task-title";

    // Формулирую разметку для новой задачи
    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between align-items-center task-item">
            <span class="${cssClass}">${task.text}</span>
            <span class="task-time">${task.time}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;

    // Добавление задачи на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
