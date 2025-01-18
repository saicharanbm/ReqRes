import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Save, Send, HelpCircle, Trash2, PenSquare, Plus } from "lucide-react";

const APIRequest = () => {
  const [parameters, setParameters] = useState([
    { id: 1, key: "", value: "", description: "" },
  ]);

  const addParameter = () => {
    const newParam = {
      id: Date.now(), // Using timestamp as a simple unique id
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
    <div className="w-full max-w-6xl mx-auto bg-background dark:bg-[#18181b] text-foreground p-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <Select defaultValue="GET">
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
          placeholder="https://echo.hoppscotch.io"
          defaultValue="https://echo.hoppscotch.io"
        />

        <Button className="bg-violet-500 hover:bg-violet-600">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>

        <Button variant="outline" className="dark:bg-[#151516]">
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
          <TabsTrigger value="authorization">Authorization</TabsTrigger>
          <TabsTrigger value="pre-request">Pre-request Script</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters">
          <Card>
            <CardContent className="p-4 ">
              <div className="flex justify-between items-center mb-4 ">
                <h3 className="text-sm text-muted-foreground">
                  Query Parameters
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={deleteAllParameters}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <PenSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={addParameter}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {parameters.map((param) => (
                  <div
                    key={param.id}
                    className="grid grid-cols-[1fr,1fr,1fr,auto] gap-4 items-center"
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

        {/* Other tab contents would go here */}
      </Tabs>
    </div>
  );
};

export default APIRequest;
