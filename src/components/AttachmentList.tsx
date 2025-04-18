
import React from "react";
import { Attachment, AttachmentType, useTask } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { File, Link as LinkIcon, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttachmentListProps {
  taskId: string;
  attachments: Attachment[];
}

const AttachmentTypeIcon = ({ type }: { type: AttachmentType }) => {
  switch (type) {
    case "file":
      return <File className="h-4 w-4" />;
    case "link":
      return <LinkIcon className="h-4 w-4" />;
    case "email":
      return <Mail className="h-4 w-4" />;
    default:
      return null;
  }
};

const AttachmentList: React.FC<AttachmentListProps> = ({ taskId, attachments }) => {
  const { removeAttachment } = useTask();

  const handleRemove = (attachmentId: string) => {
    removeAttachment(taskId, attachmentId);
  };

  if (attachments.length === 0) {
    return <p className="text-sm text-muted-foreground">No attachments</p>;
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              attachment.type === "file" ? "bg-blue-50 text-blue-600" : "",
              attachment.type === "link" ? "bg-green-50 text-green-600" : "",
              attachment.type === "email" ? "bg-yellow-50 text-yellow-600" : ""
            )}>
              <AttachmentTypeIcon type={attachment.type} />
            </div>
            <div>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline"
              >
                {attachment.name}
              </a>
              <p className="text-xs text-muted-foreground">
                {new Date(attachment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(attachment.id)}
            className="h-8 w-8 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
