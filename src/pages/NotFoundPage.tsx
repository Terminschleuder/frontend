import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="text-4xl">🧭</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        That route doesn't exist.
      </p>
      <Link to="/" className="text-sm underline">
        Go home
      </Link>
    </div>
  );
}