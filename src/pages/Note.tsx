import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { fetchNote, postNote, putNote } from "src/queries";
import { useDebouncedMutation } from "@hooks/useDebouncedMutation";
import { useQuery } from "@tanstack/react-query";

const Note = () => {
  const { noteId } = useParams();
  const textDivRef = useRef<HTMLDivElement>(null);
  const { data: note, isLoading } = useQuery({
    queryKey: ["note"],
    queryFn: () => fetchNote(parseInt(noteId!)),
    enabled: Boolean(noteId),
  });
  const [content, setContent] = useState(note?.body || "");
  const navigate = useNavigate();

  const createNoteMutation = useDebouncedMutation({
    mutationFn: postNote,
  });
  const updateNoteMutation = useDebouncedMutation({
    mutationFn: putNote,
  });

  useEffect(() => {
    if (content.length === 0 && !isLoading && note?.body) {
      setContent(note.body);
      if (textDivRef.current) {
        textDivRef.current.innerHTML = note.body;
      }
    }
  }, [note, isLoading, content]);

  const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.innerHTML;
    setContent(newContent || "");

    if (!noteId) {
      createNoteMutation.debouncedMutate(newContent || " ", {
        onSuccess: async (data) => {
          const note = await data;
          navigate(`/${note.id}`, { replace: true });
        },
        debounceMs: 500,
      });
    } else {
      updateNoteMutation.debouncedMutate(
        { noteId: parseInt(noteId), body: newContent || "" },
        {
          onSuccess: () => {
            console.log("updated note successful");
          },
          debounceMs: 500,
        }
      );
    }
  };

  return (
    <div
      role="textbox"
      contentEditable={true}
      onInput={handleChange}
      ref={textDivRef}
      className="lg:w-3/6 w-full text-xl p-5 focus:outline-none text-wrap break-words"
    />
  );
};

export default Note;
