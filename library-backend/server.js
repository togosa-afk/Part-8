const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')

const startServer = async (port = 4000) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port, host: 'localhost' },
    context: async ({ req }) => {
      const auth = req.headers.authorization || ''

      if (!auth.startsWith('Bearer ')) {
        return { currentUser: null }
      }

      const token = auth.substring(7)

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY')
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      } catch (error) {
        return { currentUser: null }
      }
    },
  })

  console.log(`Server ready at ${url}`)
  return url
}

module.exports = startServer
