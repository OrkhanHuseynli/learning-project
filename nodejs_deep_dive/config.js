export const host = "localhost";
export const port = "3000";
export function getDate() {
  const d = new Date();
  return d.toTimeString().split(" ")[0] + " " + getMilliseconds(d);
}

function getMilliseconds(d) {
  return d.getMilliseconds();
}
