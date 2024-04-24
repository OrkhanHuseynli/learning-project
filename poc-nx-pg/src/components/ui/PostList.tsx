"use client";

import { PostListItem } from "./PostListItem";
import { useEffect, useState } from "react";

export function PostList() {
  const [data, setData] = useState({
    posts: [{ id: 1, title: "", content: "" }],
  });
  const skip = 0;
  const take = 100;
  useEffect(() => {
    fetch(`/api/content?skip=${skip}&take=${take}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.error(error));
  }, []);

  if (data && data.posts) {
    return (
      <ul role="list" className="p-6 divide-y divide-slate-200">
        {data.posts.map((post) => (
          <PostListItem
            id={post.id}
            title={post.title}
            content={post.content}
          />
        ))}
      </ul>
    );
  }
  return (
    <ul role="list" className="p-6 divide-y divide-slate-200">
      <h3>Loading ... </h3>
    </ul>
  );
}
