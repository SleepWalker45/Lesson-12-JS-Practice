// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

User.create({
  email: 'test@mail.com',
  password: 123,
  role: 1,
})

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password', 'field-checkbox', 'field-select'],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        {value: User.USER_ROLE.USER, text: 'Пользователь'},
        {value: User.USER_ROLE.ADMIN, text: 'Администратор'},
        {value: User.USER_ROLE.DEVELOPER, text: 'Разработчик'},
      ]
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body;

  console.log(req.body);

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Ошибка. Обязательные поля отсутствуют!'
    })
  }

  try {
    const user = User.getByEmail(email);

    if (user) {
      return res.status(400).json({
        message: 'Ошибка. Пользователь с данным email уже существует!'
      })
    }
    User.create({ email, password, role });

    return res.status(200).json({
      message: 'Пользователь успешно создан!'
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Ошибка создания пользователя!'
    })
  }
})

router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/recovery', function (req, res) {
  const { email } = req.body;

  console.log(email);

  if (!email) {
    return res.status(400).json({
      message: 'Ошибка. Обязательныве поля отсутствуют!'
    })
  }

  try {
    const user = User.getByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: 'Пользователь с таким email не найден!'
      })
    }

    Confirm.create(email);

    return res.status(200).json({
      message: 'Код для восстановления отправлен!'
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
  
})

router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery Confirm',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/recovery-confirm', function(req, res) {
  const {password, code} = req.body;

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Ошибка.Обязательные поля отсутствуют!'
    })
  }

  try {

    const email = Confirm.getData(Number(code));

    if (!email) {
      return res.status(400).json({
        message: 'Код не существует!'
      })
    }

    const user = User.getByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: 'Пользователь не найден!'
      })
    }

    user.password = password;

    console.log(user);

    return res.status(200).json({
      message: 'Пароль изменён!'
    })

  } catch(err) {
    return res.status(400).json ({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
