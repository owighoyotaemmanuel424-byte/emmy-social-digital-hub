import Link from 'next/link';
import { BRAND } from '@/lib/branding';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl max-w-md w-full space-y-4">
        <div className="font-mono text-5xl font-black text-emerald-400">404</div>
        <h2 className="text-lg font-bold text-white">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested page could not be found or has moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md transition"
        >
          Return to {BRAND.name}
        </Link>
      </div>
    </div>
  );
}
