import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { apiRequest } from "@/services/api";
import useHasExtension from "@/hook/useHasExtension";
import { BodyType, QueryAndHeader, RequestType } from "@/types";
import QueryParameters from "./QueryParameters";
import Body from "./Body";
import Headers from "./Headers";
import { useSendRequestMutation } from "@/services/mutation";

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
    mutation: sendApiRequest,
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

    try {
      const data = {
        url,
        queryParams: queryParameters,
        headerList,
        body,
        requestType,
        bodyType,
      };
      if (hasExtension && runtime) {
        // Send request through extension
        const response = await new Promise((resolve, reject) => {
          runtime.sendMessage(
            "nbgnlealnfkpjabjpffdgodlojacdlaf",
            {
              type: "MAKE_REQUEST",
              data,
            },
            (response: any) => {
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

      const response = await apiRequest(data);
      console.log("resoonse from backend", response);
    } catch (error) {
      toast.error(`Request failed: ${error.message}`);
    }
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
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="parameters">Raw</TabsTrigger>
              <TabsTrigger value="body">Formated</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            <Card className="w-full h-64">
              <CardContent className="p-4 "></CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default APIRequest;
