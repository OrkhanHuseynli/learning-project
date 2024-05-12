import { describe } from "node:test";
import { validateEmail } from "./validators";

describe(`Test validators`, () => {
  it("email validator must work", () => {
    expect.assertions(2);
    const email = "name@email.com";
    const notEmail = "anything.com";

    expect(validateEmail(email)).toBe(true);
    expect(validateEmail(notEmail)).toBe(false);
  });
});
