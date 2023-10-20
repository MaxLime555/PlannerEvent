// Элементы для взаимодействия с выпадающим календариком во время создания события
const prevMonthEvent = document.getElementById('prevMonth-event');
const nextMonthEvent = document.getElementById('nextMonth-event');
const curMonthEvent = document.getElementById('currentMonth-event');
const tableEvent = document.getElementById('calendar-event');

//Поля для начала и конца события
const startInput = document.getElementById("start-event");
const endInput = document.getElementById("end-event");

//Поля для работы с созданием события
const calendar = document.getElementById('containerCalendar');
const confirmationButton = document.getElementById('confirmation');
const nameInput = document.getElementById("name-event");
const descriptionInput = document.getElementById("description-event-text");
const timeInput = document.getElementById("time-event");
const placeInput = document.getElementById("place-event");
const createButton = document.getElementById("create-button");
const Event = document.getElementById("createEvent");

//Элементы для поздравления с созданием нового события
const congratulationSection = document.getElementById("congratulationSection");
const closeBottunCongratulation = document.getElementById("closeCongratulation");
const excellentButton = document.getElementById("greatButton");

//Для стилизации label у полей в модальном окне для создания события
const startLabel = document.getElementById("start-label");
const endLabel = document.getElementById("end-label");



let activeInput = null; // Флаг для отслеживания активного поля
let eventCurrentDate = new Date(); //актуальная дата

// Функция для обновления календаря при изменении месяца
const updateCalendarEvent = () => {
    // Получаем текущий месяц и год
    const year = eventCurrentDate.getFullYear();
    const month = eventCurrentDate.getMonth();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    // Устанавливаем месяц в заголовке
    curMonthEvent.textContent = monthNames[month] + ' ' + year;

    // Очищаем таблицу
    tableEvent.innerHTML = '<tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>';

    // Находим первый день месяца и количество дней в месяце
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Находим первый день предыдущего месяца и его количество дней
    const firstDayOfPrevMonth = new Date(year, month, 0);
    const daysInPrevMonth = firstDayOfPrevMonth.getDate();

    // Определяем день недели для первого дня текущего месяца (0 - воскресенье, 6 - суббота)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    if (firstDayOfWeek === 0) {
        firstDayOfWeek = 7; // Преобразуем в понедельник как 1
    }

    // Создаем ячейки для чисел текущего месяца
    let day = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfWeek - 1) {
                // Ячейки для чисел предыдущего месяца
                const prevMonthDay = daysInPrevMonth - (firstDayOfWeek - 2 - j);
                row.innerHTML += `<td class="prev-month">${prevMonthDay}</td>`;
            } else if (day <= daysInMonth) {
                // Ячейки для чисел текущего месяца
                row.innerHTML += `<td>${day}</td>`;
                day++;
            } else {
                // Ячейки для чисел следующего месяца
                row.innerHTML += `<td class="next-month">${day - daysInMonth}</td>`;
                day++;
            }
        }
        tableEvent.appendChild(row);
    }
}

//Для обозначения события, которое я создал
const updateEventOwner = () => {
    // Итерация по массиву событий eventInfo
    eventInfo.forEach(event => {
        const eventElement = document.getElementById(`event-${event.id}`);
        
        if(event.owner){
            if (event.owner.username == authName) {
                // Если поле owner.username совпадает с authName, добавляем класс "owner"
                eventElement.classList.add('owner');
    
                // Создаем элемент изображения "звезды" и добавляем его перед текстом
                const starImage = document.createElement('img');
                starImage.classList.add('starEvent');
                starImage.alt = 'звездочка создателя события';
                starImage.src = 'img/starEvent.png';
                eventElement.insertBefore(starImage, eventElement.firstChild);
            }
        }
        
    });
}

const updatetInputStyles = () => {
    if (!startInput.value) {
        startLabel.style.padding = "10px 34px 5px 10px";
        startLabel.style.top = "2px";
        startLabel.style.left = "2px";
        startLabel.style.fontSize = "14px";
    } else {
        startLabel.style.padding = "0";
        startLabel.style.top = "2px";
        startLabel.style.left = "10px";
        startLabel.style.fontSize = "10px";
    }
}

// Функция для форматирования даты в формат "дд.мм.гггг"
const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

// Функция для проверки, все ли обязательные поля заполнены
const areAllFieldsFilled = () => {
    return (
        nameInput.value.trim() !== "" &&
        descriptionInput.value.trim() !== "" &&
        startInput.value.trim() !== "" &&
        timeInput.value.trim() !== "" &&
        placeInput.value.trim() !== ""
    );
}

// Функция для обновления состояния кнопки "Создать"
const updateCreateButtonState = () => {
    const isAnyFieldFilled =
        nameInput.value !== "" &&
        descriptionInput.value !== "" &&
        startInput.value !== "" &&
        timeInput.value !== "" &&
        placeInput.value !== "";

    if (isAnyFieldFilled) {
        createButton.classList.remove("disabled");
        createButton.disabled = false;
    } else {
        createButton.classList.add("disabled");
        createButton.disabled = true;
    }
}

//Обработка различных состояний полей
startInput.addEventListener("focus", () => {
    startLabel.style.padding = "0";
    startLabel.style.top = "2px";
    startLabel.style.left = "10px";
    startLabel.style.fontSize = "10px";
});

endInput.addEventListener("focus", () => {
    endLabel.style.padding = "0";
    endLabel.style.top = "2px";
    endLabel.style.left = "10px";
    endLabel.style.fontSize = "10px";
});

