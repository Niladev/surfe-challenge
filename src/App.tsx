import Note from "@pages/Note";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/:noteId?" element={<Note />} />
      </Routes>
    </>
  );
};

export default App;
