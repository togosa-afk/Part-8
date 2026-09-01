import { useMutation } from "@apollo/client/react";

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

import { useState } from "react";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      setError(error.message);
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook;

      cache.updateQuery({ query: ALL_BOOKS, variables: { genreToSearch: "" } }, (data) => {
        if (!data) return null;
        const isDuplicate = data.allBooks.some((b) => b.id === addedBook.id);
        if (isDuplicate) return data;
        return { allBooks: data.allBooks.concat(addedBook) };
      });

      cache.updateQuery(
        { query: ALL_AUTHORS },
        (data) => {
          if (!data) return null;

          const authorInCache = data.allAuthors.find(
            (a) => a.name === addedBook.author.name,
          );

          if (authorInCache) {
            return {
              allAuthors: data.allAuthors.map((a) =>
                a.name === addedBook.author.name
                  ? { ...a, bookCount: a.bookCount + 1 }
                  : a,
              ),
            };
          } else {
            return {
              allAuthors: data.allAuthors.concat(addedBook.author),
            };
          }
        },
      );
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      await createBook({
        variables: { title, author, published: Number(published), genres },
      });

      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
      setGenre("");
      setError("");
      props.setPage?.("books");
    } catch (error) {
      setError(error.message);
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
          />
        </div>
        <div>
          <label htmlFor="published">published</label>
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            id="published"
          />
        </div>
        <div>
          <label htmlFor="genre">genre</label>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
            id="genre"
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
