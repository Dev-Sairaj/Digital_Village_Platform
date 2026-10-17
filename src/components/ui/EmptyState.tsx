export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="px-[18px] py-10 text-center">
      <p className="text-[14px] font-semibold text-s6">{title}</p>
      <p className="mt-1 text-[13px] text-s5">{hint}</p>
    </div>
  );
}
