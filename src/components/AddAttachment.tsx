
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttachmentType, useTask } from "@/contexts/TaskContext";
import { Paperclip } from "lucide-react";

// Define the form schema
const attachmentSchema = z.object({
  type: z.enum(["file", "link", "email"] as const),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  url: z.string().min(1, {
    message: "URL is required.",
  }),
});

interface AddAttachmentProps {
  taskId: string;
}

const AddAttachment: React.FC<AddAttachmentProps> = ({ taskId }) => {
  const { addAttachment } = useTask();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      type: "file",
      name: "",
      url: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof attachmentSchema>) => {
    addAttachment(taskId, {
      type: values.type as AttachmentType,
      name: values.name,
      url: values.url,
    });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Paperclip className="h-4 w-4" />
          <span>Add Attachment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Attachment</DialogTitle>
          <DialogDescription>
            Add a file, link, or email attachment to this task.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter attachment name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch("type") === "file"
                      ? "File URL"
                      : form.watch("type") === "link"
                      ? "Link URL"
                      : "Email Address"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        form.watch("type") === "file"
                          ? "https://example.com/file.pdf"
                          : form.watch("type") === "link"
                          ? "https://example.com"
                          : "mailto:example@example.com"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Add Attachment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttachment;
