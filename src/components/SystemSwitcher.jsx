// Groups systems by category, keeping the order categories first appear in index.json.
function groupByCategory(systems) {
  const groups = new Map();
  for (const s of systems) {
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category).push(s);
  }
  return [...groups];
}

export default function SystemSwitcher({ systems, value, onChange }) {
  const live = systems.filter((s) => s.file).length;

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
      <span className="hidden whitespace-nowrap sm:inline">
        {live} of {systems.length} live
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-base text-slate-100 sm:text-sm focus:border-sky-500 focus:outline-none"
      >
        {groupByCategory(systems).map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((s) => (
              <option key={s.id} value={s.id} disabled={!s.file} title={s.description}>
                {s.title}
                {s.file ? '' : ' (coming soon)'}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
