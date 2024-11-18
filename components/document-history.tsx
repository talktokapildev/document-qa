import { DocumentMetadata } from "@/lib/types";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface DocumentHistoryProps {
  documents: DocumentMetadata[];
  onSelect: (documentId: string) => void;
  currentId?: string;
}

export function DocumentHistory({
  documents,
  onSelect,
  currentId,
}: DocumentHistoryProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Document History</h2>
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents uploaded yet.
        </p>
      ) : (
        <ScrollArea className="h-[300px]">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`p-3 rounded-lg mb-2 transition-colors ${
                currentId === doc.id ? "bg-primary/10" : "hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelect(doc.id)}
                >
                  {doc.filename}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </Card>
  );
}