const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const getToken = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const userExtractor = async (request, response, next) => {
  const token = getToken(request)
  // console.log(token)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // console.log('decodedToken: ', decodedToken)
  const user = await User.findById(decodedToken.id)
  request.user = user
  // console.log('user: ', request.user)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ status: 'error', message: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ status: 'error', message: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ status: 'error', message: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ status: 'error', message: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ status: 'error', message: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ status: 'error', message: error.message })
  } else if (error.name === 'UnauthorizedError') {
    return response.status(401).json({ status: 'error', message: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler, 
  userExtractor
}