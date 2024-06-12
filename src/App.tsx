import Note from "@pages/Note";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="container h-full w-full mx-auto flex justify-center">
      <Routes>
        <Route index path="/:noteId?" element={<Note />} />
      </Routes>
    </div>
  );
};

export default App;
