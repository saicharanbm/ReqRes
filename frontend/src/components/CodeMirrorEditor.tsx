import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

import React from "react";

function CodeMirrorEditor() {
  return (
    <div className="w-full h-36">
      <CodeMirror
        className="w-full h-full"
        height="220px"
        extensions={[json()]}
        // onChange={(value) => setValue(value)}
      />
    </div>
  );
}

export default CodeMirrorEditor;
