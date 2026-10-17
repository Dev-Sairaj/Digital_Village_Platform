// Built from the signed-in user's scope; never hard-code the strings.
export function Breadcrumb({ trail, current }: { trail: readonly string[]; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-n3">
        {trail.map((name) => (
          <li key={name} className="flex items-center gap-2">
            <span>{name}</span>
            <span aria-hidden="true">{"\u203A"}</span>
          </li>
        ))}
        <li aria-current="page" className="font-semibold text-white">
          {current}
        </li>
      </ol>
    </nav>
  );
}
