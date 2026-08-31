const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    authorCount: async () => Author.countDocuments(),
    bookCount: async () => Book.countDocuments(),

    allBooks: async (root, args) => {
      const query = {}

      if (args.author) { 
        const findAuthor = await Author.findOne({ name: args.author })
        if (!findAuthor) {
          return []
        }
        query.author = findAuthor._id  
      }

      if (args.genre) {
        query.genres = args.genre
      }

      return Book.find(query).populate('author')
    },

    allAuthors: async () => Author.find({}),

    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      
      try {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }

        if (await Book.findOne({ title: args.title })) {
          throw new GraphQLError(`Title must be unique: ${args.title}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title
            }
          })
        }

        const book = new Book({ ...args, author: author._id })
        await book.save()
        await book.populate('author')
        return book
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      
      let author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      await author.save()
      return author
    },

    createUser: async (root, args) => {
      if (!args.password || args.password.length < 3) {
        throw new GraphQLError('password is required and must be at least 3 characters', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const passwordHash = await bcrypt.hash(args.password, 10)

      const user = new User({ 
        username: args.username, 
        favoriteGenre: args.favoriteGenre,
        password: passwordHash
      })

      try {
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.username, error }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user && args.password
        ? await bcrypt.compare(args.password, user.password || user.passwordHash || '')
        : false

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET || 'SECRET_KEY') }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id })
    }
  }
}

module.exports = resolvers