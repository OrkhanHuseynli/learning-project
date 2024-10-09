import { setTimeout } from "node:timers/promises";

// {
//    const scopedValue = "I am a SCOPED value"
// }


function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const timeStamp = addMinutes(new Date(), 2);

console.log("timestamp : ", timeStamp);

async function main() {
  let i = 0;

  while (new Date() <= timeStamp) {
    console.log("Loop cycle: ", i);
    console.log(scopedValue);
    i++;
    await setTimeout(1000);
  }
}

await main();
