import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { projectService } from '../services/projectService.js';
import { taskService } from '../services/taskService.js';
import { userService } from '../services/userService.js';
import { formatDate } from '../utils/date.js';
import { getErrorMessage } from '../utils/errorMessage.js';

const emptyTaskForm = {
  title: '',
  description: '',
  assignedToId: '',
  dueDate: '',
  status: 'TODO',
};

const taskColumns = [
  { status: 'TODO', title: 'To do' },
  { status: 'IN_PROGRESS', title: 'In progress' },
  { status: 'DONE', title: 'Done' },
];

export default function ProjectDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const project = useAsync(() => projectService.get(id), [id]);
  const tasks = useAsync(() => taskService.list(), []);
  const [members, setMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [savingMembers, setSavingMembers] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [savingTask, setSavingTask] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [taskError, setTaskError] = useState('');
  const projectTasks = (tasks.data || []).filter((task) => String(task.projectId) === String(id));
  const assignedMembers = members.filter((member) => selectedMemberIds.includes(member.id));

  useEffect(() => {
    if (isAdmin) {
      userService.members().then(setMembers).catch(() => setMembers([]));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (project.data?.members) {
      setSelectedMemberIds(project.data.members.map((member) => member.id));
    }
  }, [project.data]);

  function toggleMember(memberId) {
    setSelectedMemberIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : [...current, memberId],
    );
  }

  async function saveMembers() {
    if (!project.data) {
      return;
    }
    setSavingMembers(true);
    setMemberError('');
    try {
      await projectService.update(project.data.id, {
        name: project.data.name,
        description: project.data.description,
        memberIds: selectedMemberIds,
      });
      toast.success('Project members updated');
      const updatedProject = await project.refresh();
      if (updatedProject?.members) {
        setSelectedMemberIds(updatedProject.members.map((member) => member.id));
      }
    } catch (err) {
      setMemberError(getErrorMessage(err, 'Unable to update members'));
    } finally {
      setSavingMembers(false);
    }
  }

  async function createProjectTask(event) {
    event.preventDefault();
    if (!project.data) {
      return;
    }

    setSavingTask(true);
    setTaskError('');
    try {
      await taskService.create({
        ...taskForm,
        projectId: project.data.id,
        assignedToId: Number(taskForm.assignedToId),
      });
      toast.success('Task created');
      setTaskForm(emptyTaskForm);
      tasks.refresh();
    } catch (err) {
      setTaskError(getErrorMessage(err, 'Unable to create task'));
    } finally {
      setSavingTask(false);
    }
  }

  async function updateTaskStatus(task, status) {
    try {
      await taskService.update(task.id, { status });
      toast.success('Task status updated');
      tasks.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to update task status'));
    }
  }

  if (project.loading) {
    return <LoadingState label="Loading project..." />;
  }

  return (
    <>
      <PageHeader
        eyebrow={<Link className="inline-flex items-center gap-1 text-blue-600" to="/projects"><ArrowLeft size={15} /> Projects</Link>}
        title={project.data?.name || 'Project'}
      >
        {project.data?.description}
      </PageHeader>
      <ErrorBanner message={project.error || tasks.error || memberError || taskError} />

      {project.data && (
        <section className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold text-ink">Members</h3>
            {isAdmin && <button className="btn-primary" type="button" onClick={saveMembers} disabled={savingMembers}>{savingMembers ? 'Saving...' : 'Save members'}</button>}
          </div>
          {isAdmin ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {members.length === 0 ? <span className="text-sm text-slate-500">No member accounts found.</span> : members.map((member) => (
                <label key={member.id} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                  <input type="checkbox" checked={selectedMemberIds.includes(member.id)} onChange={() => toggleMember(member.id)} />
                  {member.name}
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.data.members.length === 0 ? <span className="text-sm text-slate-500">No members assigned.</span> : project.data.members.map((member) => (
                <span key={member.id} className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">{member.name}</span>
              ))}
            </div>
          )}
        </section>
      )}

      {isAdmin && project.data && (
        <section className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            <h3 className="text-base font-semibold text-ink">Assign Task</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">Create a task inside this project and assign it to one of the saved project members.</p>
          <form onSubmit={createProjectTask}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="label" htmlFor="taskTitle">Task title</label>
                <input className="input mt-1" id="taskTitle" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="taskDueDate">Due date</label>
                <input className="input mt-1" id="taskDueDate" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} required />
              </div>
              <div>
                <label className="label" htmlFor="taskAssignee">Assignee</label>
                <select className="input mt-1" id="taskAssignee" value={taskForm.assignedToId} onChange={(event) => setTaskForm({ ...taskForm, assignedToId: event.target.value })} required>
                  <option value="">Select project member</option>
                  {assignedMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                </select>
                {assignedMembers.length === 0 && (
                  <p className="mt-2 text-xs font-medium text-amber-700">Select members above, click Save members, then assign a task.</p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="taskStatus">Status</label>
                <select className="input mt-1" id="taskStatus" value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value })}>
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="taskDescription">Description</label>
              <textarea className="input mt-1 min-h-24" id="taskDescription" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} required />
            </div>
            <button className="btn-primary mt-4" disabled={savingTask || assignedMembers.length === 0}>
              {savingTask ? 'Assigning...' : 'Assign task'}
            </button>
          </form>
        </section>
      )}

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-ink">Task status</h3>
          <p className="text-sm text-slate-500">{projectTasks.length} task{projectTasks.length === 1 ? '' : 's'} in this project</p>
        </div>
        {tasks.loading ? <LoadingState label="Loading tasks..." /> : projectTasks.length === 0 ? (
          <EmptyState title="No tasks yet" message="Tasks for this project will appear here." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {taskColumns.map((column) => {
              const columnTasks = projectTasks.filter((task) => task.status === column.status);
              return (
                <div key={column.status} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-ink">{column.title}</h4>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-500">{columnTasks.length}</span>
                  </div>
                  {columnTasks.length === 0 ? (
                    <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">No tasks in this status.</p>
                  ) : (
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <div key={task.id} className="rounded-md border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h5 className="font-semibold text-ink">{task.title}</h5>
                            <StatusBadge status={task.status} />
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                          <p className="mt-3 text-xs text-slate-500">Assigned to {task.assignedTo.name}</p>
                          <p className="mt-1 text-xs text-slate-500">Due {formatDate(task.dueDate)}</p>
                          {isAdmin && (
                            <select className="input mt-3" value={task.status} onChange={(event) => updateTaskStatus(task, event.target.value)}>
                              <option value="TODO">To do</option>
                              <option value="IN_PROGRESS">In progress</option>
                              <option value="DONE">Done</option>
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
