import { PostService } from "@/services/be/post.service";
import Loading from "./Loading";
import { PostListItem } from "./PostListItem";
import { Suspense, useEffect, useState } from "react";
import { AppServerContext } from "src/serverContext";

export async function PostListServer() {
  const postService = new PostService(AppServerContext.getPrisma());
  const skip = 0;
  const take = 100;
  const data = await postService.getPosts(skip);

  return (
    <ul role="list" className="p-6 divide-y divide-slate-200">
      <h1>I coming from Server</h1>
      {data.map((post) => (
        <PostListItem id={post.id} title={post.title} content={post.content} />
      ))}
    </ul>
  );
}
