require('dotenv').config()

const connectToDatabase = require('./db')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = Number(process.env.PORT) || 4000

const main = async () => {
  try {
    await connectToDatabase(MONGODB_URI)
    await startServer(PORT)
  } catch (error) {
    console.error('Failed to start application:', error.message)
    process.exit(1)
  }
}

main()