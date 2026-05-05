import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { dashboardService } from '../services/dashboardService.js';
import { taskService } from '../services/taskService.js';
import { formatDate, isOverdue } from '../utils/date.js';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const metrics = useAsync(() => dashboardService.get(), []);
  const tasks = useAsync(() => taskService.list(), []);
  const recentTasks = (tasks.data || []).slice(0, 5);

  return (
    <>
      <PageHeader eyebrow={isAdmin ? 'Admin overview' : 'My work'} title="Dashboard">
        {isAdmin ? 'Track delivery health across the workspace.' : 'Keep your assigned work moving.'}
      </PageHeader>
      <ErrorBanner message={metrics.error || tasks.error} />
      {metrics.loading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total tasks" value={metrics.data?.totalTasks} />
          <StatCard label="Completed" value={metrics.data?.completedTasks} tone="green" />
          <StatCard label="Pending" value={metrics.data?.pendingTasks} tone="amber" />
          <StatCard label="Overdue" value={metrics.data?.overdueTasks} tone="rose" />
        </div>
      )}

      <section className="mt-8 rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Upcoming tasks</h3>
        </div>
        {tasks.loading ? <LoadingState label="Loading tasks..." /> : recentTasks.length === 0 ? (
          <EmptyState title="No tasks yet" message="Assigned work will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-3 font-medium text-ink">{task.title}</td>
                    <td>{task.projectName}</td>
                    <td>{task.assignedTo.name}</td>
                    <td><StatusBadge status={task.status} /></td>
                    <td className={isOverdue(task.dueDate, task.status) ? 'font-semibold text-rose-600' : 'text-slate-600'}>
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
