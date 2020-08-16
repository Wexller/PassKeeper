const {Router} = require('express')
const {check, validationResult} = require('express-validator')
const Namespace = require('../models/Namespace')
const Project = require('../models/Project')
const Case = require('../models/Case')
const User = require('../models/User')
const router = Router()
const auth = require('../middleware/auth.middleware')

// GET /api/namespace
router.get('/', auth, async (req, res) => {
  try {
    const namespaces = await Namespace.find({ users: req.user['userId'] })

    const projectIds = namespaces.reduce((prev, curr) => {
      prev.push(...curr.projects)
      return prev
    }, [])

    if (projectIds.length) {
      const projectsQuery = await Project.find({ _id: {'$in': projectIds}})

      const projectsArr = projectsQuery.map(project => ({
          _id: project._id,
          name: project.name,
          description: project.description || '',
          cases: project.cases
        }))

      const namespaceArr = namespaces.map(n => {
        const projects = []

        for (const projectId of n.projects) {
          const project = projectsArr.find(p => JSON.stringify(projectId) === JSON.stringify(p._id))
          projects.push(project)
        }

        return {
          _id: n._id,
          name: n.name,
          projects
        }
      })

      return res.status(200).json(namespaceArr)
    }

    res.status(200).json(namespaces)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// POST /api/namespace
router.post('/', [
  check('name').exists(),
  auth
], async (req, res) => {
  try {
    const errors = validationResult(req)
    const { userId } = req.user

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Пустое название'
      })
    }

    const {name} = req.body

    const candidate = await Namespace.findOne({ name })

    if (candidate) {
      return res.status(400).json({ message: 'Такое объединение уже существует' })
    }

    const namespace = new Namespace({name, users: [userId]})
    await namespace.save( async (err, saved) => {
      await User.findByIdAndUpdate(userId, {'$push': { namespaces: saved._id }})
    })

    res.status(201).json({ message: 'Объединение создано' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// DELETE /api/namespace/:id
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params
    if (!id) {
      return res.status(400).json({ message: 'Не выбрано объединение' })
    }
    await Namespace.findOneAndDelete({ _id: id}, async err => {
      if (!err) {
        const projects = await Project.find({namespace: id})

        const arProjectIds = []
        for (const project of projects) {
          arProjectIds.push(project._id)
        }

        await Project.deleteMany({namespace: id})
        await Case.deleteMany({project: {'$in': arProjectIds}})
        res.status(200).json({ message: 'Объединение удалено' })
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