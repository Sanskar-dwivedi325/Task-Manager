import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { taskService } from '../services/taskService.js';
import { formatDate, isOverdue } from '../utils/date.js';
import { getErrorMessage } from '../utils/errorMessage.js';

export default function TaskManagement() {
  const { isAdmin } = useAuth();
  const tasks = useAsync(() => taskService.list(), []);

  async function handleStatusChange(task, status) {
    try {
      await taskService.update(task.id, { status });
      toast.success('Task updated');
      tasks.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update task'));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) {
      return;
    }
    try {
      await taskService.remove(id);
      toast.success('Task deleted');
      tasks.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete task'));
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={isAdmin ? 'Admin tasking' : 'Assigned tasks'}
        title="Task Management"
      >
        {isAdmin ? 'Monitor all workspace tasks. Create new tasks inside each project.' : 'Update status as your work progresses.'}
      </PageHeader>
      <ErrorBanner message={tasks.error} />

      {tasks.loading ? <LoadingState label="Loading tasks..." /> : (tasks.data || []).length === 0 ? (
        <EmptyState title="No tasks yet" message={isAdmin ? 'Create tasks for a project.' : 'You do not have assigned tasks.'} />
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-soft">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Due</th>
                <th className="w-36">Update</th>
                {isAdmin && <th className="w-16"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.data.map((task) => (
                <tr key={task.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-ink">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                  </td>
                  <td>{task.projectName}</td>
                  <td>{task.assignedTo.name}</td>
                  <td><StatusBadge status={task.status} /></td>
                  <td className={isOverdue(task.dueDate, task.status) ? 'font-semibold text-rose-600' : 'text-slate-600'}>{formatDate(task.dueDate)}</td>
                  <td>
                    <select className="input w-32" value={task.status} onChange={(event) => handleStatusChange(task, event.target.value)}>
                      <option value="TODO">To do</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => handleDelete(task.id)} title="Delete task">
                        <Trash2 size={17} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