startInput.addEventListener("blur", () => {
    if (!startInput.value) {
        startLabel.style.padding = "10px 34px 5px 10px";
        startLabel.style.top = "2px";
        startLabel.style.left = "2px";
        startLabel.style.fontSize = "14px";
    }
});

endInput.addEventListener("blur", () => {
    if (!endInput.value) {
        endLabel.style.padding = "10px 34px 5px 10px";
        endLabel.style.top = "2px";
        endLabel.style.left = "2px";
        endLabel.style.fontSize = "14px";
    }
});



// Обработчики событий для кнопок переключения месяцев
prevMonthEvent.addEventListener('click', () => {
    eventCurrentDate.setMonth(eventCurrentDate.getMonth() - 1);
    updateCalendarEvent();
});

nextMonthEvent.addEventListener('click', () => {
    eventCurrentDate.setMonth(eventCurrentDate.getMonth() + 1);
    updateCalendarEvent();
});

// Инициализация календаря при загрузке страницы
updateCalendarEvent();

startInput.addEventListener("click", function () {
    calendar.style.display = 'block';
    activeInput = 'start'; // Устанавливаем активное поле как "Начало"
});

endInput.addEventListener("click", function () {
    calendar.style.display = 'block';
    activeInput = 'end'; // Устанавливаем активное поле как "Конец"
});

tableEvent.addEventListener('click', (event) => {
    const cell = event.target;

    // Проверяем, что кликнули по ячейке с числом (не предыдущего или следующего месяца)
    if (!cell.classList.contains('prev-month') && !cell.classList.contains('next-month')) {
        const selectedDate = new Date(eventCurrentDate);
        selectedDate.setDate(parseInt(cell.textContent, 10));

        // Получаем текущую дату и обрезаем время (чтобы сравнить только дни)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Проверяем, что выбранная дата находится в будущем и не раньше сегодняшней даты
        if (selectedDate >= today) {
            // Убираем стиль выбранной даты с предыдущей ячейки
            const selectedCell = tableEvent.querySelector('.selected-date');
            if (selectedCell) {
                selectedCell.classList.remove('selected-date');
            }

            // Добавляем стиль к выбранной ячейке
            cell.classList.add('selected-date');
        }
    }
});

createButton.addEventListener("click", function () {
    if (areAllFieldsFilled()) {
        // Получить значения из полей ввода
        const eventName = nameInput.value.trim();
        const eventStartDate = startInput.value.trim();
        const eventTime = timeInput.value.trim();
        const eventPlace = placeInput.value.trim();

        // Разбить дату начала на компоненты (день, месяц, год)
        const dateComponents = eventStartDate.split('.');
        const dayOfMonth = parseInt(dateComponents[0], 10);
        const month = parseInt(dateComponents[1], 10) - 1; // Вычитаем 1, так как месяцы в JavaScript начинаются с 0
        const year = parseInt(dateComponents[2], 10);

        // Создать объект Date, учитывая компоненты даты
        const startDate = new Date(year, month, dayOfMonth);

        // Получить день недели и название месяца из даты начала
        const daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
        const dayOfWeek = daysOfWeek[startDate.getDay()];
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const monthName = monthNames[startDate.getMonth()];

        // Обновить содержимое блока "Поздравление" данными из полей ввода
        document.querySelector(".content__name").textContent = eventName;
        document.querySelector(".time__day").textContent = dayOfWeek;
        document.querySelector(".time__date").textContent = `${dayOfMonth} ${monthName}`;
        document.querySelector(".time__clock").textContent = eventTime;
        document.querySelector(".congratulation__place").textContent = eventPlace;

        // Отобразить блок "Поздравление"
        congratulationSection.style.display = "block";
        Event.style.display = 'none';
        updateCalendarEvent();
    }
});

// Обработчик события для кнопки "Применить"
confirmationButton.addEventListener('click', () => {
    // Найдите выбранную ячейку
    const selectedCell = tableEvent.querySelector('.selected-date');

    if (selectedCell) {
        // Получите выбранную дату из содержимого ячейки
        const selectedDate = new Date(eventCurrentDate);
        selectedDate.setDate(parseInt(selectedCell.textContent, 10));

        // Форматируйте выбранную дату в формат "дд.мм.гггг"
        const formattedDate = formatDate(selectedDate);

        // Запишите выбранную дату в соответствующее поле в зависимости от активного поля
        if (activeInput === 'start') {
            startInput.value = formattedDate;
        } else if (activeInput === 'end') {
            endInput.value = formattedDate;
        }

        // Закройте календарь
        calendar.style.display = 'none';

        // Теперь вызовите функцию для обновления состояния кнопки "Создать"
        updateCreateButtonState();
        updatetInputStyles()
    }
});

// Обработчики событий для полей ввода
nameInput.addEventListener("input", updateCreateButtonState);
descriptionInput.addEventListener("input", updateCreateButtonState);
startInput.addEventListener("input", updateCreateButtonState);
timeInput.addEventListener("input", updateCreateButtonState);
placeInput.addEventListener("input", updateCreateButtonState);

// Обработчик события для кнопки "Создать"
createButton.addEventListener("click", function () {
    if (areAllFieldsFilled()) {
        // Если все обязательные поля заполнены, показываем блок "Поздравление"
        congratulationSection.style.display = "block";
    }
});

// Обработчик события для крестика и кнопки "Отлично" в блоке "Поздравление"
closeBottunCongratulation.addEventListener("click", function () {
    congratulationSection.style.display = "none";
});

excellentButton.addEventListener("click", function () {
    congratulationSection.style.display = "none";
});


















