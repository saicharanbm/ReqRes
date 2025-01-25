import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorImage from "../assets/error.svg";
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
    await sendRequest({
      data,
      hasExtension,
      runtime,
      isLocalhost,
    });
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

          {/* <Button variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button> */}
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
          ) : error && !isPending ? (
            <Card className="w-full ">
              <CardContent className="p-4 overflow-auto">
                <div className="w-full h-64  px-4 text-center flex flex-col items-center justify-center gap-4 text-red-500">
                  <RequestError />
                  <h2 className="text-xl">{error.message}</h2>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="raw" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="raw">Raw</TabsTrigger>
                <TabsTrigger value="formated">Formated</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>

              <TabsContent value="raw">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64">
                      {JSON.stringify(data?.data, null, 2)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="formated">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64">
                      {JSON.stringify(data?.data, null, 2)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="headers">
                <Card className="w-full ">
                  <CardContent className="p-4 overflow-auto">
                    <div className="w-full h-64">
                      {JSON.stringify(isPending, null, 2)}
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
