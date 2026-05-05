import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message = 'Create a record to get started.' }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <Inbox className="mx-auto mb-3 text-slate-400" size={30} />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  );
}
