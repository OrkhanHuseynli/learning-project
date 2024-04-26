import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto mt-20">
        <Link
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30 hover:border-blue-500"
          href={"/admin"}
        >
          Admin Page
        </Link>
      </div>
    </main>
  );
}
