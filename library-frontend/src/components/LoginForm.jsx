import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken } , props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const client = useApolloClient()

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('book-lib-user', token)
      client.resetStore()
      setError(null)
    },
    onError: (error) => {
      setError(error.message)
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  // if (!props.show) {
  //   return null
  // }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm