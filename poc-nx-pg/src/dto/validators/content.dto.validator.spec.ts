import { describe } from "node:test";
import { PostDto } from "../post.dto";
import { validateContentDto } from "./content.dto.validator";

describe(`Test ${PostDto.name}`, () => {
  it("Validator must work", () => {
    expect.assertions(3);

    const c1 = new PostDto();

    expect(validateContentDto(c1)).toBe(true);
    expect(validateContentDto({})).toBe(false);
    expect(validateContentDto({ id: 1, text: "true name" })).toBe(false);
  });
});
