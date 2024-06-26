import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchNote, putNote } from "src/queries";
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
    queryKey: ["note", noteId],
    queryFn: () => fetchNote(parseInt(noteId!)),
  });
  const [content, setContent] = useState("");

  const userSearchSelection = useMemo(() => {
    const selection = document.getSelection();
    const focusNode = selection?.focusNode;

    if (
      !startOffset ||
      !endOffSet ||
      !focusNode ||
      !selection?.rangeCount ||
      endOffSet < startOffset
    ) {
      return "";
    }

    const range = selection?.getRangeAt(0).cloneRange();
    range?.setStart(focusNode, startOffset);
    range?.setEnd(focusNode, endOffSet);

    return range?.toString();
  }, [startOffset, endOffSet]);

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
    setContent(newContent);

    if (!isMentioning && noteId) {
      updateNoteMutation.debouncedMutate(
        { noteId: parseInt(noteId), body: newContent || "" },
        {
          onSuccess: () => {
            console.log("updated note successful");
          },
          debounceMs: 300,
        }
      );
    }
  };

  const handleUserClick = (name: string) => {
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
              value={name}
              className="bg-slate-500 capitalize text-white py-0 px-2 rounded "
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
          query={userSearchSelection || ""}
        />
      )}
    </div>
  );
};

export default Note;
