// "use client";
// import { Suspense, useCallback, useEffect, useState } from "react";
// import { cn } from "@udecode/cn";
// import { RichText } from "./RichText";
// import { Button } from "../plate-ui/button";

// class ContentRepo {
//   store(content: string) {
//     localStorage.setItem("content", content);
//   }
//   get(): string | null {
//     return localStorage.getItem("content");
//   }
// }

// const defaultValue = [
//   {
//     id: "1",
//     type: "p",
//     children: [{ text: "Hello, World!" }],
//   },
// ];

// export function RichTextWrapper() {
//   const repo = new ContentRepo();
//   const [editorContent, setEditorContent] = useState(null);
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/content?id=1")
//       .then((res) => res.json())
//       .then((data) => {
//         // setEditorContent(data.post.content);
//         setEditorContent(defaultValue);

//         setLoading(false);
//       });
//   }, []);

//   //   if (isLoading) return <p>Loading...</p>
//   //   if (!data) return <p>No profile data</p>

//   function parseContent() {
//     let result: string | null = "";
//     try {
//       result = repo.get();
//       console.log(`Result ${result}`);
//     } catch (e) {
//       console.log(`Failed to fetch the content: ${e}`);
//       console.log(e);
//     }

//     if (result !== "" && result !== null) {
//       console.log(` Editor content : ${result}`);
//       //   setEditorContent(result);
//       return JSON.parse(result);
//     }
//     return undefined;
//   }
//   const initialValue = parseContent();

//   const saveContent = (): void => {
//     repo.store(editorContent);
//   };

//   return (
//     <div
//       style={{
//         margin: "30px auto",
//         // padding: "10px",
//         width: "600px",
//         // height: "900px",
//         // display: "flex",
//         // justifyContent: "center",
//         // justifyItems: "center",
//         // alignContent: "space-between",
//         // flexWrap: "wrap",
//         // flexDirection: "row",
//         // rowGap: "10px",
//         // columnGap: "2em",
//       }}
//     >
//       <div style={{ width: "600px", height: "900px" }}>
//         <Button
//           variant="ghost"
//           className={cn("h-6 p-1 text-muted-foreground")}
//           onClick={saveContent}
//         >
//           Save
//         </Button>
//         <RichText
//           setEditorContent={setEditorContent}
//           initialValue={editorContent}
//         />
//       </div>
//       {/* <div
//             style={{
//               border: "1px solid black",
//               alignSelf: "center",
//               width: "500px",
//               height: "700px",
//             }}
//           ></div> */}
//     </div>
//   );
// }
