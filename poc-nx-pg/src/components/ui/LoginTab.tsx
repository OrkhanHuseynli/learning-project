"use client";
import { cookies } from "next/headers";
import { Button } from "./plate-ui";

export function LoginTab({ session }) {
  if (session) {
    return (
      <button
        onClick={async () => {
          await fetch("/api/auth/login", { method: "DELETE" });
          window.location.href = "/";
        }}
        // href="/logout"
        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
      >
        Log out
      </button>
    );
  }

  return (
    <a
      href="/login"
      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
    >
      Login
    </a>
  );
}
