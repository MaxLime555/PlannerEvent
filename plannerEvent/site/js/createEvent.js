//Токен, полученный при регистрации
const authToken = JSON.parse(localStorage.getItem('authToken'));

//Выбранные пользователи из выпадающего списка
const selectedUsers = [];

// Получаем ссылку на кнопку "Создать"
const createButtonEvent = document.getElementById("create-button");

// Элементы для работы с добавлением пользователей из выпадающего списка в поле участников
const memberEvent = document.getElementById("members-event")
const select = document.getElementById('members-event');
const optionsDiv = document.getElementById('options');
const selectedItemsDiv = document.getElementById('selectedItems');


// Получаем ссылку на поле загрузки фотографий и контейнер для отображения фотографий
const photoInput = document.getElementById('info__photos');
const loadPhotos = document.getElementById('load-photos');


//Получаю свое имя для корректного отображения при создании или просмотре события
async function getMyName() {
    try {
        const response = await fetch('https://planner.rdclr.ru/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            const myName = userData.username; 
            const authorName = document.querySelector('.author__name');
            authorName.textContent = myName;
            localStorage.setItem('authName', JSON.stringify(myName));
        } else {
            console.error('Ошибка при запросе имени:', response.status);
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

getMyName();


//не помню, зачем создал, а теперь удалять страшно)))
//вроде  удалил, ничего не сломалось при проверке, но оставлю на всякий случай
//если что, вы ничего не видели, это пасхалка :)
let data = [];

//получение всех зарегистрированных пользователей
async function loadUsers() {
    try {
        const response = await fetch('https://planner.rdclr.ru/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            data = await response.json();
            updateSelectOptions();
        } else {
            console.error('Ошибка при получении пользователей:', response.status);
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

//Добавление выбранных пользователей в поле
const updateSelectOptions = () => {
    optionsDiv.innerHTML = '';

    data.forEach(user => {
        const option = document.createElement('div');
        const nameUser = document.createElement('p');
        const photoUser = document.createElement('img');
        option.className = 'option';
        nameUser.className = 'name-user';
        photoUser.className = 'photo-user';
        photoUser.src = 'img/avatar.png';
        nameUser.textContent = user.username;

        option.addEventListener('click', () => {
            if (select.contains(option)) {
                select.removeChild(option);
                selectedItemsDiv.removeChild(selectedItem);
                // Удалить пользователя из массива selectedUsers по его имени
                const selectedUserIndex = selectedUsers.findIndex(userObj => userObj.username === user.username);
                if (selectedUserIndex !== -1) {
                    selectedUsers.splice(selectedUserIndex, 1);
                }
            } else {
                select.appendChild(option);
                const selectedItem = document.createElement('div');
                selectedItem.className = 'selected-item';
                const nameUserSelec = document.createElement('p');
                const photoUserSelec = document.createElement('img');
                nameUserSelec.className = 'name-user-selec';
                photoUserSelec.className = 'photo-user-selec';
                photoUserSelec.src = 'img/avatar.png';
                selectedItem.appendChild(photoUserSelec);
                selectedItem.appendChild(nameUserSelec);
                nameUserSelec.textContent = user.username;
                selectedItem.addEventListener('click', () => {
                    select.removeChild(option);
                    selectedItemsDiv.removeChild(selectedItem);
                    // Удалить пользователя из массива selectedUsers по его имени
                    const selectedUserIndex = selectedUsers.findIndex(userObj => userObj.username === user.username);
                    if (selectedUserIndex !== -1) {
                        selectedUsers.splice(selectedUserIndex, 1);
                    }
                    if(selectedUsers.length == 0){
                      const selectedText = document.getElementById('selectedText');
                      selectedText.style.top = '8px'; 
                      selectedText.style.fontSize = '14px'; 
                 }
                });
                selectedItemsDiv.appendChild(selectedItem);
                // Добавить пользователя в массив selectedUsers
                selectedUsers.push(user);
                
            }
            if(selectedUsers.length > 0){
                 const selectedText = document.getElementById('selectedText');
                 selectedText.style.top = '0'; 
                 selectedText.style.fontSize = '10px'; 
            }
        });
        option.appendChild(photoUser);
        option.appendChild(nameUser);
        optionsDiv.appendChild(option);
    });
}

loadUsers();

//Если список выпал, то спрятать при нажатии
//Если список спрятан, то открыть при нажатии
memberEvent.addEventListener('click', () => {
    optionsDiv.style.display = optionsDiv.style.display === 'block' ? 'none' : 'block';
});

//Если нажать в любое место в документе, то выпадающий список пользователей пропадет
document.addEventListener('click', (event) => {
    if (!select.contains(event.target) && !optionsDiv.contains(event.target)) {
        optionsDiv.style.display = 'none';
    }
});



//создание события
createButtonEvent.addEventListener("click", function () {
    // Получаем данные из заполненной формы
    const authToken = JSON.parse(localStorage.getItem('authToken'));
    const apiUrl = 'https://planner.rdclr.ru/api/events';
  
    const title = document.getElementById("name-event").value;
    const description = document.getElementById("description-event-text").value;
  
    // Преобразуем дату и время в нужный формат "2022-10-14T14:00:00.000Z"
    const dateInput = document.getElementById("start-event").value;
    const timeInput = document.getElementById("time-event").value;
    const dateStart = formatDateStart(dateInput, timeInput);
  
    const location = document.getElementById("place-event").value;
  
    // Создаем объект с данными для отправки
    const eventData = {
      "title": title,
      "description": description,
      "dateStart": dateStart,
      "location": location,
      "participants": selectedUsers,
    };
  
    // Если uploadedPhotoIds не пустой, отправляем запрос на обновление
    if (uploadedPhotoIds.length > 0) {
      // Создаем объект с данными для отправки при обновлении
      const eventDataPhoto = {
        ...eventData,
        "photos": uploadedPhotoIds,
      };

      // Отправляем POST запрос на сервер
      fetch('https://planner.rdclr.ru/api/events/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDataPhoto),
      })
        .then(response => {
          if (response.ok) {
            console.log('Событие успешно обновлено');
            // Дополнительная логика после успешного обновления события
          } else {
            console.error('Ошибка при обновлении события:', response.status);
          }
        })
        .catch(error => {
          console.error('Ошибка при отправке запроса:', error);
        });
    } else {
      // Если uploadedPhotoIds пустой, отправляем запрос на создание
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
        .then(response => {
          if (response.ok) {
            console.log('Событие успешно создано');
            // Дополнительная логика после успешного создания события
          } else {
            console.error('Ошибка при создании события:', response.status);
          }
        })
        .catch(error => {
          console.error('Ошибка при отправке запроса:', error);
        });
    }
  });

// Функция для преобразования даты и времени в нужный формат
const formatDateStart = (date, time) => {
    const [day, month, year] = date.split('.').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const isoDate = new Date(Date.UTC(year, month - 1, day, hours, minutes)).toISOString();
    return isoDate;
}


// Функция для создания элемента фотографии
function createPhotoElement(file) {
  const customPhoto = document.createElement('div');
  customPhoto.classList.add('custom-photo');

  // Создаем кнопку для удаления фотографии
  const closeBtn = document.createElement('p');
  closeBtn.innerHTML = '&#10006;';
  closeBtn.classList.add('close-photo-button');

  // Добавляем обработчик события "click" для кнопки удаления
  closeBtn.addEventListener('click', function () {
    customPhoto.remove();
  });

  // Создаем элемент изображения и устанавливаем его источник
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.classList.add('photo');

  // Добавляем элементы в кастомный контейнер для фотографии
  customPhoto.appendChild(closeBtn);
  customPhoto.appendChild(img);

  // Добавляем обработчики событий для эффекта наведения
  customPhoto.addEventListener('mouseenter', function () {
    customPhoto.classList.add('hovered');
  });

  customPhoto.addEventListener('mouseleave', function () {
    customPhoto.classList.remove('hovered');
  });

  return customPhoto;
}

// Функция для отправки фотографии на сервер
const uploadedPhotoIds = [];

async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('files', file, file.name);

  try {
    const response = await fetch('https://planner.rdclr.ru/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Фотография успешно загружена:', data);

      // Извлеките id и добавьте его в массив
      //Фотки добавляются по одной, поэтому обращаюсь к первому элементу массива
      const photoId = data[0].id;
      uploadedPhotoIds.push(photoId);
    } else {
      console.error('Ошибка при загрузке фотографии:', response.status);
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  }
}

// Обработчик события "click" для поля загрузки фотографий
photoInput.addEventListener('click', function () {
  // Создаем скрытое поле для выбора фотографий и устанавливаем тип и формат
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  // Обработчик события "change" для выбора файлов
  input.addEventListener('change', async function (event) {
    const files = event.target.files;

    // Создаем элементы для каждой выбранной фотографии и добавляем их в контейнер
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const customPhoto = createPhotoElement(file);
      loadPhotos.appendChild(customPhoto);

      // Отправляем фотографию на сервер
      await uploadPhoto(file);
    }
  });

  // Запускаем событие "click" на скрытом поле, чтобы открыть диалог выбора файлов
  input.click();
});

// Обработчики событий для перетаскивания файлов
photoInput.addEventListener('dragover', function (event) {
  event.preventDefault();
  photoInput.classList.add('dragover');
});

photoInput.addEventListener('dragleave', function (event) {
  event.preventDefault();
  photoInput.classList.remove('dragover');
});

photoInput.addEventListener('drop', function (event) {
  event.preventDefault();
  photoInput.classList.remove('dragover');

  const files = event.dataTransfer.files;

  // Создаем элементы для каждого перетащенного файла и добавляем их в контейнер
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const customPhoto = createPhotoElement(file);
    loadPhotos.appendChild(customPhoto);

    // Отправляем фотографию на сервер
    uploadPhoto(file);
  }
});