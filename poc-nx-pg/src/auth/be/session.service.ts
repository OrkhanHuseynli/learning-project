import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { setMinutes } from "date-fns";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export class SessionPayload implements JWTPayload {
  [propName: string]: unknown;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number;
  exp?: number;
  iat?: number;
  email: string;
  userId: string;
}

export class SessionService {
  static algorithm: string = "HS256";

  static createExpDate(minutes: number): Date {
    let t = new Date();
    t.setMinutes(t.getMinutes() + minutes);
    return t;
  }

  static async encrypt(payload: SessionPayload): Promise<string> {
    let t = new Date();
    t.setMinutes(t.getMinutes() + 10);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: SessionService.algorithm })
      .setIssuedAt(new Date())
      .setExpirationTime(t)
      .sign(encodedKey);
  }

  static async decrypt(
    session: string | undefined = ""
  ): Promise<SessionPayload> {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: [this.algorithm],
      });
      return payload as SessionPayload;
    } catch (error) {
      console.log("Failed to verify session");
    }
  }

  static createSessionWithJwt(jwt: string, expiresAt: Date): string {
    cookies().set("session", jwt, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return jwt;
  }

  static async createSession(
    userId: string,
    email: string,
    expiresAt: Date
  ): Promise<string> {
    const session = await SessionService.encrypt({ userId, email, expiresAt });

    cookies().set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return session;
  }
}
