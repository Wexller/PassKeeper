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

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    app.listen(5000, () => console.log(`Server has benn started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start().then(() => {
  console.log('Ok')})