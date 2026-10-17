export function SyncIndicator() {
  return (
    <div className="inline-flex items-center gap-2 text-[13px] font-medium text-n3">
      <span aria-hidden="true" className="relative grid size-2.5 place-items-center">
        <span className="sync-ring absolute inset-0 rounded-full bg-g4" />
        <span className="relative size-2 rounded-full bg-g4" />
      </span>
      Live sync
    </div>
  );
}
