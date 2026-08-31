import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `
    query {
        allAuthors {
            name
            born
            bookCount
            id
        }
    }
`

export const ALL_BOOKS = gql `
    query AllBooks($genreToSearch: String) {
        allBooks(genre: $genreToSearch) {
            title
            author {
                name
            }
            published
            id
            genres
        }
  }
`

export const ME = gql`
    query{ 
        me{
            username
            favoriteGenre
        }
    }
` 

export const CREATE_BOOK = gql`
    mutation createBook(
        $title: String!
        $published: Int!
        $author: String!
        $genres:[String!]!
    ){
        addBook(title: $title, published: $published, author: $author, genres: $genres) {
            title
            published
            author {
                name
            }
            genres
            id
        }
    }
`

export const UPDATE_AUTHOR = gql `
    mutation updateAuthor(
        $name:String!
        $setBornTo:Int!
    ){
        editAuthor(name: $name, setBornTo: $setBornTo ){
            name
            born
            id
        }
    }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)  {
        value
        }
    }
`