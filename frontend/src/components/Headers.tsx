import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HeaderProps } from "@/types";

const Headers: React.FC<HeaderProps> = ({ headerList, setHeaderList }) => {
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
  return (
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
                No headers added. Click the + button to add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Headers;
