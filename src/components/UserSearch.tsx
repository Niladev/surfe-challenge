const UserSearch = ({
  top,
  left,
  onClick,
  query,
}: {
  top: number;
  left: number;
  onClick: () => void;
  query: string;
}) => {
  return (
    <div
      onClick={() => onClick()}
      className="absolute w-16 h-16 bg-black"
      style={{
        top: top + 28,
        left: left,
      }}
    ></div>
  );
};

export default UserSearch;
