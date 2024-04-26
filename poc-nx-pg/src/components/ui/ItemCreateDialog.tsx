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
import { PostService } from "../../services/ui";
import { PostCreateDto } from "../../dto";

type ItemCreateDialogState = {
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

const defaultTitle = "Post Title";

export function ItemCreateDialog() {
  const postService = new PostService();
  const [state, setState] = useState<ItemCreateDialogState>({
    title: defaultTitle,
    content: JSON.stringify(defaultValue),
  });
  const setEditorContent = (value: Value) => {
    setState({ ...state, content: JSON.stringify(value) });
  };
  // const [editorContent, setEditorContent] = useState<Value>(defaultValue);

  const saveBtnAction = () => {
    const createDto = new PostCreateDto();
    createDto.title = state.title;
    createDto.content = state.content;
    createDto.published = true;
    postService.createPost(createDto);
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
              defaultValue={defaultTitle}
              className="col-span-4"
              onChange={(e) => {
                setState({ ...state, title: e.target.value });
              }}
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-1">
            <label htmlFor="content" className="text-center col-span-1">
              Body
            </label>
            <div className="col-span-4">
              <RichText
                setEditorContent={setEditorContent}
                initialValue={defaultValue}
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
