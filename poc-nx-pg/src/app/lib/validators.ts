import { isEmail } from "validator";

export function validateEmail(email: string): boolean {
  return isEmail(email);
}
