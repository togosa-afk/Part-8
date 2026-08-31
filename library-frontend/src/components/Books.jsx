import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = (props) => {

  const [genres, setGenres] = useState('')

  const result = useQuery(ALL_BOOKS,{
    variables : {genreToSearch: genres}
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading ...</div>;
  }

  if (result.error) {
    return <div> {result.error.message} </div>;
  }

  let books = result.data.allBooks;

  if (!books) {
    books = [];
  }

  // const filteredBooks = books.filter(b => !genres || b.genres?.includes(genres))

  return (
    <div>
      <h2>books</h2>

      <p>in genre <strong> {genres} </strong> </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author?.name ?? "unknown author"}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenres('refactoring')}>refactoring</button>
        <button onClick={() => setGenres('agile')}>agile</button>
        <button onClick={() => setGenres('patterns')}>patterns</button>
        <button onClick={() => setGenres('design')}>design</button>
        <button onClick={() => setGenres('crime')}>crime</button>
        <button onClick={() => setGenres('classic')}>classic</button>
        <button onClick={() => setGenres('')}>all genres</button>
      </div>

    </div>
  );
};

export default Books;
