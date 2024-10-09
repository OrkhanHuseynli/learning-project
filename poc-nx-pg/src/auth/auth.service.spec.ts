import { AuthService } from "./auth.service";

describe(`Test ${AuthService.name}`, () => {
  it("Same instance should be returned", async () => {
    expect.assertions(2);
    const pwd = "HowMan1239jww33";
    const hashed = AuthService.hashPassword(pwd);
    const result = AuthService.validatePassword(pwd, hashed);
    const falseResult = AuthService.validatePassword("838reason", hashed);
    expect(result).toEqual(true);
    expect(falseResult).toEqual(false);
  });
});
