import { useQuery } from "@tanstack/react-query";
import Loader from "@components/Loader";
import { fetchNotes } from "src/queries";
import { Link } from "react-router-dom";

const Notes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });

  return (
    <div className="lg:w-3/6 w-full h-full">
      {isLoading && <Loader />}
      {error && <p>An error happened... Please try to refresh the page</p>}
      <ul className="w-full truncate overflow-hidden">
        {data?.map((note) => {
          return (
            <Link key={`note-${note.id}`} to={`/note/${note.id}`}>
              <li className="line-clamp-3 w-full h-24 p-5 border-b ">
                {note.body}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Notes;
