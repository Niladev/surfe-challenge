import { useParams } from "react-router-dom";

const Note = () => {
  const { noteId } = useParams();
  return <div>Note: {noteId}</div>;
};

export default Note;
