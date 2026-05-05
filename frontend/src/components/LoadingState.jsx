export default function LoadingState({ label = 'Loading workspace...' }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-md border border-slate-200 bg-white">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span className="ml-3 text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
