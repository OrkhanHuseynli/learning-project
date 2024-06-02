import { describe } from "node:test";
import { SessionPayload, SessionService } from "./session.service";


describe(`Test ${SessionService.name}`, () => {
  it("Same instance should be returned", async () => {
    expect.assertions(2);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionPayload: SessionPayload = {
      email: "test@gmail.com",
      userId: "1",
    };
    const jwt = await SessionService.encrypt(sessionPayload);
    const decodedJwt = await SessionService.decrypt(jwt);
    expect(sessionPayload.userId).toEqual(decodedJwt.userId);
    expect(sessionPayload.userId).not.toEqual("eeee");

    // console.log(decodedJwt);
  });
});
