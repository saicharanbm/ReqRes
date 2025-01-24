import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
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
import { apiRequest } from "@/services/api";

const APIRequest = () => {
  const [queryParameters, setQueryParameters] = useState([
    { id: 1, key: "", value: "" },
  ]);
  const [headerList, setHeaderList] = useState([{ id: 1, key: "", value: "" }]);
  const [url, setUrl] = useState("http://localhost:3000");
  const [requestType, setRequestType] = useState("GET");
  const [bodyType, setBodyType] = useState("none");
  const [body, setBody] = useState("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Add state for extension status
  const [hasExtension, setHasExtension] = useState(false);

  // Check for extension on mount
  useEffect(() => {
    const checkExtension = () => {
      // Check for any Chromium-based browser's extension API
      if (window.chrome?.runtime || (window as any).browser?.runtime) {
        const runtime =
          window.chrome?.runtime || (window as any).browser?.runtime;

        // Try to communicate with extension
        runtime.sendMessage(
          "nbgnlealnfkpjabjpffdgodlojacdlaf",
          { type: "CHECK_INSTALLED" },
          (response) => {
            console.log(response);
            setHasExtension(!!response);
          }
        );
      }
    };

    checkExtension();
  }, []);

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

  const addQueryParameter = () => {
    const newParam = {
      id: Date.now(),
      key: "",
      value: "",
      description: "",
    };
    setQueryParameters([...queryParameters, newParam]);
  };

  const deleteQueryParameter = (id: number) => {
    setQueryParameters(queryParameters.filter((param) => param.id !== id));
  };

  const deleteAllQueryParameters = () => {
    setQueryParameters([]);
  };

  const updateParameter = (id: number, field: string, value: string) => {
    setQueryParameters(
      queryParameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const addHeaderList = () => {
    const newHeader = {
      id: Date.now(),
      key: "",
      value: "",
      description: "",
    };
    setHeaderList([...headerList, newHeader]);
  };

  const deleteHeaderList = (id: number) => {
    setHeaderList(headerList.filter((header) => header.id !== id));
  };

  const deleteAllHeaderLists = () => {
    setHeaderList([]);
  };

  const updateHeader = (id: number, field: string, value: string) => {
    setHeaderList(
      headerList.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const sendApiRequest = async () => {
    if (!url) {
      toast.error("Endpoint can't be empty.");
      return;
    }

    const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
    const runtime = window.chrome?.runtime || (window as any).browser?.runtime;

    try {
      if (hasExtension && runtime) {
        // Send request through extension
        const response = await new Promise((resolve, reject) => {
          runtime.sendMessage(
            "nbgnlealnfkpjabjpffdgodlojacdlaf",
            {
              type: "MAKE_REQUEST",
              data: {
                url,
                queryParams: queryParameters,
                headerList,
                body,
                requestType,
                bodyType,
              },
            },
            (response) => {
              if (response?.error) {
                reject(new Error(response.error));
              } else {
                resolve(response);
              }
            }
          );
        });

        console.log("Response from extension:", response);
        toast.success("Request successful");
        return;
      }
      if (isLocalhost && (!hasExtension || !runtime)) {
        toast.error(
          "To test localhost APIs, please install our browser extension or use a tunneling service like ngrok"
        );
        return;
      }
      // Your existing non-localhost request handling
      const data = {
        url,
        queryParams: queryParameters,
        headerList,
        body,
        requestType,
        bodyType,
      };
      const response = await apiRequest(data);
      console.log("resoonse from backend", response);
    } catch (error) {
      toast.error(`Request failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-background text-foreground p-6 rounded-sm dark:bg-[#121212] shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <Select
          defaultValue={requestType}
          onValueChange={(value) => {
            setRequestType(value);
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
          placeholder="Enter a URL"
          defaultValue={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />

        <Button
          className="bg-violet-500 hover:bg-violet-600"
          onClick={sendApiRequest}
        >
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
                    onClick={deleteAllQueryParameters}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={addQueryParameter}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 h-44 overflow-y-auto">
                {queryParameters.map((param) => (
                  <div
                    key={param.id}
                    className="grid grid-cols-[1fr,2fr,auto] gap-4 p-2 items-center"
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

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteQueryParameter(param.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {queryParameters.length === 0 && (
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
              {bodyType === "none" ? (
                <div className="text-center py-4 text-muted-foreground">
                  No content type selected, Please select a content type.
                </div>
              ) : (
                <MonacoEditor
                  className="h-44"
                  height="100%"
                  defaultLanguage={bodyType}
                  defaultValue={body}
                  theme="vs-dark"
                  onChange={(data) => {
                    setBody(data || "");
                  }}
                  onMount={handleEditorMount}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers">
          <Card className="h-64">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm text-muted-foreground">Header List</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteAllHeaderLists}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <Button variant="ghost" size="icon" onClick={addHeaderList}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 h-44 overflow-y-auto">
                {headerList.map((header) => (
                  <div
                    key={header.id}
                    className="grid grid-cols-[1fr,2fr,auto] gap-4 p-2 items-center"
                  >
                    <Input
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) =>
                        updateHeader(header.id, "key", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) =>
                        updateHeader(header.id, "value", e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHeaderList(header.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {headerList.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No parameters added. Click the + button to add one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIRequest;
