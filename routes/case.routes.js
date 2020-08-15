const {Router} = require('express')
const router = Router()
const {encrypt, decrypt} = require('../utils/encryption')
const {check, validationResult} = require('express-validator')
const Project = require('../models/Project')
const Case = require('../models/Case')

// GET /api/case
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find()
    const decryptedCases = cases.map(item => ({
      _id: item._id,
      login: decrypt(item.login),
      password: decrypt(item.password),
      link: decrypt(item.link)
    }))
    res.status(201).json(decryptedCases)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// GET /api/case/:projectId
router.get('/:project', async (req, res) => {
  try {
    const {project} = req.params;

    if (!project) {
      return res.status(400).json({ message: 'Нет проекта' })
    }

    const item = await Case.find({ project })
    const decryptedCases = item.map(item => ({
      _id: item._id,
      login: decrypt(item.login),
      password: decrypt(item.password),
      link: decrypt(item.link)
    }))
    res.status(201).json(decryptedCases)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// POST /api/case
router.post('/', [
  check('projectId').exists(),
  check('login').exists(),
  check('password').exists()
], async (req, res) => {
  try {
    const {projectId, login, password, link} = req.body

    if (!projectId) {
      return res.status(400).json({ message: 'Нет проекта для закрепления' })
    }

    if (!login) {
      return res.status(400).json({ message: 'Не введен логин' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Не введен пароль' })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Неверные данные'
      })
    }

    const caseOb = new Case({
      login: encrypt(login),
      password: encrypt(password),
      link: encrypt(link),
      project: projectId
    })
    await caseOb.save()

    await Project.findByIdAndUpdate(projectId, { '$push': {cases: caseOb} })

    res.status(201).json({ message: 'Новая запись добавлена' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// PUT /api/case/:id
router.put('/:id', [
  check('login').exists(),
  check('password').exists()
], async (req, res) => {
  const {id} = req.params
  const {login, password, link} = req.body

  if (!id) {
    return res.status(400).json({ message: 'Неверный Кейс' })
  }

  if (!login) {
    return res.status(400).json({ message: 'Не введен логин' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Не введен пароль' })
  }

  await Case.findByIdAndUpdate(id, {
    login: encrypt(login),
    password: encrypt(password),
    link: encrypt(link),
  }, async err => {
    if (!err) {
      res.status(200).json({ message: 'Кейс обновлен' })
    } else {
      res.status(400).json({ message: `Произошла ошибка ${err}` })
    }
  })

})

// DELETE /api/case/:id
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params

    if (!id) {
      return res.status(400).json({ message: 'Неверный Кейс' })
    }

    await Case.findByIdAndRemove(id, async err => {
      if (!err) {
        res.status(200).json({ message: 'Кейс удалён' })
      } else {
        res.status(400).json({ message: `Произошла ошибка ${err}` })
      }
    })

  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router