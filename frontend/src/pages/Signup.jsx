import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/errorMessage.js';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(form);
      toast.success('Workspace account created');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create account'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Start with an admin account, then invite members.">
      <ErrorBanner message={error} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input className="input mt-1" id="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="input mt-1" id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="input mt-1" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </div>
        <div>
          <label className="label" htmlFor="role">Role</label>
          <select className="input mt-1" id="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already have access? <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">Sign in</Link>
      </p>
    </AuthCard>
  );
}
