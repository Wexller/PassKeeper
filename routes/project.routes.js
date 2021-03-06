const {Router} = require('express')
const router = Router()

const {check, validationResult} = require('express-validator')
const Project = require('../models/Project')
const Namespace = require('../models/Namespace')

// GET /api/project
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
    res.status(201).json(projects)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// POST /api/project
router.post('/', [
  check('projectName').exists(),
  check('namespaceId').exists()
], async (req, res) => {
  try {
    if (!req.body.namespaceId) {
      return res.status(400).json({ message: 'Не выбрано объединение' })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Неверные данные'
      })
    }

    const {projectName, namespaceId} = req.body

    const namespaceDb = await Namespace.findOne({ _id: namespaceId })
    const candidate = await Project
      .findOne({ name: projectName, namespace: namespaceDb })

    if (candidate) {
      return res.status(400).json({ message: 'Такой проект в этом объединении уже существует' })
    }

    const project = new Project({ name: projectName, namespace: namespaceDb })
    await project.save()

    await Namespace.findByIdAndUpdate(namespaceDb._id, { '$push': {projects: project}})

    res.status(201).json({ message: 'Новый проект добавлен' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// DELETE /api/project/:id
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params

    if (!id) {
      return res.status(400).json({ message: 'Не выбран проект' })
    }

    const {namespaceId} = await Project.findById(id)

    await Project.findOneAndDelete({ _id: id}, async err => {
      if (!err) {
        if (namespaceId) {
          await Namespace.update({ _id: namespaceId}, {
            '$pull': {
              projects: id
            }
          })
        }
        res.status(200).json({ message: 'Проект удален' })
      } else {
        res.status(400).json({ message: `Произошла ошибка ${err}` })
      }
    })

  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// router.get('/:id', async (req, res) => {
//   try {
//     const {id} = req.params
//
//     const {namespace} = await Project.findById(id)
//
//     res.status(200).json(namespace)
//   } catch (e) {
//     console.log(e)
//     res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
//   }
//
// })

module.exports = router