"use client";
import { Suspense } from "react";
export const dynamic = 'force-dynamic'

export default function NotFound() {

  return (
    <Suspense>
      <section className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-4xl font-medium">404 || Not Found</h2>
        <p className="mt-2">Could not find requested resource</p>
      </section>
    </Suspense>
  );
}
