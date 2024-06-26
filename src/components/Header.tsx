import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { postNote } from "src/queries";

const Header = () => {
  const navigate = useNavigate();
  const createNoteMutation = useMutation({
    mutationFn: postNote,
  });
  const createNewNote = () => {
    createNoteMutation.mutate(" ", {
      onSuccess: async (data) => {
        const note = data;
        navigate(`/note/${note.id}`);
      },
    });
  };

  return (
    <header className="container lg:w-3/6 w-full mt-5 px-3 flex justify-between">
      <Link to="/notes">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
      </Link>
      <button onClick={createNewNote}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </header>
  );
};

export default Header;
