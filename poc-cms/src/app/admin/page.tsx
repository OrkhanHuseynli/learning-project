import { RichTextWrapper } from "@/components/rich-text/RichTextWrapper";
import { Suspense } from "react";

export default function Page() {
  // const fetchMyAPI = useCallback(async () => {
  //   let result = await repo.get();
  //   console.log(`Result ${result}`);
  //   setEditorContent(result);
  // }, [editorContent]); // if userId changes, useEffect will run again

  // useEffect(() => {
  //   fetchMyAPI();
  // }, [fetchMyAPI]);

  return <RichTextWrapper />;
}
