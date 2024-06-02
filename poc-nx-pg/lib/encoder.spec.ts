import { describe } from "node:test";
import { StringEncoder } from "./encoder";

describe(`Test ${StringEncoder.name}`, () => {
  it("Same instance should be returned", () => {
    expect.assertions(2);

    const text = "Hello World!"
    const encoded = StringEncoder.encode(text);
    const decoded = StringEncoder.decode(encoded)
    expect(encoded).not.toEqual(text)
    expect(decoded).toEqual(text);
  });
});
