import { setTimeout } from "timers/promises";
import { PostService } from "../../services/ui";


export async function PostListWithAwait({ awaitTime }) {
  const postService = new PostService();
  const skip = 0;
  const take = 100;
  // const data = await postService.getPosts(skip, take);

  await setTimeout(awaitTime);

  return (
    <ul role="list" className="p-6 divide-y divide-slate-200 bg-secondary">
      <h1>You have waited {awaitTime / 1000} seconds ☕☕☕ </h1>
    </ul>
  );
}
