import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

function QueryParameters({
  queryParameters,
  deleteAllQueryParameters,
  addQueryParameter,
  updateParameter,
  deleteQueryParameter,
}) {
  return (
    <TabsContent value="parameters">
      <Card className="h-64">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm text-muted-foreground">Query Parameters</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={deleteAllQueryParameters}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={addQueryParameter}>
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
  );
}

export default QueryParameters;
