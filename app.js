const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json({ extended: true }))

app.use(cors())
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/namespace', require('./routes/namespace.routes'))
app.use('/api/project', require('./routes/project.routes'))
app.use('/api/case', require('./routes/case.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    app.listen(5000, () => console.log(`Server has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start().then(() => {
  console.log('Ok')})