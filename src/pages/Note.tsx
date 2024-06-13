import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNote, postNote, putNote } from "src/queries";
import { useDebouncedMutation } from "@hooks/useDebouncedMutation";
import { useQuery } from "@tanstack/react-query";
import UserSearch from "src/components/UserSearch";
import ReactDOMServer from "react-dom/server";

const Note = () => {
  const [isMentioning, setIsMentioning] = useState(false);
  const [selectedBounding, setSelectedBounding] = useState({ top: 0, left: 0 });
  const [focusNode, setFocusNode] = useState<Node | undefined | null>(null);
  const [startOffset, setStartOffset] = useState(0);
  const [endOffSet, setEndOffset] = useState(0);
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

  const handleStartMention = useCallback(
    (event: KeyboardEvent) => {
      if (isMentioning) {
        const selection = document.getSelection();
        setEndOffset(selection?.focusOffset || 0);
        if (
          !selection ||
          !selection.focusOffset ||
          selection.focusOffset < startOffset ||
          event.code === "Space" ||
          event.code === "Enter"
        ) {
          setIsMentioning(false);
        }
      }

      if (event.key === "@") {
        const selection = document.getSelection();
        const range = selection?.getRangeAt(0);
        const bounding = range?.getBoundingClientRect();
        setFocusNode(selection?.focusNode);
        setStartOffset(selection?.focusOffset || 0);
        if (bounding) {
          setSelectedBounding(bounding);
        }
        if (selection?.focusOffset) {
          setStartOffset(selection.focusOffset);
        }
        setIsMentioning(true);
      }
    },
    [isMentioning, startOffset]
  );

  useEffect(() => {
    if (content.length === 0 && !isLoading && note?.body) {
      setContent(note.body);
      if (textDivRef.current) {
        textDivRef.current.innerHTML = note.body;
      }
    }
  }, [note, isLoading, content]);

  useEffect(() => {
    document.addEventListener("keyup", handleStartMention);

    return () => {
      document.removeEventListener("keyup", handleStartMention);
    };
  }, [handleStartMention]);

  const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.innerHTML;

    setContent(newContent || "");

    if (!noteId) {
      createNoteMutation.debouncedMutate(newContent || " ", {
        onSuccess: async (data) => {
          const note = data;
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

  const handleUserClick = () => {
    const sel = document.getSelection();
    if (sel?.rangeCount && focusNode) {
      const range = sel.getRangeAt(0);

      range.setStart(
        focusNode,
        startOffset === 0 ? startOffset : startOffset - 1
      );
      range.setEnd(focusNode, endOffSet);

      document.execCommand(
        "insertHTML",
        false,
        ReactDOMServer.renderToString(
          <>
            <input
              type="button"
              value="Nicklas Jensen"
              className="bg-slate-500  text-white py-0 px-2 rounded "
            />
            <span>&nbsp;</span>
          </>
        )
      );

      sel.collapseToEnd();

      setIsMentioning(false);
    }
  };

  return (
    <div className="lg:w-3/6 w-full h-full">
      <div
        role="textbox"
        contentEditable={true}
        onInput={handleChange}
        ref={textDivRef}
        autoCorrect="off"
        className="w-full h-full text-xl p-5 focus:outline-none text-wrap break-words leading-9"
      />
      {isMentioning && (
        <UserSearch
          top={selectedBounding.top}
          left={selectedBounding.left}
          onClick={handleUserClick}
          query={""}
        />
      )}
    </div>
  );
};

export default Note;
