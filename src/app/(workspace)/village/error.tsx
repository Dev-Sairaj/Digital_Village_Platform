"use client";

import { ActionButton } from "@/components/ui/ActionButton";

export default function VillageError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-[28px] font-bold text-n8">The dashboard could not load</h1>
      <p className="mt-2 text-[14px] text-s5">
        The village data did not arrive. Check your connection and try again.
      </p>
      <ActionButton className="mt-6" onClick={reset}>
        Try again
      </ActionButton>
    </div>
  );
}
