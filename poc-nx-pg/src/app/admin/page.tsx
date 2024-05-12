import { PostList } from "../../components/ui/PostList";
import { CreatePanel } from "./create-panel";

export default function Page() {
  return (
    <>
      <div className="container mx-auto mt-20">
        <span className="font-medium">What Is Included In This eBook?</span>
        <CreatePanel />
        <PostList />
      </div>
    </>
  );
}
