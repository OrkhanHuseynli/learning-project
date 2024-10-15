const reset = '\x1b[0m';

export class SimpleLog {
  static green(text: string) {
    console.log('\x1b[32m' + text + reset);
  }
  static red(text: string) {
    console.log('\x1b[31m' + text + reset);
  }
  static blue(text: string) {
    console.log('\x1b[34m' + text + reset);
  }
  static yellow(text: string) {
    console.log('\x1b[33m' + text + reset);
  }
}
