export default function SystemSwitcher({ systems, value, onChange }) {
  return (
    <label className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
      <span className="hidden sm:inline">System</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 max-w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 focus:border-sky-500 focus:outline-none"
      >
        {systems.map((s) => (
          <option key={s.id} value={s.id} disabled={!s.file}>
            {s.title}
            {s.file ? '' : ' (coming soon)'}
          </option>
        ))}
      </select>
    </label>
  );
}
