import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";

export const Recommendation = (props) => {
  const userResult = useQuery(ME);

  console.log('User Data:', userResult.data)

  const favoriteResult = userResult.data?.me?.favoriteGenre;

  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genreToSearch: favoriteResult },
    skip: !favoriteResult,
  });

  if (!props.show) {
    return null;
  }

  if (userResult.loading) {
    return <div>Loading ...</div>;
  }

  if (userResult.error) {
    return <div> {userResult.error.message} </div>;
  }

  if (bookResult.loading) {
    return <div>Loading ...</div>;
  }

  if (bookResult.error) {
    return <div> {bookResult.error.message} </div>;
  }
  let books = bookResult.data.allBooks;

  if (!books) {
    books = [];
  }

  return (
    <>
      <h1>recommendations</h1>

      <p>
        books in your favorite genre <strong>{favoriteResult}</strong>{" "}
      </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
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
    </>
  );
};

export default Recommendation;
