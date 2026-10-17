import { Skeleton } from "@/components/ui/Skeleton";

// Matches the final layout so nothing shifts when data arrives.
export function VillageDashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading village dashboard">
      <div className="relative bg-linear-to-br from-n8 to-n9 pb-[104px] pt-5">
        <div className="mx-auto w-full max-w-[1560px] px-4 min-[900px]:px-8">
          <div className="h-4 w-72 max-w-full rounded bg-white/10" />
          <div className="mt-6 h-10 w-56 rounded bg-white/10" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />
        </div>
        <div aria-hidden="true" className="hero-strip absolute inset-x-0 bottom-0" />
      </div>
      <div className="relative z-10 mx-auto -mt-[62px] w-full max-w-[1560px] space-y-[14px] px-4 pb-10 min-[900px]:px-8">
        <div className="grid grid-cols-2 gap-[14px] min-[620px]:grid-cols-3 min-[1180px]:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="rounded-card border border-s2 bg-white p-4 shadow-kpi">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="mt-4 h-8 w-20" />
              <Skeleton className="mt-3 h-3.5 w-16" />
              <Skeleton className="mt-3 h-8 w-full" />
            </div>
          ))}
        </div>
        <div className="grid gap-[14px] min-[1180px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Skeleton className="h-[380px] rounded-card" />
          <Skeleton className="h-[380px] rounded-card" />
        </div>
        <Skeleton className="h-[400px] rounded-card" />
        <Skeleton className="h-[360px] rounded-card" />
      </div>
    </div>
  );
}
