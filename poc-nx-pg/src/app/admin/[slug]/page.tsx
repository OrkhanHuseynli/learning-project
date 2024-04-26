"use client";
import { useEffect, useState } from "react";
import { RichText } from "../../../components/ui/rich-text/RichText";
import { Button } from "../../../components/ui/plate-ui/button";
import { Value } from "@udecode/plate-common";
import { PostService } from "../../../services";

export default function Page({ params }: { params: { slug: string } }) {
  const postService = new PostService();
  const [data, setData] = useState({
    post: { title: "", content: "", published: true },
  });
  const [editorContent, setEditorContent] = useState<Value>(null);

  useEffect(() => {
    fetch(`/api/post/${params.slug}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setEditorContent(JSON.parse(data.post.content));
        setData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const saveContent = () => {
    postService.updatePost(params.slug, {
      title: data.post.title,
      published: data.post.published,
      content: JSON.stringify(editorContent),
    });
  };

  if (data) {
    return (
      <div>
        <h1>{data.post.title}</h1>
        <p>Published : {data.post.published}</p>
        <div className="container mx-auto mt-10px">
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveContent}
          >
            Save
          </Button>
        </div>
        <div className="container mx-auto mt-10px">
          <RichText
            setEditorContent={setEditorContent}
            initialValue={editorContent}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>Loading ....</p>
    </div>
  );
}
