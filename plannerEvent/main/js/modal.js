//Получение элементов страницы

//Кнопка Войти на главной странице
const loginButton = document.getElementById('loginButton');

//Модальные окна для введения логина/пароля или регистрации
const loginModal = document.getElementById('loginModal');
const passwordModal = document.getElementById('passwordModal');
const registrationModal = document.getElementById('registrationModal');

//Кнопки закрытия модалок для введения логина/пароля или регистрации
const closeEmail = document.getElementById('close-email');
const closePassword = document.getElementById('close-password')
const closeRegistration = document.getElementById('close-registration');

//Кнопка Далее/Войти для введения логина/пароля
const continueLogin = document.getElementById('continue-login__button');
const continuePassword = document.getElementById('continue-password__button');

//Кнопка регистрации
const registerButton = document.getElementById('reg__button');

//Поля для введения логина/пароля
const emailInput = document.getElementById('enterEmail');
const passwordInput = document.getElementById('enterPassword');

//Поля для введения информации во время регистрации
const nameUser = document.getElementById('name-user');
const passwordRegInput = document.getElementById('reg-password');

//Поле для повторения пароля при регистрации
const regRepeatPassword = document.getElementById('reg-repeat-password');

//Сообщения об ошибках
const errorEmailMessage = document.getElementById('error-email');
const errorPasswordMessage = document.getElementById('error-password');
const errorRegMessage = document.getElementById('reg__error-message');
const regRules = document.getElementById('reg__rules');

//Фото показать/скрыть пароль
const imageClosePassword = document.getElementById('close-reg-password');
const imageOpenPassword = document.getElementById('open-reg-password');
const imageCloseRepeatPassword = document.getElementById('close-repeat-password');
const imageOpenRepeatPassword = document.getElementById('open-repeat-password');

//Модальные окна для событий в календаре
const modalEvent = document.getElementById('event__modal-section');
const closeModalEvent = document.getElementById('closeEventButton');

//Кнопка-приглашение для авторизации пользователя
const inviteEnterButton = document.getElementById('inviteEnter');

//Валидные email для регистрации пользователя
const validEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com', 'protonmail.com', 'mail.ru', 'yandex.ru', 'zoho.com', 'test.com'];

// Определение регулярного выражения для проверки пароля
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.,:;?!*+%<>@[\]{}\\_{}$#]).{8,32}$/;

const registrationUrl = 'https://planner.rdclr.ru/api/auth/local/register';

//Обработки кликов на различные кнопки
inviteEnterButton.addEventListener('click', function () {
    modalEvent.style.display = 'none'; 
    loginModal.style.display = 'block'; 
});

imageClosePassword.addEventListener('click', function () {
    imageOpenPassword.style.display = 'block';
    imageClosePassword.style.display = 'none';
    passwordRegInput.type = 'text';
});


imageOpenPassword.addEventListener('click', function () {
    imageClosePassword.style.display = 'block';
    imageOpenPassword.style.display = 'none';
    passwordRegInput.type = 'password';
});

imageCloseRepeatPassword.addEventListener('click', function () {
    imageOpenRepeatPassword.style.display = 'block';
    imageCloseRepeatPassword.style.display = 'none';
    regRepeatPassword.type = 'text';
});

imageOpenRepeatPassword.addEventListener('click', function () {
    imageCloseRepeatPassword.style.display = 'block';
    imageOpenRepeatPassword.style.display = 'none';
    regRepeatPassword.type = 'password';
});

loginButton.addEventListener('click', function () {
    loginModal.style.display = 'block';
});

closeEmail.addEventListener('click', function () {
    loginModal.style.display = 'none';
    passwordModal.style.display = 'none';
    emailInput.value = '';
});

closePassword.addEventListener('click', function () {
    passwordModal.style.display = 'none';
    emailInput.value = '';
    passwordInput.value = '';
});

closeModalEvent.addEventListener('click', function () {
    modalEvent.style.display = 'none';
});

closeRegistration.addEventListener('click', function () {
    registrationModal.style.display = 'none';
});


