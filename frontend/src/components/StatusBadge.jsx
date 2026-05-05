const labels = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

const styles = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-50 text-blue-700',
  DONE: 'bg-emerald-50 text-emerald-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.TODO}`}>
      {labels[status] || status}
    </span>
  );
}
