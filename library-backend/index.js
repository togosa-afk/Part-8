const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config()
const mongoose = require('mongoose')
const connectToDatabase = require('./db')

connectToDatabase(process.env.MONGODB_URI)

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.get('authorization') : null

    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.substring(7)
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY')

      const currentUser = await User.findById(decodedToken.id)

      return { currentUser }
    }
  },
})