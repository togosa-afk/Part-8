

const typeDefs = /* GraphQL */ `
  type Authors {
    name: String!
    born: Int
    bookCount: Int!
    id:ID!
  }

  type Books {
    title: String!
    published: Int!
    author: Author!
    genres:[String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Books!]!
    allAuthors: [Authors!]!
    me:User
  }

  type Mutation{
    addBook(
      title: String!
      published: Int!
      author: String!
      genres:[String!]!
    ):Books!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Authors

    createUser(
    username: String!
    favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
    
    _resetDatabase: Boolean
  }
`
module.exports = typeDefs