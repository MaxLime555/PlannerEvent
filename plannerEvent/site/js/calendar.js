// Переменные для хранения информации об авторизации
const authName = JSON.parse(localStorage.getItem('authName'));
const authTokenCalendar = JSON.parse(localStorage.getItem('authToken'));

// Переменные для элементов взаимодействия с календарем
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const currentMonthLabel = document.getElementById('currentMonth');
const calendarEvents = document.getElementById('calendar');

// Переменные для взаимодействия с модальным окном для создания события
const eventSection = document.getElementById('event-modal');
const newEvent = document.getElementById("createEvent");
const enterEvent = document.getElementById("enterEvent");
const createEventButton = document.getElementById("create");
const closeEventButton = document.getElementById('close-event');
const closeCreateEventButton = document.getElementById("close-create");

// Переменные для уточнения, хочет ли клиент прервать создание события
const questionCreateEvent = document.getElementById("question");
const agreeQuestion = document.getElementById("agreeQuestion");
const disagreeQuestion = document.getElementById("disagreeQuestion");

//Поздравление с присоединением к событию
const inviteCongratulation = document.getElementById("invite-congratulation");

// Переменные для хранения актуальной даты и массива событий
let currentDate = new Date();
let eventInfo = [];

// Функция для проверки, является ли дата неактуальной
const isDateNotCurrent = (date) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  return date < currentDate;
};

// Функция для форматирования даты для отображения в календаре
const formatDatecalendarEvents = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
};

// Функция для обновления классов и изображений "звезды" событий
const updateEventOwnership = () => {
  // Итерация по массиву событий eventInfo
  eventInfo.forEach(event => {
    const eventElement = document.getElementById(`event-${event.id}`);

    if (event.owner !== null) {
      if (event.owner.username == authName) {
        // Если поле owner.username совпадает с authName, добавляем класс "owner"
        eventElement.classList.add('owner');

        // Создаем элемент изображения "звезды" и добавляем его перед текстом
        const starImage = document.createElement('img');
        starImage.classList.add('starEvent');
        starImage.src = 'img/starEvent.png';
        starImage.alt = 'звездочка создателя события';
        eventElement.insertBefore(starImage, eventElement.firstChild);
      }
    }
  });
}

// Функция для очистки формы
const clearForm = () => {
  const form = document.querySelector('.create-event__form'); // Находим форму по её классу

  // Находим все элементы ввода внутри формы
  const inputElements = form.querySelectorAll('input');
  const textareaElement = form.querySelector('textarea');
  const selectElement = form.querySelector('select');

  // Сбрасываем значения во всех найденных элементах
  inputElements.forEach((input) => {
    input.value = '';
  });

  textareaElement.value = '';
  selectElement.selectedIndex = -1; // Сброс выбранного значения в селекте
}

