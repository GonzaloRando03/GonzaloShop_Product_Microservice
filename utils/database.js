const mongoose = require('mongoose')
const logger = require('./logger')
const config = require('./config')

const connectDatabase = () => {
    mongoose.set('strictQuery', true)
    logger.info('connecting to', config.MONGODB_URI)

    mongoose.connect(config.MONGODB_URI).then(() => {
        logger.info('Connected to Database')
    }).catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })
}

module.exports = connectDatabase