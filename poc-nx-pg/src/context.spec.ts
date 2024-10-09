import { AppServerContext } from "./serverContext";

describe(`Test ${AppServerContext.name}`, () => {
  it("Same instance should be returned", () => {
    expect.assertions(1);

    const s1 = AppServerContext.getInstance();
    const s2 = AppServerContext.getInstance();

    expect(s1).toEqual(s2);
  });
});