//отправка запроса на проверку наличия почты пользователя среди зарегистрированных
continueLogin.addEventListener('click', async function () {
    const email = emailInput.value;
    const errorMessage = emailInput.nextElementSibling;
    const domain = email.split('@')[1];


    if (!email || validEmailDomains.indexOf(domain) === -1) {
        emailInput.classList.add('input-error');
        errorEmailMessage.style.display = 'inline-block';
    } else {
        try {
            const response = await fetch(`https://planner.rdclr.ru/api/taken-emails/${email}`);

            if (response.status == 404) {
                emailInput.classList.remove('input-error');
                errorMessage.style.display = 'none';
                registrationModal.style.display = 'block';
                loginModal.style.display = 'none';
            } else if (response.ok) {
                let data = null;

                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error('Ошибка при разборе JSON:', jsonError);
                }

                if (data !== null) {
                    passwordModal.style.display = 'block';
                } else {
                    loginModal.style.display = 'none';
                    passwordModal.style.display = 'block';
                }
            } else {
                console.error('Ошибка при отправке запроса:', response.status);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }
});

//авторизация пользователя
continuePassword.addEventListener('click', async function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const autData = {
        "identifier": email,
        "password": password
    }
    try {
        const response = await fetch('https://planner.rdclr.ru/api/auth/local', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(autData)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.jwt;
            localStorage.setItem('authToken', JSON.stringify(token)); //токен пользователя
            window.location.href = '../site/index.html'; // Перенаправление на успешной авторизации
        } else {
            passwordInput.value = '';
            errorPasswordMessage.style.display = 'block';
            console.error('Ошибка при авторизации:', response.status);
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
});

//отправка запроса для регистрации пользователя
registerButton.addEventListener('click', async function () {
    const name = nameUser.value.trim();
    const password = passwordRegInput.value.trim();
    const repeatPassword = regRepeatPassword.value.trim();

    //Проверка на совпадение пароля и его повторения
    if (password !== repeatPassword) {
        errorRegMessage.style.display = 'inline-block';
        return; // Пароли не совпадают, выходим из функции
    } else {
        errorRegMessage.style.display = 'none';
    }
    // Проверка пароля по регулярному выражению
    if (!passwordRegex.test(password)) {
        regRules.style.display = 'inline-block';
        passwordRegInput.style.border = '1px solid #F51B1B';
        regRepeatPassword.style.border = '1px solid #F51B1B';
        return; // Пароль не соответствует требованиям, выходим из функции
    } else {
        errorRegMessage.style.display = 'none';

        const userData = {
            username: name,
            email: emailInput.value,
            password: password
        };

        try {
            const response = await fetch(registrationUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                window.location.href = '../site/index.html'; // Перенаправление на успешной регистрации
            } else {
                console.error('Ошибка при регистрации:', response.status);
                // Возможно, вы захотите показать сообщение об ошибке
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }
});

//Смена цвета кнопки при заполнении обязательных полей в модальном окне регистрации
const updateRegButton = () => {
    const isAnyFieldFilled =
        nameUser.value.trim() !== "" &&
        passwordRegInput.value.trim() !== "" &&
        regRepeatPassword.value.trim() !== "";

    if (isAnyFieldFilled) {
        registerButton.classList.add("disabled");
    } else {
        registerButton.classList.remove("disabled");
    }
}

//проверка на идентичность пароля и его повторения
const ifСoincidence = () => {
    if (passwordRegInput.value === regRepeatPassword.value) {
        regRepeatPassword.style.border = '1px solid #23AE00';
        passwordRegInput.style.border = '1px solid #23AE00';
        errorRegMessage.style.display = 'none';
    } else {
        regRepeatPassword.style.border = '1px solid #F51B1B';
        passwordRegInput.style.border = '1px solid #0D0C0C';
        errorRegMessage.style.display = 'block';
    }
}

//Отслеживание введения/очищения полей
nameUser.addEventListener("input", () => {
    updateRegButton(); //можно было и в одну строчку, но так приятнее выглядит
});

passwordRegInput.addEventListener("input", () => {
    updateRegButton();
    ifСoincidence();
});
regRepeatPassword.addEventListener("input", () => {
    updateRegButton();
    ifСoincidence();
});