// Функция для обновления календаря событий
const updatecalendarEvents = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  currentMonthLabel.textContent = monthNames[month] + ' ' + year;

  calendarEvents.innerHTML = '<tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>';

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const firstDayOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = firstDayOfPrevMonth.getDate();

  let firstDayOfWeek = firstDayOfMonth.getDay();
  if (firstDayOfWeek === 0) {
    firstDayOfWeek = 7;
  }

  const requestOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authTokenCalendar}`,
    },
  };

  fetch('https://planner.rdclr.ru/api/events?populate=*', requestOptions)
    .then(response => response.json())
    .then(data => {
      eventInfo = data.data;
      let day = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
          const cellDate = new Date(year, month, day);
          const isNotCurrent = isDateNotCurrent(cellDate);
          let cellContent = '';

          if (i === 0 && j < firstDayOfWeek - 1) {
            const prevMonthDay = daysInPrevMonth - (firstDayOfWeek - 2 - j);
            cellContent = `<p class="prev-month">${prevMonthDay}</p>`;
          } else if (day <= daysInMonth) {
            let isEventExists = false;
            for (let count = 0; count < eventInfo.length; count++) {
              let dateCell = formatDatecalendarEvents(new Date(year, month, day));
              if (new Date(eventInfo[count].dateStart).toISOString().split('T')[0] === dateCell) {
                let eventTitles = '';
                for (let count = 0; count < eventInfo.length; count++) {
                  let dateCell = formatDatecalendarEvents(new Date(year, month, day));
                  if (formatDatecalendarEvents(new Date(eventInfo[count].dateStart).toISOString().split('T')[0]) === dateCell) {
                    eventTitles += `<div class="title-event">
                      <p class="title-event-text ${isNotCurrent ? ' unactual' : ''}" id="event-${eventInfo[count].id}">
                        ${eventInfo[count].title}
                      </p>
                    </div>`;
                  }
                }

                cellContent = `<p class="now-month">${day}</p>${eventTitles}`;
                day++;
                isEventExists = true;
                break;
              }
            }
            if (!isEventExists) {
              cellContent = `<p class="now-month">${day}</p>`;
              day++;
            }
          } else {
            cellContent = `<p class="next-month">${day - daysInMonth}</p>`;
            day++;
          }

          const cell = document.createElement('td');
          cell.className = 'event-date';
          cell.dataset.date = `${year}-${month + 1}-${day}`;
          cell.innerHTML = cellContent;

          row.appendChild(cell);
        }
        calendarEvents.appendChild(row);
      }

      // После загрузки данных о событиях, вызываем функцию обновления классов и изображений "звезды"
      updateEventOwnership();
    })
    .catch(error => {
      console.log('Ошибка запроса:', error);
    });
}

// Обработчик события для кнопки "Войти в событие"
enterEvent.addEventListener('click', async function () {
  // URL для отправки POST-запроса
  const eventJoinUrl = 'https://planner.rdclr.ru/api/events/2/join';

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authTokenCalendar}`
    };

    const response = await fetch(eventJoinUrl, {
      method: 'POST',
      headers: headers
    });
    if (response.ok) {
      console.log('Присоединение к событию выполнено успешно.');
      // Все сделал, нужную информацию сюда легко добавить, но запрос не работает
      inviteCongratulation.style.display = 'block';
      // После успешного присоединения к событию, добавляем маркер &bull;
      // Каждому событию, где owner.username совпадает с authName
      eventInfo.forEach(event => {
        const eventElement = document.getElementById(`event-${event.id}`);

        const eventTitleJoin = eventElement.querySelector('.title-event-text');
        const marker = document.createElement('span');
        marker.classList.add('marker');
        marker.innerHTML = '&bull; ';
        eventTitleJoin.insertBefore(marker, eventTitleJoin.firstChild);
      });
    } else {
      console.error('Ошибка при присоединении к событию:', response.status);
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  }
});

// Обработчики событий для кнопок "Предыдущий месяц" и "Следующий месяц"
prevMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updatecalendarEvents();
});

nextMonthButton.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updatecalendarEvents();
});

// Обработчик события для кнопки "Закрыть событие"
closeEventButton.addEventListener('click', () => {
  eventSection.style.display = 'none';
});

// Обработчик события для кнопки "Создать событие"
createEventButton.addEventListener('click', () => {
  newEvent.style.display = 'block';
});

// Обработчик события для кнопки "Закрыть создание события"
closeCreateEventButton.addEventListener("click", function () {
  questionCreateEvent.style.display = 'block';
});

// Обработчик события для кнопки "Не согласен"
disagreeQuestion.addEventListener("click", function () {
  questionCreateEvent.style.display = 'none';
});

// Обработчик события для кнопки "Согласен"
agreeQuestion.addEventListener("click", function () {
  questionCreateEvent.style.display = 'none';
  newEvent.style.display = 'none';
  clearForm();
});

