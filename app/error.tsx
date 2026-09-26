'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error if needed
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xs max-w-md w-full space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">Something went wrong</h2>
        <p className="text-xs text-neutral-500">
          An error occurred while loading this view.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
