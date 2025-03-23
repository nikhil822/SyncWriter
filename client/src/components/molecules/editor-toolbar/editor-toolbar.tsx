import { useContext } from "react";
import { EditorContext } from "../../../contexts/editor-context";
import { EditorState } from "draft-js";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import FontSelect from "../../atoms/font-select/font-select";

const EditorToolbar = () => {
  const { editorState, setEditorState } = useContext(EditorContext);

  const undo = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const redo = () => {
    setEditorState(EditorState.redo(editorState));
  };

  return (
    <div className="w-full h-12 flex justify-between items-center px-4 border-b">
      <div className="flex items-center space-x-2">
        <button
          onClick={undo}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
        <div className="h-6 w-[1px] bg-gray-300 mx-2" />
        <FontSelect />
      </div>
    </div>
  );
};

export default EditorToolbar;
