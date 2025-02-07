import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MonacoEditor from "@monaco-editor/react";
import { Copy } from "lucide-react";

import DOMPurify from "dompurify";
import parse from "html-react-parser";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import useHasExtension from "@/hook/useHasExtension";
import { BodyType, QueryAndHeader, RequestType } from "@/types";
import QueryParameters from "./QueryParameters";
import Body from "./Body";
import Headers from "./Headers";
import { useSendRequestMutation } from "@/services/mutation";
import { TabsContent } from "@radix-ui/react-tabs";
import RequestError from "./RequestErrorSvg";
import SendRequestSvg from "./SendRequestSvg";

const APIRequest = () => {
  const [queryParameters, setQueryParameters] = useState<QueryAndHeader[]>([
    { id: 1, key: "", value: "" },
  ]);
  const [headerList, setHeaderList] = useState<QueryAndHeader[]>([
    { id: 1, key: "", value: "" },
  ]);
  const [url, setUrl] = useState("http://localhost:3000");
  const [requestType, setRequestType] = useState<RequestType>("GET");
  const [bodyType, setBodyType] = useState<BodyType>("none");
  const [body, setBody] = useState("");

  const hasExtension = useHasExtension();

  const {
    mutateAsync: sendRequest,

    data,
    error,
    isPending,
  } = useSendRequestMutation();

  const sendApiRequest = async () => {
    if (!url) {
      toast.error("Endpoint can't be empty.");
      return;
    }

    const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
    const runtime = window.chrome.runtime;

    const data = {
      url,
      queryParams: queryParameters,
      headerList,
      body,
      requestType,
      bodyType,
    };
    console.log(data);
    await sendRequest({
      data,
      hasExtension,
      runtime,
      isLocalhost,
    });
  };
  const copyToClipboard = (data: string) => {
    navigator.clipboard.writeText(data);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-full min-h-screen py-6 ">
      <div className="w-full max-w-6xl mx-auto bg-background text-foreground p-6 rounded-sm dark:bg-[#121212] shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Select
            defaultValue={requestType}
            onValueChange={(value) => {
              setRequestType(value as RequestType);
            }}
          >
            <SelectTrigger className="w-16 sm:w-24">
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
        </div>
        {/* Tabs */}
        <div className=" w-full flex flex-col items-center gap-2">
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <QueryParameters
              queryParameters={queryParameters}
              setQueryParameters={setQueryParameters}
            />

            <Body
              body={body}
              bodyType={bodyType}
              setBodyType={setBodyType}
              setBody={setBody}
            />
            <Headers headerList={headerList} setHeaderList={setHeaderList} />
          </Tabs>
        </div>
        <div className="w-full flex flex-col pt-4 gap-2">
          <div className="pt-1 pb-2">
            <h3 className="text-lg text-muted-foreground">Response</h3>
          </div>
          {/* condentionally render error and response */}
          {!isPending && !error && !data ? (
            <Card className="w-full">
              <CardContent className="p-4 overflow-auto">
                <div className="w-full h-64  px-4 text-center flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <SendRequestSvg />
                  <h2 className="text-xl">Click send to get response.</h2>
                </div>
              </CardContent>
            </Card>
          ) : (error || (data && !data?.success)) && !isPending ? (
            <Card className="w-full ">
              <CardContent className="p-4 overflow-auto">
                <div className="w-full h-64  px-4 text-center flex flex-col items-center justify-center gap-4 text-red-500">
                  <RequestError />
                  <h2 className="text-xl">{error?.message || data?.message}</h2>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="body" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="cookie">Cookies</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="body" className="w-full overflow-auto">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64 ">
                      <Tabs defaultValue="raw" className="w-full">
                        <TabsList className="mb-2">
                          <TabsTrigger value="raw">Raw</TabsTrigger>
                          <TabsTrigger value="formated">Formated</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="raw">
                          <div className="h-52 overflow-scroll">
                            {JSON.stringify(data?.data, null, 2)}
                          </div>
                        </TabsContent>
                        <TabsContent value="formated" className="h-auto">
                          <MonacoEditor
                            className="h-52 w-full"
                            height="100%"
                            defaultLanguage={
                              data?.contentType &&
                              data?.contentType?.includes("json")
                                ? "json"
                                : "html"
                            }
                            defaultValue={
                              data?.contentType &&
                              data?.contentType?.includes("html")
                                ? data?.data
                                : JSON.stringify(data?.data, null, 2)
                            }
                            theme="vs-dark"
                            options={{
                              readOnly: true,
                              minimap: {
                                enabled: false,
                              },
                              wordWrap: "on",
                              wrappingIndent: "indent",
                            }}
                          />

                          {/* {JSON.stringify(data?.data, null, 2)} */}
                        </TabsContent>

                        <TabsContent value="preview">
                          {requestType === "GET" &&
                          data?.contentType &&
                          data?.contentType.includes("html") ? (
                            <iframe
                              className="w-full h-52 bg-white"
                              src={url}
                            ></iframe>
                          ) : data?.contentType &&
                            data?.contentType.includes("json") ? (
                            <pre className="h-52 overflow-scroll">
                              {JSON.stringify(data?.data, null, 2)}
                            </pre>
                          ) : (
                            <iframe
                              srcDoc={
                                data?.data || "<div>Unable to Preview.</div>"
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                              }}
                              sandbox="allow-scripts allow-same-origin" // Optional: Add security restrictions
                            />
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cookie">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64">
                      {data?.cookies &&
                        Object.keys(data?.cookies).map((key, index) => (
                          <div key={index} className="flex justify-between">
                            <p>
                              {key}: {data?.cookies[key]}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="headers">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64">
                      <div className="flex justify-between items-center ">
                        <h3 className="text-sm text-muted-foreground">
                          Header List
                        </h3>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(JSON.stringify(data?.headers))
                          }
                        >
                          <Copy className="w-4 h-4" />
                          <title>Copy all Headers</title>
                        </Button>
                      </div>
                      <div className=" space-y-1 h-56 overflow-y-auto">
                        {data?.headers &&
                          Object.keys(data?.headers).map((key, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr,2fr,auto] gap-4 p-2 items-center"
                            >
                              <Input placeholder="Key" value={key} readOnly />
                              <Input
                                placeholder="Value"
                                value={data?.headers[key]}
                                readOnly
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    `${key}:${data?.headers[key]}`
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIRequest;
