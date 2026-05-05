export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold text-blue-600">Project Workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
