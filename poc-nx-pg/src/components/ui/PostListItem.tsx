import Link from "next/link";

export function PostListItem({ title, id, content }) {
  return (
    <Link href={`/admin/${id}`}>
      <li className="cursor-pointer flex py-4 first:pt-0 last:pb-0 hover:border-2 rounded-md border-orange-500 mt-5">
        <img
          className="h-10 w-10 rounded-full"
          src="https://cdn-icons-png.flaticon.com/512/234/234606.png"
          alt=""
        />
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-500 truncate">{`content : ${content}`}</p>
        </div>
      </li>
    </Link>
  );
}
