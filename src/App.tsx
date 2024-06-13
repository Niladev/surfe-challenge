import Note from "@pages/Note";
import { Route, Routes } from "react-router-dom";
import Header from "@components/Header";
import Notes from "@pages/Notes";

const App = () => {
  return (
    <div className="container h-full w-full mx-auto flex items-center flex-col">
      <Header />
      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/note/:noteId" element={<Note />} />
      </Routes>
    </div>
  );
};

export default App;
