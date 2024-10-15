"use server";
import prisma from "@/lib/prisma";

export async function Content() {
  console.log(" CONTENT PAGE LOADED ...");
  console.log("DATABASE_URL : ", process.env.DATABASE_URL);
  let users = undefined;
  let logs = "No Logs here";
  try {
    users = await prisma.user.findMany();
  } catch (e: any) {
    console.log(e);
    logs = JSON.stringify(e);
    console.log("COULD NOT CONNECT TO DB");
  }
  let name = undefined;
  if (users && users.length > 0) {
    name = users[0].name;
  }

  return (
    <>
      {name ? (
        <p>
          My name is <span style={{ color: "red" }}> {name} </span>
        </p>
      ) : (
        <>
          <p>There are no users here</p>
          <p style={{ color: "red" }}>{logs}</p>
        </>
      )}
    </>
  );
}
