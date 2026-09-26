import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs max-w-md w-full space-y-4">
        <div className="font-mono text-4xl font-extrabold text-neutral-900">404</div>
        <h2 className="text-lg font-bold text-neutral-900">Page Not Found</h2>
        <p className="text-xs text-neutral-500">
          The requested resource could not be found or has moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
        >
          Return to JejePay Dashboard
        </Link>
      </div>
    </div>
  );
}
