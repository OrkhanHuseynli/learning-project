"use client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./plate-ui";

import { Button, Input } from "./plate-ui";
import { RichText } from "./rich-text/RichText";
import { Value } from "@udecode/plate-common";

type ItemCreateDialog = {
  title: string;
  content: string;
};

const defaultValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "Hello, World!" }],
  },
];

export function ItemCreateDialog() {
  const [state, setState] = useState<ItemCreateDialog>({
    title: "",
    content: "",
  });
  const [editorContent, setEditorContent] = useState<Value>(defaultValue);

  const saveBtnAction = () => {
    console.log(editorContent);
  };

  const validateState = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[730px]">
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>Create a new post item</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-1">
            <label htmlFor="title" className="text-center">
              Title
            </label>
            <Input
              id="title"
              defaultValue="A New Post Title"
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-1">
            <label htmlFor="content" className="text-center col-span-1">
              Body
            </label>
            <div className="col-span-4">
              <RichText
                setEditorContent={setEditorContent}
                initialValue={editorContent}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={saveBtnAction}>
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
