import { PostList } from "@/components/ui/PostList";
import { CreatePanel } from "../create-panel";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";
import { PostListWithAwait } from "@/components/ui/PostListServerWithAwait";
import { PostListServer } from "@/components/ui/PostListServer";

export default function Page() {
  return (
    <>
      <div className="container mx-auto mt-20">
        <span className="font-medium">What Is Included In This eBook?</span>
        <CreatePanel />
        <Suspense fallback={<Loading />}>
          <PostList />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PostListServer />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PostListWithAwait awaitTime={5000} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PostListWithAwait awaitTime={3000} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PostListWithAwait awaitTime={2000} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PostListWithAwait awaitTime={7000} />
        </Suspense>
      </div>
    </>
  );
}
