import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendation from './components/Recommendation'
import { useApolloClient } from "@apollo/client/react";

const App = () => {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("book-lib-user"));
  const [errorMessage, setErrorMessage] = useState(null);

  const client = useApolloClient();

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("book-lib-user");
    client.resetStore();
    setPage("login");
  };

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage("login")}>login</button>
          <button onClick={() => setPage("authors")}>authors</button>
          <button onClick={() => setPage("books")}>books</button>
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <LoginForm show={page === "login"} setToken={setToken} setError={setErrorMessage} />
        <Authors show={page === "authors"} />
        <Books show={page === "books"} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommendation")}>recommendation</button>
        <button onClick={onLogout}>logout</button>
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Recommendation show={page === "recommendation"} />
    </div>
  );
};

export default App;
