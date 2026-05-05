export default function PageHeader({ eyebrow, title, actions, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-semibold text-ink">{title}</h2>
        {children && <p className="mt-2 max-w-2xl text-sm text-slate-600">{children}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
