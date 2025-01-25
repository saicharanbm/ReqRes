import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useRef, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BodyProps, BodyType } from "@/types";
const Body: React.FC<BodyProps> = ({
  bodyType,
  setBodyType,
  body,
  setBody,
}) => {
  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Update editor language when bodyType changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, bodyType);
      }
    }
  }, [bodyType]);
  return (
    <TabsContent value="body">
      <Card className="h-64">
        <CardContent className="p-4">
          <div className="flex gap-2 items-center mb-4">
            <h3 className="text-sm text-muted-foreground">Content Type</h3>
            <Select
              value={bodyType}
              onValueChange={(value) => {
                console.log(value);
                setBodyType(value as BodyType);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">NONE</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="text">TEXT</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {bodyType === "none" ? (
            <div className="text-center py-4 text-muted-foreground">
              No content type selected, Please select a content type.
            </div>
          ) : (
            <MonacoEditor
              className="h-44 "
              height="100%"
              defaultLanguage={bodyType}
              defaultValue={body}
              theme="vs-dark"
              onChange={(data) => {
                console.log(data);
                setBody(data || "");
              }}
              onMount={handleEditorMount}
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Body;
