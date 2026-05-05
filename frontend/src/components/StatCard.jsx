export default function StatCard({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    rose: 'border-rose-100 bg-rose-50 text-rose-700',
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`mb-4 inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
        {label}
      </div>
      <p className="text-3xl font-semibold text-ink">{value ?? 0}</p>
    </div>
  );
}
