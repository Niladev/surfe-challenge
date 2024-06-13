import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "src/queries";
import loader from "@assets/loader.svg";
import { User } from "src/types";

const UserSearch = ({
  top,
  left,
  onClick,
  query,
}: {
  top: number;
  left: number;
  onClick: (name: string) => void;
  query: string;
}) => {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const renderFilteredUsers = () => {
    return data
      ?.sort((a, b) => {
        if (a.username.startsWith(query) && b.username.startsWith(query))
          return a.username.localeCompare(b.username);
        else if (a.username.startsWith(query)) return -1;
        else if (b.username.startsWith(query)) return 1;

        return a.username.localeCompare(b.username);
      })
      .slice(0, 5);
  };

  return (
    <div
      className="absolute w-1/6 overflow-y-scroll  border border-slate-500 rounded flex "
      style={{
        top: top + 28,
        left: left,
      }}
    >
      {isLoading && <img src={loader} />}
      {error && <p>There was an error fetching users.</p>}
      {data && (
        <ul className="w-full">
          {renderFilteredUsers()?.map((user) => (
            <li
              onClick={() => onClick(`${user.first_name} ${user.last_name}`)}
              className="w-full p-2 gap-0 cursor-default hover:bg-slate-500 hover:text-white"
            >
              <p className="capitalize m-0 p-0">{`${user.first_name} ${user.last_name}`}</p>{" "}
              <span className="text-xs mt-0">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
