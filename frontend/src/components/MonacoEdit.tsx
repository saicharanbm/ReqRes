import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

function MonacoEdit() {
  const [json, setJson] = useState("");

  return (
    <div className="w-full h-64">
      <MonacoEditor
        height="100%"
        defaultLanguage="json"
        value={json}
        onChange={(value) => setJson(value || "")}
        onValidate={(value) => {
          console.log(value);
        }}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
}

export default MonacoEdit;
