import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

function MonacoEdit() {
  const [json, setJson] = useState("");

  return (
    <div className="w-full">
      <MonacoEditor
        height="200px"
        defaultLanguage="html"
        value={json}
        onChange={(value) => setJson(value || "")}
        onValidate={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
}

export default MonacoEdit;
