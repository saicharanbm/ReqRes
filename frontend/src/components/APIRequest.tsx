import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Send, Trash2, Plus } from "lucide-react";

const APIRequest = () => {
  const [parameters, setParameters] = useState([
    { id: 1, key: "", value: "", description: "" },
  ]);
  const [selectedTab, setSelectedTab] = useState("GET");
  const [bodyType, setBodyType] = useState("none");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  // Update editor language when bodyType changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, bodyType);
      }
    }
  }, [bodyType]);

  const verifyLanguage = () => {
    const model = editorRef.current?.getModel();
    const currentLanguage = model?.getLanguageId();
    alert(`Current language: ${currentLanguage}`);
  };

  const addParameter = () => {
    const newParam = {
      id: Date.now(),
      key: "",
      value: "",
      description: "",
    };
    setParameters([...parameters, newParam]);
  };

  const deleteParameter = (id: number) => {
    setParameters(parameters.filter((param) => param.id !== id));
  };

  const deleteAllParameters = () => {
    setParameters([]);
  };

  const updateParameter = (id: number, field: string, value: string) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-background text-foreground p-6 rounded-sm dark:bg-[#121212] shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          defaultValue={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(value);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="flex-1"
          placeholder="http://localhost:3000"
          defaultValue="http://localhost:3000"
        />

        <Button className="bg-violet-500 hover:bg-violet-600">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>

        <Button variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <Card className="h-64">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm text-muted-foreground">
                  Query Parameters
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteAllParameters}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={addParameter}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 h-44 overflow-y-auto">
                {parameters.map((param) => (
                  <div
                    key={param.id}
                    className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 p-2 items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) =>
                        updateParameter(param.id, "key", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) =>
                        updateParameter(param.id, "value", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Description"
                      value={param.description}
                      onChange={(e) =>
                        updateParameter(param.id, "description", e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteParameter(param.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {parameters.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No parameters added. Click the + button to add one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body">
          <Card className="h-64">
            <CardContent className="p-4">
              <div className="flex gap-2 items-center mb-4">
                <h3 className="text-sm text-muted-foreground">Content Type</h3>
                <Select
                  value={bodyType}
                  onValueChange={(value) => {
                    setBodyType(value);
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
                <button onClick={verifyLanguage}>Verify Language</button>
              </div>
              {bodyType !== "none" && (
                <MonacoEditor
                  className="h-44"
                  height="100%"
                  defaultLanguage={bodyType}
                  defaultValue=""
                  theme="vs-dark"
                  onMount={handleEditorMount}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIRequest;
