export class StringEncoder {
  static encoding = "utf-8";
  static encode(text: string): Uint8Array {
    const b = Buffer.from(text);
    return new Uint8Array(b);
  }

  static decode(encodedText: Uint8Array): string {
    return Buffer.from(encodedText.buffer).toString();
  }
}