// Обработчик события для клика по элементу в календаре
calendarEvents.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('title-event-text')) {
    const eventId = target.id.split('-')[1];
    const eventInfoData = eventInfo.find(event => event.id == eventId);
    eventSection.style.display = 'block';

    if (eventInfoData) {
      const eventTitle = document.querySelector('.event-name');
      const eventTime = document.querySelector('.event-time');
      const eventPlace = document.querySelector('.event-place');
      const descriptionText = document.querySelector('.description-text');
      eventTitle.textContent = eventInfoData.title;
      const dateStart = new Date(eventInfoData.dateStart);
      const daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

      // Опции для форматирования времени
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
      };

      eventTime.innerHTML = `<br>${daysOfWeek[dateStart.getDay()]}<br>${dateStart.toLocaleDateString()}<br>${dateStart.toLocaleTimeString(undefined, timeOptions)}`;
      eventPlace.textContent = eventInfoData.location;
      descriptionText.textContent = eventInfoData.description;

      const membersPeople = document.getElementById('members-people');
      membersPeople.innerHTML = '';

      const organizerDiv = document.createElement('div');
      organizerDiv.classList.add('person');

      const organizerContainer = document.createElement('div');
      organizerContainer.classList.add('organizer');

      const organizerImg = document.createElement('img');
      organizerImg.classList.add('img__person');
      organizerImg.src = 'img/avatar.png';

      const organizerName = document.createElement('p');
      organizerName.classList.add('person-name-organizer');
      if (eventInfoData.owner !== null) {
        organizerName.textContent = eventInfoData.owner.username;
      } else {
        organizerName.textContent = 'admin';
      }

      const organizerPosition = document.createElement('p');
      organizerPosition.classList.add('position');
      organizerPosition.textContent = 'Организатор';

      organizerDiv.appendChild(organizerImg);
      organizerDiv.appendChild(organizerContainer);
      organizerContainer.appendChild(organizerName);
      organizerContainer.appendChild(organizerPosition);

      membersPeople.appendChild(organizerDiv);

      eventInfoData.participants.slice(0, 4).forEach((participant) => {
        const personDiv = document.createElement('div');
        personDiv.classList.add('person');

        const imgPerson = document.createElement('img');
        imgPerson.classList.add('img__person');
        imgPerson.src = 'img/avatar.png'; // Установите путь к изображению, если необходимо

        const personName = document.createElement('p');
        personName.classList.add('person-name');
        personName.textContent = participant.username;

        personDiv.appendChild(imgPerson);
        personDiv.appendChild(personName);

        membersPeople.appendChild(personDiv);
      });

      // Если участников больше 5, создаем блок "Еще +X"
      if (eventInfoData.participants.length > 5) {
        const remainingParticipants = eventInfoData.participants.slice(5);
        const remainingCount = remainingParticipants.length;

        const moreParticipantsDiv = document.createElement('div');
        moreParticipantsDiv.classList.add('person');

        for (let i = 0; i < 3; i++) {
          const imgPerson = document.createElement('img');
          imgPerson.classList.add('img__person', `person-${i + 1}`);
          imgPerson.src = 'img/avatar.png'; // Установите путь к изображению, если необходимо
          moreParticipantsDiv.appendChild(imgPerson);
        }

        const moreParticipantsText = document.createElement('p');
        moreParticipantsText.classList.add('person-name');
        moreParticipantsText.textContent = `Еще +${remainingCount}`;
        moreParticipantsDiv.appendChild(moreParticipantsText);

        membersPeople.appendChild(moreParticipantsDiv);
      }
    }
    const galleryPhotoContainer = document.querySelector('.gallery-photo');

    galleryPhotoContainer.innerHTML = '';

    const index = eventInfo.findIndex(obj => obj.id == eventId);
    const photos = eventInfo[index].photos;

    if (photos !== null) {
      photos.forEach(photo => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('photo-container');
        const img = document.createElement('img');
        img.classList.add('photo-view');
        imgContainer.appendChild(img);
        const fullImageUrl = `https://planner.rdclr.ru${photo.url}`;
        img.src = fullImageUrl;
        galleryPhotoContainer.appendChild(img);
      });

      const photosEvent = document.querySelectorAll('.photo-view');
      const leftButton = document.querySelector('.left-button');
      const rightButton = document.querySelector('.right-button');
      const totalPhotos = photosEvent.length;
      let currentPhotoIndex = 0;

      const hideAllPhotos = () => {
        photosEvent.forEach(photo => {
          photo.style.display = 'none';
        });
      }

      const showPhotos = () => {
        hideAllPhotos();
        for (let i = 0; i < 3; i++) {
          const index = (currentPhotoIndex + i) % totalPhotos;
          photosEvent[index].style.display = 'block';
        }
      }

      leftButton.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
        showPhotos();
      });

      rightButton.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
        showPhotos();
      });

      showPhotos();
    }
  }
});

// Обновление календаря событий при загрузке страницы
updatecalendarEvents();

// Обработчик события для кнопки "Создать событие"
createEventButton.addEventListener('click', () => {
  newEvent.style.display = 'block';
});