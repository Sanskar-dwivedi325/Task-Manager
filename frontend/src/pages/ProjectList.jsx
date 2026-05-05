import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { projectService } from '../services/projectService.js';
import { userService } from '../services/userService.js';
import { formatDate } from '../utils/date.js';
import { getErrorMessage } from '../utils/errorMessage.js';

const emptyForm = { name: '', description: '', memberIds: [] };

export default function ProjectList() {
  const { isAdmin } = useAuth();
  const projects = useAsync(() => projectService.list(), []);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      userService.members().then(setMembers).catch(() => setMembers([]));
    }
  }, [isAdmin]);

  function toggleMember(id) {
    const memberIds = form.memberIds.includes(id)
      ? form.memberIds.filter((memberId) => memberId !== id)
      : [...form.memberIds, id];
    setForm({ ...form, memberIds });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await projectService.create(form);
      toast.success('Project created');
      setForm(emptyForm);
      projects.refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create project'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project and its tasks?')) {
      return;
    }
    try {
      await projectService.remove(id);
      toast.success('Project deleted');
      projects.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to delete project'));
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        actions={isAdmin && <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"><Plus size={16} /> New project</span>}
      >
        {isAdmin ? 'Create projects and manage project membership.' : 'Review projects assigned to you.'}
      </PageHeader>
      <ErrorBanner message={projects.error || error} />

      {isAdmin && (
        <form className="mb-6 rounded-md border border-slate-200 bg-white p-5 shadow-soft" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="label" htmlFor="projectName">Project name</label>
              <input className="input mt-1" id="projectName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div>
              <label className="label">Members</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {members.length === 0 ? <span className="text-sm text-slate-500">Create member accounts to assign them.</span> : members.map((member) => (
                  <label key={member.id} className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                    <input type="checkbox" checked={form.memberIds.includes(member.id)} onChange={() => toggleMember(member.id)} />
                    {member.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="projectDescription">Description</label>
            <textarea className="input mt-1 min-h-24" id="projectDescription" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          </div>
          <button className="btn-primary mt-4" disabled={saving}>{saving ? 'Creating...' : 'Create project'}</button>
        </form>
      )}

      {projects.loading ? <LoadingState label="Loading projects..." /> : (projects.data || []).length === 0 ? (
        <EmptyState title="No projects yet" message={isAdmin ? 'Create the first workspace project.' : 'You have not been assigned to any projects.'} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.data.map((project) => (
            <article key={project.id} className="group relative rounded-md border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
              <Link to={`/projects/${project.id}`} className="absolute inset-0 rounded-md" aria-label={`Open ${project.name}`} />
              <div className="relative flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-ink transition group-hover:text-blue-700">{project.name}</h3>
                {isAdmin && (
                  <button className="relative z-10 rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => handleDelete(project.id)} title="Delete project">
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              <p className="relative mt-2 line-clamp-3 text-sm text-slate-600">{project.description}</p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {project.members.map((member) => (
                  <span key={member.id} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{member.name}</span>
                ))}
              </div>
              <p className="relative mt-4 text-xs text-slate-500">Created {formatDate(project.createdAt?.slice(0, 10))}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
