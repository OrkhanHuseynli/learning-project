import { TDescendant, TElement, TText } from "@udecode/plate-common";

export function validateEditorContent(value: any): TElement[] {
  const text: TText = { text: "" };
  const children: TDescendant[] = [text];
  const defaultValue: TElement[] = [{ id: "1", type: "p", children }];
  if (!Array.isArray(value)) {
    return defaultValue;
  }
  // TODO: probably we need traverse entire tree and check the validity
  if (
    value.length == 0 ||
    value[0]["children"] === undefined ||
    value[0]["type"] == undefined
  ) {
    console.info("ERROR: invalid initialValue was set for the Editor");
    return defaultValue;
  }

  return value;
}
