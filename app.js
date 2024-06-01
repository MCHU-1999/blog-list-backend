const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// establish a connection to database
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to mongo DB')
  })
  .catch((error) => {
    logger.info('error connecting mongo DB', error.message)
  })

const app = express()

// preprocess
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
// app.use(middleware.userExtractor)

// routers
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// unknown routes and error handling
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app